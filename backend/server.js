// server.js

/**
 * Chargement des variables d'environnement (.env)
 * ----------------------------------------------
 * dotenv lit le fichier .env (s'il existe) et injecte les variables dans process.env.
 * Exemples :
 * - process.env.PORT
 * - process.env.MONGO_URI
 *
 * Important :
 * - En production, les variables d'environnement sont généralement fournies par le serveur,
 *   mais en local, dotenv est très pratique.
 */
require("dotenv").config();

// On importe l'application Express "app" (configurée dans expressApp.js).
// C'est elle qui contient les middlewares, les routes (/api/produits, /api/auth, etc.)
const app = require("./expressApp");

// On importe la fonction de connexion MongoDB (mongoose.connect) depuis src/config/mongo.
// Cette connexion est nécessaire pour gérer le catalogue produits via l'API.
const connectDB = require("./src/config/mongo"); // <-- on pointe vers src/config/mongo

// Définition du port d'écoute du serveur.
// - On utilise PORT depuis .env si disponible
// - Sinon on met une valeur par défaut (5000)
const PORT = process.env.PORT || 5000;

/**
 * Connexion à MongoDB puis démarrage du serveur
 * --------------------------------------------
 * Ici tu lances la connexion MongoDB au démarrage du serveur.
 *
 * Pourquoi le faire au début ?
 * - Le backend dépend de MongoDB pour le catalogue.
 * - Si MongoDB n'est pas accessible, connectDB() va afficher l'erreur et arrêter le process.
 *   (c'est exactement ce qu'on veut : éviter un serveur "semi-fonctionnel".)
 */
connectDB();

/**
 * Démarrage du serveur HTTP
 * ------------------------
 * app.listen démarre l'écoute sur le port choisi.
 * Une fois lancé, le backend répondra aux requêtes :
 * - GET  /api/produits
 * - POST /api/auth/register
 * - POST /api/auth/login
 * etc.
 */
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
