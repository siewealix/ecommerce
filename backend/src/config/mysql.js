// src/config/mysql.js

// On importe mysql2 en mode "promise" pour pouvoir utiliser async/await
// au lieu des callbacks (ce qui rend le code plus lisible et plus propre).
const mysql = require("mysql2/promise");

/**
 * Pool de connexions MySQL
 * ------------------------
 * Un "pool" est une réserve de connexions réutilisables.
 *
 * Pourquoi utiliser un pool ?
 * - Ouvrir/fermer une connexion à chaque requête est lent et coûteux.
 * - Le pool garde plusieurs connexions prêtes, ce qui améliore les performances.
 * - Il gère l'attente si toutes les connexions sont occupées.
 *
 * Note :
 * - Les paramètres ci-dessous sont adaptés à une configuration Wamp classique.
 * - Si ton Wamp est configuré différemment (port, mot de passe, etc.),
 *   tu modifies uniquement ces valeurs.
 */
const pool = mysql.createPool({
  // Adresse du serveur MySQL (en local ici, car Wamp tourne sur ta machine)
  host: "localhost",

  // Utilisateur MySQL (souvent "root" par défaut sur Wamp)
  user: "root",      // user Wamp par défaut

  // Mot de passe MySQL (souvent vide sur Wamp, mais ça dépend de ta config)
  password: "",      // mot de passe Wamp (souvent vide)

  // Nom de la base de données utilisée par le backend pour l'authentification
  database: "ecommerce",

  // Si true : les requêtes attendent qu'une connexion se libère au lieu d'échouer
  waitForConnections: true,

  // Nombre maximum de connexions simultanées que le pool peut gérer
  connectionLimit: 10,

  // Nombre de requêtes en attente max (0 = illimité)
  queueLimit: 0,
});

// On exporte le pool pour qu'il soit utilisé dans les routes/controllers (auth, etc.)
module.exports = pool;
