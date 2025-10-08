const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }
    const jwtToken = jwt.sign({ _id: user._id }, "DEV@TINDER$PRASHANT", {
      expiresIn: "1h",
    });
    //res.cookie("token", jwtToken);
    res
      .status(200)
      .cookie("token", jwtToken, { expires: new Date(Date.now() + 3600000) })
      .send("User logged in successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

app.get("/user", userAuth, async (req, res) => {
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

app.get("/feed", userAuth, async (req, res) => {
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

app.delete("/user", userAuth, async (req, res) => {
  try {
    const id = req.query.id;
    const users = await User.findByIdAndDelete(id);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.patch("/user/:userId", userAuth, async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "password",
      "phone",
      "about",
      "skills",
      "photoURL",
    ];

    const isValidOperation = Object.keys(req.body).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isValidOperation) {
      throw new Error("Update is not allowed");
    }

    const id = req.params.userId;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new Error("User not found with userId: " + id);
    } else {
      res
        .status(200)
        .send({ message: "User updated successfully", ...user._doc });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put("/user/:userId", userAuth, async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "password",
      "phone",
      "about",
      "skills",
      "photoURL",
    ];

    const isValidOperation = Object.keys(req.body).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isValidOperation) {
      throw new Error("Update is not allowed");
    }

    const id = req.params.userId;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true, //if any validation is added in schema it will run for update query as well by defaut it will run on insertion only
    });
    if (!user) {
      throw new Error("User not found with userId: " + id);
    } else {
      res
        .status(200)
        .send({ message: "User updated successfully", ...user._doc });
    }
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
