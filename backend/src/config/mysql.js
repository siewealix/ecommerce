// src/config/mysql.js
const mysql = require("mysql2/promise");

// Adapter si ton Wamp est configuré autrement
const pool = mysql.createPool({
  host: "localhost",
  user: "root",      // user Wamp par défaut
  password: "",      // mot de passe Wamp (souvent vide)
  database: "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
