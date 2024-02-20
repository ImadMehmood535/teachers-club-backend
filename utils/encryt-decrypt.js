/** @format */

const CryptoJS = require("crypto-js");

const EncryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(
    data,
    process.env.CRYPTO_SECRET_KEY
  ).toString();
  return encrypted;
};

const DecryptData = (encrypted) => {
  const decrypted = CryptoJS.AES.decrypt(
    encrypted,
    process.env.CRYPTO_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  return decrypted;
};

module.exports = { EncryptData, DecryptData };
