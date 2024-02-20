/** @format */

const axios = require("axios");

const { v4: uuidv4 } = require("uuid");

const axiosInstance = axios.create({
  baseURL: "https://xpsshipper.com",
  timeout: 10000,
  headers: { Authorization: `RSIS ${process.env.XPS_API_KEY}` },
});

function getCurrentDateFormatted() {
  const currentDate = new Date();

  // Get the year, month, and day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");

  // Create the formatted date string
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const confirm_order = async (order, shipping_details, itemList, order_id) => {
  console.log(order_id, "cinfurm order id");
  // Generate a UUID
  const secret_id = uuidv4();
  await axiosInstance
    .put(
      `/restapi/v1/customers/${process.env.XPS_CUSTOMER_ID}/integrations/${process.env.XPS_INTEGRATION_ID}/orders/${secret_id}`,
      {
        orderId: `${secret_id}`,
        orderDate: getCurrentDateFormatted(),
        orderNumber: String(order_id),
        fulfillmentStatus: "pending",
        shippingService: "Standard",
        shippingTotal: String(order.shipping_cost),
        weightUnit: "lb",
        dimUnit: "in",
        dueByDate: null,
        orderGroup: null,
        contentDescription: "Stuff and things",
        sender: {
          name: "Jonathan Tafoya",
          company: "Teachers Club",
          address1: "6679 Chase St.",
          address2: "",
          city: "Arvada",
          state: "CO",
          zip: "80003",
          country: "US",
          phone: "720-934-2219",
          email: "admin@myteachersclub.com",
        },
        returnTo: {
          name: "Jonathan Tafoya",
          company: "Teachers Club",
          address1: "6679 Chase St.",
          address2: "",
          city: "Arvada",
          state: "CO",
          zip: "80003",
          country: "US",
          phone: "720-934-2219",
          email: "admin@myteachersclub.com",
        },
        receiver: {
          name: order.first_name + " " + order.last_name,
          phone: order.number,
          email: order.email,
          company: "",
          address1: `${shipping_details.delivery_address}`,
          address2: "",
          city: `${shipping_details.city}`,
          zip: `${shipping_details.postal_code}`,
          state: "CO",
          country: "US",
        },
        items: itemList,
        packages: null,
      }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
};

module.exports = confirm_order;
