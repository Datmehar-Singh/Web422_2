const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ msg: "API Listening" });
});

function onHttpStart() {
  console.log(`server listening on ${PORT}`);
}
app.listen(PORT, onHttpStart);
