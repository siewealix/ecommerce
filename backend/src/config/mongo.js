// src/config/mongo.js

// On importe mongoose : c'est la bibliothèque qui permet à Node.js
// de se connecter à MongoDB et de manipuler les données (modèles, schémas, etc.).
const mongoose = require("mongoose");

/**
 * connectDB
 * ----------
 * Rôle : établir la connexion entre notre backend (Express/Node) et MongoDB.
 *
 * Pourquoi c'est important ?
 * - Sans connexion MongoDB, on ne peut pas lire/écrire les produits (catalogue API).
 * - On centralise ici la logique de connexion pour éviter de la répéter ailleurs.
 *
 * Fonctionnement :
 * - On récupère l'URL MongoDB depuis la variable d'environnement MONGO_URI
 * - Si MONGO_URI n'est pas définie, on utilise une URL par défaut (local)
 * - En cas d'échec, on arrête le serveur (process.exit(1)) car l'appli ne peut pas tourner correctement.
 */
const connectDB = async () => {
  try {
    // URL de connexion MongoDB
    // - process.env.MONGO_URI : URL définie dans ton fichier .env (recommandé en production)
    // - sinon on se connecte à MongoDB en local, sur la base "instadb2"
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/instadb2";

    // Connexion à MongoDB
    // mongoose.connect retourne une promesse, donc on attend (await) qu'elle réussisse.
    await mongoose.connect(uri);

    // Si on arrive ici, la connexion est établie avec succès
    console.log("✅ Connexion MongoDB réussie");
  } catch (err) {
    // Si une erreur survient (MongoDB non démarré, URI incorrecte, etc.)
    console.error("❌ Erreur de connexion à MongoDB :", err.message);

    // On coupe le processus si la connexion échoue.
    // Pourquoi ? Parce qu'un backend e-commerce sans base de données produits
    // n'est pas utilisable : mieux vaut échouer immédiatement et clairement.
    process.exit(1);
  }
};

// On exporte la fonction pour pouvoir l'utiliser dans server.js
module.exports = connectDB;
