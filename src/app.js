const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = {
    firstName: "Prashant",
    lastName: "Rai",
    email: "prash@rai.com",
    password: "123456",
    age: 32,
    gender: "Male",
  };

  try {
    const newUser = new User(user);
    await newUser.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error while creating the user", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => console.log("Server listening on port 3000"));
  })
  .catch((err) => console.log("Database connection error: ", err));
