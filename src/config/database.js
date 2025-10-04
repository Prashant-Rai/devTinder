const mongoose = require("mongoose");

const URI =
  "mongodb+srv://prashantrai117_db_user:prashantrai117_db_user@namstenode.pmxv58i.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(URI);
};

module.exports = {
  connectDB,
};
