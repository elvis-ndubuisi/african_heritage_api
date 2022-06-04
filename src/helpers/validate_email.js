const reg =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validateEmail = (email) => {
  let result = reg.test(email);
  return result;
};

module.exports = validateEmail;
