const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required field"],
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [30, "First name must be at most 30 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required field"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email is required field"],
    },
    password: { type: String, required: [true, "Password is required field"] },
    phone: {
      type: String,
      validate: {
        validator: (value) => {
          return value.length === 10;
        },
        message: "Phone number must be 10 digits",
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
    photoURL: { type: String },
    about: { type: String, default: "THis is defaultabout user text" },
    skills: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
