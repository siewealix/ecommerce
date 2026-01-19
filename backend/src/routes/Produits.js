// routes/produits.js

// On importe Express pour pouvoir créer des routes (endpoints) API.
const express = require('express');

// On crée un "router" : c'est un mini-module de routes qu'on pourra ensuite
// brancher dans l'application principale (ex: app.use('/api/produits', router)).
const router = express.Router();

// On importe le modèle Mongoose "Listproduit" (défini dans ../models/Produit).
// Ce modèle représente la collection MongoDB des produits et nous donne accès
// à des méthodes comme find(), findById(), create(), etc.
const Listproduit = require('../models/Produit');

/**
 * GET /
 * -----
 * Objectif : récupérer tous les produits stockés dans MongoDB.
 *
 * Exemple d’URL finale (si on monte ce router sur /api/produits) :
 *   GET http://localhost:5000/api/produits
 *
 * Résultat attendu :
 * - 200 + JSON (tableau) : liste des produits
 * - 500 + JSON : en cas d'erreur serveur
 */
router.get('/', async (req, res) => {
  try {
    // On interroge MongoDB pour obtenir tous les produits.
    // find() sans filtre = retourne tous les documents de la collection.
    const produits = await Listproduit.find();

    // Log utile si tu veux vérifier rapidement ce que Mongo renvoie
    // console.log('Produits trouvés:', produits);

    // On renvoie les produits au client sous forme de JSON.
    // Par défaut, Express met le status à 200 quand on fait res.json(...)
    res.json(produits);
  } catch (err) {
    // Si une erreur se produit (problème de connexion, query invalide, etc.)
    console.error('Erreur lors de la récupération des produits:', err);

    // On renvoie une erreur 500 (Internal Server Error) avec un message simple.
    // Le front pourra afficher ce message ou un message utilisateur plus propre.
    res.status(500).json({ message: err.message });
  }
});

// On exporte le router pour pouvoir l'importer dans l'app principale (expressApp.js)
module.exports = router;
