//routes/produits.js
 
const express = require('express');
const router = express.Router();
const Listproduit = require('../models/Produit');
 
// GET : récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const produits = await Listproduit.find();
    //console.log('Produits trouvés:', produits); // Log pour déboguer
    res.json(produits);//renvoie les produits au client sous forme de JSON.
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err);
    res.status(500).json({ message: err.message });
  }
});
 
module.exports = router;