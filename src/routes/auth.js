const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

router.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await newUser.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }
    const jwtToken = await user.getJWT();
    //res.cookie("token", jwtToken);
    res
      .status(200)
      .cookie("token", jwtToken, { expires: new Date(Date.now() + 3600000) })
      .send("User logged in successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("User logged out successfully");
});

module.exports = router;
