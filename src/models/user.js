const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required field"],
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [30, "First name must be at most 30 characters"],
      validate: {
        validator: (value) => {
          return validator.isAlpha(value);
        },
        message: "First name must contain only alphabetical characters",
      },
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required field"],
      minLength: [3, "Last name must be at least 3 characters"],
      maxLength: [30, "Last name must be at most 30 characters"],
      validate: {
        validator: (value) => {
          return validator.isAlpha(value);
        },
        message: "First name must contain only alphabetical characters",
      },
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email is required field"],
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: "Email is not valid: {VALUE}",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required field"],
      validate: [
        {
          validator: (value) => {
            return value.length >= 8;
          },
          message: "Password length must be greater or equal to 8: {VALUE}",
        },
        {
          validator: (value) => {
            return validator.isStrongPassword(value);
          },
          message: "Password must be strong password: {VALUE}",
        },
      ],
    },
    phone: {
      type: String,
      validate: {
        validator: (value) => {
          return validator.isMobilePhone(value, "en-IN");
        },
        message: "Invalid Phone Number: {VALUE}",
      },
    },
    age: {
      type: Number,
      min: [18, "Age should be greater than 18"],
      max: [100, "Age should be less than 100"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message: "`{VALUE}` value is not supported for `{PATH}` field",
      },
    },
    photoURL: {
      type: String,
      validate: {
        validator: (value) => {
          return validator.isURL(value);
        },
        message: "Invalid URL: {VALUE}",
      },
    },
    about: {
      type: String,
      default: "This is default about user text",
      maxLength: 200,
      trim: true,
      validate: {
        validator: (value) => {
          return validator.isAlpha(value.replace(/\s/g, ""));
        },
        message: "About field should contains alphabets value: {VALUE}",
      },
    },
    skills: {
      type: [String],
      validate: [
        {
          validator: (value) => {
            return value.every((skill) => validator.isAlpha(skill));
          },
          message: "Skills must contain only alphabetical characters",
        },
        {
          validator: (value) => {
            return value.length <= 10;
          },
          message: "Skills must contain at most 10 skills",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
