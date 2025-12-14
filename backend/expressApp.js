// expressApp.js
const express = require("express");
const cors = require("cors");

const produitsRoutes = require("./src/routes/Produits");
const authRoutes = require("./src/routes/auth");

const app = express();

// CORS pour autoriser ton front (vite : http://localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Pour parser le JSON des requêtes
app.use(express.json());

// Routes catalogue (MongoDB)
app.use("/api/produits", produitsRoutes);

// Routes auth (MySQL)
app.use("/api/auth", authRoutes);

// Route de test
app.get("/", (req, res) => {
  res.send("API e-commerce en ligne (MongoDB + MySQL).");
});

module.exports = app;
