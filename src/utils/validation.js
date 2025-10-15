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

const validateEditProfileData = (req) => {
  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "age",
    "gender",
    "photoURL",
    "about",
    "skills",
  ];
  const editFieldSet = new Set(ALLOWED_EDIT_FIELDS);
  let notAllowedField = "";
  let isValid = true;
  const reqBodyKeys = Object.keys(req.body);

  for (let key of reqBodyKeys) {
    if (editFieldSet.has(key)) {
      isValid = true;
    } else {
      isValid = false;
      notAllowedField = key.toUpperCase();
      break;
    }
  }
  return { isValid, notAllowedField };
};

module.exports = { validateSignupData, validateEditProfileData };
