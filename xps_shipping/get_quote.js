/** @format */

const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: "https://xpsshipper.com",
  timeout: 10000,
  headers: { Authorization: `RSIS ${process.env.XPS_API_KEY}` },
});

const get_qoute = async (arr) => {
  let shipping_cost = 0;

  await Promise.all(
    arr.map(async (i) => {
      await axiosInstance
        .post(`/restapi/v1/customers/${process.env.XPS_CUSTOMER_ID}/quote`, {
          carrierCode: "usps",
          serviceCode: "usps_ground_advantage",
          packageTypeCode: "usps_custom_package",
          sender: {
            country: "US",
            zip: "80003",
          },
          receiver: {
            city: i.city,
            zip: i.postalCode,
            country: "US",
          },
          residential: true,
          signatureOptionCode: null,
          contentDescription: "stuff and things",
          weightUnit: "oz",
          dimUnit: "in",
          currency: "USD",
          customsCurrency: "USD",
          pieces: i.items,
          billing: {
            party: "sender",
          },
        })
        .then(function (response) {
          shipping_cost += Number(response.data.totalAmount);
        })
        .catch(function (error) {
          console.log(error);
          throw error;
        });
    })
  );
  return shipping_cost;
};

module.exports = get_qoute;
