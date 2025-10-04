const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello World from Express");
});

app.use("/test", (req, res) => {
  res.send("Hello World from Test");
});

app.listen(3000, () => console.log("Server listening on port 3000"));
