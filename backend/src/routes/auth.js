// src/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/mysql");

const router = express.Router();

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { nom, prenom, email, telephone, motDePasse } = req.body;

    // 1) Validations
    if (!isNonEmptyString(nom)) {
      return res.status(400).json({ message: "Le nom est requis." });
    }

    if (!isNonEmptyString(prenom)) {
      return res.status(400).json({ message: "Le prénom est requis." });
    }

    if (!isNonEmptyString(email)) {
      return res.status(400).json({ message: "L'email est requis." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide." });
    }

    if (!isNonEmptyString(telephone)) {
      return res.status(400).json({ message: "Le téléphone est requis." });
    }

    const tel = telephone.replace(/\s/g, "");
    if (!/^\d{10}$/.test(tel)) {
      return res
        .status(400)
        .json({ message: "Téléphone invalide (10 chiffres)." });
    }

    if (!isNonEmptyString(motDePasse)) {
      return res.status(400).json({ message: "Le mot de passe est requis." });
    }

    if (motDePasse.length < 12) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 12 caractères.",
      });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(
        motDePasse
      )
    ) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    // 2) Vérifier si l'email existe déjà
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email.trim(),
    ]);

    if (rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // 3) Hasher le mot de passe
    const passwordHash = await bcrypt.hash(motDePasse, 10);

    // 4) Insérer dans MySQL
    const [result] = await pool.query(
      "INSERT INTO users (nom, prenom, email, telephone, password_hash) VALUES (?, ?, ?, ?, ?)",
      [nom.trim(), prenom.trim(), email.trim(), tel, passwordHash]
    );

    const newUser = {
      id: result.insertId,
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      telephone: tel,
    };

    return res.status(201).json({
      message: "Inscription réussie.",
      user: newUser,
    });
  } catch (err) {
    console.error("Erreur /api/auth/register :", err);
    return res.status(500).json({
      message:
        err.message || "Erreur serveur pendant l'inscription (voir logs).",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(motDePasse)) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe sont requis." });
    }

    // 1) Chercher l'utilisateur par email
    const [rows] = await pool.query(
      "SELECT id, nom, prenom, email, telephone, password_hash FROM users WHERE email = ?",
      [email.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const user = rows[0];

    // 2) Comparer le mot de passe
    const passwordMatch = await bcrypt.compare(motDePasse, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // 3) Retourner les infos sans le hash
    const userData = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
    };

    return res.status(200).json({
      message: "Connexion réussie.",
      user: userData,
    });
  } catch (err) {
    console.error("Erreur /api/auth/login :", err);
    return res.status(500).json({
      message:
        err.message || "Erreur serveur pendant la connexion (voir logs).",
    });
  }
});

module.exports = router;
