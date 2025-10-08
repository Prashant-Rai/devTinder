const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName) {
    throw new Error("First name is required");
  }
  if (!lastName) {
    throw new Error("Last name is required");
  }
  if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("First name must be between 3 and 30 characters");
  }
  if (lastName.length < 3 || lastName.length > 30) {
    throw new Error("Last name must be between 3 and 30 characters");
  }
  if (!email) {
    throw new Error("Email is required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!password) {
    throw new Error("Password is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be a strong password");
  }
};

module.exports = { validateSignupData };
