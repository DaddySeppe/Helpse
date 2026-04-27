const bcrypt = require("bcryptjs");
const { supabase } = require("../utils/supabase");
const { signToken } = require("../utils/jwt");
const { getUserAccess } = require("../utils/access");

const PUBLIC_USER_FIELDS =
  "id, name, email, role, subscription_status, trial_ends_at, stripe_customer_id, stripe_subscription_id, created_at";

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;

  return {
    ...safeUser,
    access: getUserAccess(safeUser),
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Vul alle verplichte velden in." });
    }

    if (!["CUSTOMER", "STUDENT"].includes(role)) {
      return res.status(400).json({ message: "Ongeldige rol." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Wachtwoord moet minstens 8 tekens bevatten." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role,
        subscription_status: "TRIAL",
        trial_ends_at: trialEndsAt,
      })
      .select(PUBLIC_USER_FIELDS)
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email bestaat al." });
      }
      throw error;
    }

    const token = signToken(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email en wachtwoord zijn verplicht." });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select(`password_hash, ${PUBLIC_USER_FIELDS}`)
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Ongeldige login." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Ongeldige login." });
    }

    if (user.subscription_status === "TRIAL" && user.trial_ends_at && new Date(user.trial_ends_at).getTime() <= Date.now()) {
      const { data: expiredUser } = await supabase
        .from("users")
        .update({ subscription_status: "EXPIRED" })
        .eq("id", user.id)
        .select(PUBLIC_USER_FIELDS)
        .single();

      if (expiredUser) {
        const token = signToken(expiredUser);
        return res.json({ token, user: sanitizeUser(expiredUser) });
      }
    }

    const token = signToken(user);
    return res.json({
      token,
      user: sanitizeUser({
        ...user,
      }),
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

module.exports = {
  register,
  login,
  me,
};
