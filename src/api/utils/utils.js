const randomize = require("randomatic");
const phone = require("phone");

exports.getOtpCode = () => {
  // 4 digit
  // return Math.floor(1000 + Math.random() * 9000);
  // 6 digit
  // return Math.floor(100000 + Math.random() * 900000);
  return randomize("0", 6); //  using cryptographically
};


exports.isValidEmail = email => {
  // const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !re.test(email);
};

exports.isValidPhoneNumber = phoneNumber => {
  if (phone(phoneNumber).length === 0) {
    return true;
  } else {
    return false;
  }
};
