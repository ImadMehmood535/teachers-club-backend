/** @format */

var cron = require("node-cron");

const stripePayment = require("./stripe_payment");

cron.schedule("1 1 7 * *", stripePayment);
