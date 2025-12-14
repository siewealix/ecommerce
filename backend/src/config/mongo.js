// src/config/mongo.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // URL de connexion MongoDB
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/instadb2";

    await mongoose.connect(uri);

    console.log("✅ Connexion MongoDB réussie");
  } catch (err) {
    console.error("❌ Erreur de connexion à MongoDB :", err.message);
    // On coupe le processus si la connexion échoue
    process.exit(1);
  }
};

module.exports = connectDB;
