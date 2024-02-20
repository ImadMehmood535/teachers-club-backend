/** @format */

const create_order = require("@/utils/create_order");
const update_subscription = require("@/utils/update_subscription");
const stripe = require("stripe");
const webhookHandler = (request, response) => {
  //   express.json({ type: "application/json" }),
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.WEBHOOK_KEY
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const paymentIntent = event.data.object;
  switch (event.type) {
    case "payment_intent.succeeded":
      const date = new Date().getDate();
      if (date == process.env.CRON_JOB_DAY) {
        create_order(paymentIntent.metadata.subscribesId);
        update_subscription(paymentIntent.metadata.subscribesId, true, false);
      } else {
        update_subscription(paymentIntent.metadata.subscribesId, true, true);
      }
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_intent.payment_failed":
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};

module.exports = webhookHandler;
