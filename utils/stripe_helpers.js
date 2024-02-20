/** @format */

const stripe = require("stripe")(process.env.SECRET_KEY);

async function createCustomer({ email }) {
  const customer = await stripe.customers.create({
    name: "name",
    email,
  });

  return customer;
}

async function createPaymentIntent(amount, data, customerId) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    customer: customerId,
    setup_future_usage: "off_session",
    metadata: data,
  });

  return paymentIntent;
}

async function confirmPaymentIntent(paymentIntentid) {
  try {
    await stripe.paymentIntents.confirm(paymentIntentid, {
      payment_method: "pm_card_visa",
      return_url: "https://www.example.com",
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createCustomer, createPaymentIntent, confirmPaymentIntent };
