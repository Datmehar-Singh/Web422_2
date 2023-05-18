const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8080;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ msg: "API Listening" });
});

function onHttpStart() {
  console.log(`server listening on ${PORT}`);
}
app.listen(PORT, onHttpStart);
