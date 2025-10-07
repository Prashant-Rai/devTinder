const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error while creating the user" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ email: req.query.email });
    if (users.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const id = req.query.id;
    const users = await User.findByIdAndDelete(id);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.patch("/user", async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .send({ message: "User updated successfully", ...user._doc });
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.put("/user", async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true, //if any validation is added in schema it will run for update query as well by defaut it will run on insertion only
    });
    res
      .status(200)
      .send({ message: "User updated successfully", ...user._doc });
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => console.log("Server listening on port 3000"));
  })
  .catch((err) => console.log("Database connection error: ", err));
