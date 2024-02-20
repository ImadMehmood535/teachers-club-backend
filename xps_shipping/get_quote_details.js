/** @format */

const get_quote_details = async (arr) => {
  const _array = [];
  arr.map((i) => {
    if (i?.user_type == "own") {
      i?.shippingAddress?.map((j) => {
        j?.packs.map((k) => {
          _array.push({
            address: j.address,
            postalCode: j.postalCode,
            city: j.city,
            height: i?.height,
            width: i?.width,
            length: i?.length,
            weight: i?.weight,
          });
        });
      });
    } else {
      for (let index = 0; index < i?.quantity; index++) {
        _array.push({
          address: i.shipping_address,
          postalCode: i.postal_code,
          city: i.city,
          height: i?.height,
          width: i?.width,
          length: i?.length,
          weight: i?.weight,
        });
      }
    }
  });

  // Create an object to store grouped results
  const groupedData = {};

  // Iterate over the array and group by 'city', 'postalCode', and 'address'
  _array.forEach((item) => {
    const key = `${item.city.toLowerCase()}|${
      item.postalCode
    }|${item.address.toLowerCase()}`;

    if (!groupedData[key]) {
      groupedData[key] = [];
    }

    groupedData[key].push(item);
  });

  // Convert the grouped object to an array
  const resultArray = Object.values(groupedData);
  const finalArr = [];
  resultArray.map((i) => {
    const arr = [];
    i.map((j) => {
      arr.push({
        height: String(j.height),
        weight: String(j.weight),
        width: String(j.width),
        length: String(j.length),
        insuranceAmount: null,
        declaredValue: null,
      });
    });
    finalArr.push({
      address: i[0]?.address,
      city: i[0]?.city,
      postalCode: i[0]?.postalCode,
      items: arr,
    });
  });
  return finalArr;
};

module.exports = get_quote_details;
