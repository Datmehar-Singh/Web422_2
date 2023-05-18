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
app.post("/api/movies", async (req, res) => {
  try {
    const newMovie = await db.addNewMovie(req.body);
    res.status(201).json(newMovie);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add movie", error: error.message });
  }
});
app.get("/api/movies", async (req, res) => {
  const { page, perPage, title } = req.query;
  try {
    const movies = await db.getAllMovies(page, perPage, title || null);
    res.status(201).json(movies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get all movies", error: error.message });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await db.getMovieById(id);
    if (movie) {
      res.status(201).json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding movie", error: error.message });
  }
});

app.put("/api/movies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedMovie = await db.updateMovieById(req.body, id);
    if (updatedMovie) {
      res.status(201).json(updatedMovie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating movie", error: error.message });
  }
});

app.delete("/api/movies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedMovie = await db.deleteMovieById(id);
    if (deletedMovie) {
      res.status(201).json(deletedMovie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting movie", error: error.message });
  }
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
