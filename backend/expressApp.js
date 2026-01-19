// expressApp.js

// On importe Express : framework Node.js qui simplifie la création d'API REST.
const express = require("express");

// On importe CORS : permet d'autoriser les requêtes provenant d'un autre domaine/port.
// Dans notre cas, le frontend (Vite) tourne sur un port différent du backend,
// donc sans CORS, le navigateur bloquerait les requêtes.
const cors = require("cors");

// On importe les routes liées aux produits (MongoDB) et à l'authentification (MySQL).
// Chaque fichier routes/... exporte un "router" Express.
const produitsRoutes = require("./src/routes/Produits");
const authRoutes = require("./src/routes/auth");

// Création de l'application Express (c'est l'objet central du serveur).
const app = express();

/**
 * Configuration CORS
 * ------------------
 * Ici on autorise uniquement l'origine du frontend Vite :
 *   http://localhost:5173
 *
 * Pourquoi ?
 * - Le navigateur applique une règle de sécurité (Same-Origin Policy).
 * - Le front tourne sur 5173 et le back sur 6000 (ou autre).
 * - CORS permet au back de dire au navigateur : "OK, j'autorise ce front."
 *
 * Remarque :
 * - En production, on mettra ici ton vrai domaine (ex: https://mon-site.com).
 * - Tu peux aussi autoriser plusieurs origines si nécessaire.
 */
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

/**
 * Middleware JSON
 * ---------------
 * Permet à Express de comprendre automatiquement les requêtes avec un body JSON.
 * Exemple : quand le frontend envoie POST /api/auth/login avec axios,
 * Express peut lire les données via req.body.
 */
app.use(express.json());

/**
 * Routes Produits (MongoDB)
 * -------------------------
 * Toutes les routes définies dans produitsRoutes seront accessibles sous :
 *   /api/produits/...
 *
 * Exemple :
 *   GET http://localhost:6000/api/produits
 */
app.use("/api/produits", produitsRoutes);

/**
 * Routes Auth (MySQL)
 * -------------------
 * Toutes les routes définies dans authRoutes seront accessibles sous :
 *   /api/auth/...
 *
 * Exemples :
 *   POST http://localhost:6000/api/auth/register
 *   POST http://localhost:6000/api/auth/login
 */
app.use("/api/auth", authRoutes);

/**
 * Route de test (health check)
 * ----------------------------
 * Simple endpoint pour vérifier rapidement que le serveur répond bien.
 * (utile quand tu démarres le backend et que tu veux tester via le navigateur)
 */
app.get("/", (req, res) => {
  res.send("API e-commerce en ligne (MongoDB + MySQL).");
});

// On exporte "app" pour pouvoir le démarrer dans server.js (app.listen(...)).
module.exports = app;
