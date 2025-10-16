const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", requestRoutes);
app.use("/", userRoutes);

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => console.log("Server listening on port 3000"));
  })
  .catch((err) => console.log("Database connection error: ", err));
