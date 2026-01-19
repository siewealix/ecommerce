// On importe mongoose : c'est lui qui permet de définir un schéma (structure des données)
// et de créer un "model" pour interagir facilement avec une collection MongoDB.
const mongoose = require('mongoose');

/**
 * ProduitSchema
 * ------------
 * Ici on définit la structure d'un document "Produit" dans MongoDB.
 * Un schéma sert à :
 * - décrire les champs que l'on stocke
 * - imposer (si on le veut) des règles de validation/types
 * - faciliter la manipulation des données (find, create, update, etc.)
 *
 * Champs :
 * - name  : le nom du produit (ex: "Chaussures Nike")
 * - prix  : le prix du produit (nombre) (ex: 25000)
 * - image : lien ou chemin vers une image (ex: "https://.../img.png")
 */
const ProduitSchema = new mongoose.Schema({
  name: String,   // Nom du produit
  prix: Number,   // Prix du produit (en nombre)
  image: String,  // URL / chemin de l'image
});

/**
 * Export du Model Mongoose
 * ------------------------
 * mongoose.model(nomModel, schema, nomCollection)
 *
 * - 'Listproduits' : nom du modèle (utilisé côté Node.js)
 * - ProduitSchema  : schéma défini juste au-dessus
 * - 'Produits'     : nom EXACT de la collection MongoDB (important)
 *
 * Remarque :
 * - Si tu ne mettais pas le 3ème paramètre ('Produits'), mongoose utiliserait par défaut
 *   un nom de collection dérivé du nom du modèle (ex: "listproduits" au pluriel).
 * - Ici, tu forces la collection à être précisément "Produits".
 */
module.exports = mongoose.model('Listproduits', ProduitSchema, 'Produits');
