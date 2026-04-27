const { verifyToken } = require("../utils/jwt");
const { supabase } = require("../utils/supabase");

async function refreshSubscriptionIfNeeded(user) {
  if (user.subscription_status === "TRIAL" && user.trial_ends_at) {
    const trialEndsAt = new Date(user.trial_ends_at);
    if (trialEndsAt.getTime() <= Date.now()) {
      const { data, error } = await supabase
        .from("users")
        .update({ subscription_status: "EXPIRED" })
        .eq("id", user.id)
        .select("id, name, email, role, subscription_status, trial_ends_at, stripe_customer_id, stripe_subscription_id, created_at")
        .single();

      if (!error && data) {
        return data;
      }
    }
  }

  return user;
}

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Niet geauthenticeerd." });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = verifyToken(token);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, subscription_status, trial_ends_at, stripe_customer_id, stripe_subscription_id, created_at")
      .eq("id", payload.sub)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Sessie niet geldig." });
    }

    req.user = await refreshSubscriptionIfNeeded(user);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Sessie niet geldig." });
  }
}

module.exports = {
  requireAuth,
};
