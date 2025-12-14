

const mongoose = require('mongoose');
 
const ProduitSchema = new mongoose.Schema({
  name: String,   
  prix: Number,   
  image: String, 
});
 
module.exports = mongoose.model('Listproduits', ProduitSchema,'Produits');


