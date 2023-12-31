/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Datmehar Singh Student ID: 108011214 Date: September 29, 2023
 *  Cyclic Link: https://fine-jade-walrus-shoe.cyclic.cloud/
 *
 ********************************************************************************/
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8000;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
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

const initializeServer = async () => {
  try {
    await db.initialize(process.env.MONGODB_CONN_STRING);
    app.listen(PORT, onHttpStart);
    console.log(`Server started on port ${PORT}`);
  } catch (err) {
    throw new Error("Failed to initialize server: " + err.message);
  }
};

initializeServer()
  .then(() => {
    console.log("Server initialized successfully");
  })
  .catch((err) => {
    console.error("Error initializing server:", err);
  });
