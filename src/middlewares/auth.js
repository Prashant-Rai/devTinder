const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send("Authentication token not found");
  }
  try {
    const decodedToken = jwt.verify(token, "DEV@TINDER$PRASHANT");
    const userId = decodedToken._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
