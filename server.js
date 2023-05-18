const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8080;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.get("/", (req, res) => {
  res.json({ msg: "API Listening" });
});

function onHttpStart() {
  console.log(`server listening on ${PORT}`);
}

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(PORT, onHttpStart);
  })
  .catch((err) => {
    console.log(err);
  });
