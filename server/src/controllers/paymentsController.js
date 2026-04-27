const Stripe = require("stripe");
const { supabase } = require("../utils/supabase");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(req, res, next) {
  try {
    if (req.user.subscription_status === "ACTIVE") {
      return res.status(400).json({ message: "Je abonnement is al actief." });
    }

    let stripeCustomerId = req.user.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user.id,
        },
      });

      stripeCustomerId = customer.id;

      await supabase
        .from("users")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", req.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Helpse Premium",
              description: "Toegang tot alle acties op Helpse",
            },
            recurring: {
              interval: "month",
            },
            unit_amount: 299,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user.id,
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    return next(error);
  }
}

async function handleWebhookEvent(event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (userId) {
        await supabase
          .from("users")
          .update({
            subscription_status: "ACTIVE",
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
          })
          .eq("id", userId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await supabase
        .from("users")
        .update({ subscription_status: "EXPIRED" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        await supabase
          .from("users")
          .update({ subscription_status: "EXPIRED" })
          .eq("stripe_subscription_id", subscriptionId);
      }
      break;
    }
    default:
      break;
  }
}

async function stripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  await handleWebhookEvent(event);

  return res.json({ received: true });
}

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
