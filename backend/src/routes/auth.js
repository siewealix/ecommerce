// src/routes/auth.js

// On importe Express pour créer des routes (endpoints) d'API.
const express = require("express");

// bcrypt sert à hasher les mots de passe (et à les comparer) de façon sécurisée.
// Important : on ne stocke JAMAIS un mot de passe en clair en base.
const bcrypt = require("bcrypt");

// pool est le "pool de connexions" MySQL (mysql2/promise) défini dans src/config/mysql.js.
// Il nous permet d'exécuter des requêtes SQL avec async/await.
const pool = require("../config/mysql");

// On crée un router Express (mini-module de routes).
const router = express.Router();

/**
 * isNonEmptyString
 * ----------------
 * Petit utilitaire pour vérifier qu'une valeur est une chaîne non vide.
 * Exemple :
 *  - "  " => false (car trim() donne une chaîne vide)
 *  - "Alix" => true
 */
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

/**
 * POST /api/auth/register
 * ----------------------
 * Objectif : créer un nouvel utilisateur dans MySQL.
 *
 * Flux global :
 *  1) Valider les champs envoyés par le front
 *  2) Vérifier si l'email existe déjà (unicité)
 *  3) Hasher le mot de passe
 *  4) Insérer l'utilisateur en base
 *  5) Retourner un message + les infos de l'utilisateur (sans hash)
 */
router.post("/register", async (req, res) => {
  try {
    // On récupère les champs envoyés par le front via req.body
    // (il faut que express.json() soit activé dans l'app principale).
    const { nom, prenom, email, telephone, motDePasse } = req.body;

    // ==========================
    // 1) VALIDATIONS (Back-end)
    // ==========================
    // Même si tu valides déjà côté front, le back doit refaire les validations
    // (car n'importe qui peut appeler l'API avec Postman/insomnia).

    // Validation du nom
    if (!isNonEmptyString(nom)) {
      return res.status(400).json({ message: "Le nom est requis." });
    }

    // Validation du prénom
    if (!isNonEmptyString(prenom)) {
      return res.status(400).json({ message: "Le prénom est requis." });
    }

    // Validation email : présence
    if (!isNonEmptyString(email)) {
      return res.status(400).json({ message: "L'email est requis." });
    }

    // Validation email : format (regex simple et efficace pour la plupart des cas)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide." });
    }

    // Validation téléphone : présence
    if (!isNonEmptyString(telephone)) {
      return res.status(400).json({ message: "Le téléphone est requis." });
    }

    // Nettoyage du téléphone : on enlève les espaces (ex: "6 99 12 34 56" => "699123456")
    const tel = telephone.replace(/\s/g, "");

    // Ici tu imposes un téléphone à 10 chiffres.
    // Si tu veux accepter d'autres formats plus tard (ex: +237...), on adaptera.
    if (!/^\d{10}$/.test(tel)) {
      return res
        .status(400)
        .json({ message: "Téléphone invalide (10 chiffres)." });
    }

    // Validation mot de passe : présence
    if (!isNonEmptyString(motDePasse)) {
      return res.status(400).json({ message: "Le mot de passe est requis." });
    }

    // Validation mot de passe : longueur minimale
    if (motDePasse.length < 12) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 12 caractères.",
      });
    }

    // Validation mot de passe : règles de complexité
    // - au moins 1 minuscule
    // - au moins 1 majuscule
    // - au moins 1 chiffre
    // - au moins 1 caractère spécial
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

    // =====================================
    // 2)I) VÉRIFIER SI L'EMAIL EXISTE DÉJÀ
    // =====================================
    // On interroge MySQL pour voir si un utilisateur existe déjà avec cet email.
    // - On trim l'email pour éviter les surprises ("test@mail.com ").
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email.trim(),
    ]);

    // Si au moins une ligne existe, c'est que l'email est déjà utilisé.
    if (rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // =======================
    // 3) HASHER LE MOT DE PASSE
    // =======================
    // bcrypt.hash(mdp, saltRounds)
    // - 10 : bon compromis entre sécurité et performance pour un projet standard.
    const passwordHash = await bcrypt.hash(motDePasse, 10);

    // ======================
    // 4) INSÉRER EN BASE MySQL
    // ======================
    // On enregistre les données nettoyées (trim pour nom/prenom/email, téléphone sans espaces)
    const [result] = await pool.query(
      "INSERT INTO users (nom, prenom, email, telephone, password_hash) VALUES (?, ?, ?, ?, ?)",
      [nom.trim(), prenom.trim(), email.trim(), tel, passwordHash]
    );

    // On prépare un objet utilisateur à renvoyer AU FRONT,
    // sans informations sensibles (donc pas de password_hash !).
    const newUser = {
      id: result.insertId, // id auto-incrémenté généré par MySQL
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      telephone: tel,
    };

    // Réponse succès : 201 (Created)
    return res.status(201).json({
      message: "Inscription réussie.",
      user: newUser,
    });
  } catch (err) {
    // En cas d'erreur inattendue (base down, erreur SQL, etc.)
    console.error("Erreur /api/auth/register :", err);

    // Réponse générique 500, avec message pour aider au debug.
    return res.status(500).json({
      message:
        err.message || "Erreur serveur pendant l'inscription (voir logs).",
    });
  }
});

/**
 * POST /api/auth/login
 * --------------------
 * Objectif : connecter un utilisateur existant.
 *
 * Flux global :
 *  1) Vérifier que email + motDePasse existent
 *  2) Récupérer l'utilisateur en base par email
 *  3) Comparer le mot de passe (bcrypt.compare)
 *  4) Retourner les infos de l'utilisateur (sans hash)
 *
 * Note :
 * - Ici tu ne gères pas encore de JWT / session.
 * - Tu renvoies juste les infos user, et le front les stocke (UserContext).
 * - Plus tard on pourra ajouter un token JWT si tu veux sécuriser davantage.
 */
router.post("/login", async (req, res) => {
  try {
    // Champs envoyés par le front
    const { email, motDePasse } = req.body;

    // Validation simple : les deux champs sont requis
    if (!isNonEmptyString(email) || !isNonEmptyString(motDePasse)) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe sont requis." });
    }

    // ===================================
    // 1) CHERCHER L'UTILISATEUR PAR EMAIL
    // ===================================
    // On demande aussi password_hash pour vérifier le mot de passe.
    const [rows] = await pool.query(
      "SELECT id, nom, prenom, email, telephone, password_hash FROM users WHERE email = ?",
      [email.trim()]
    );

    // Si on ne trouve personne, on renvoie une erreur 401 (non autorisé)
    // Message volontairement générique pour ne pas aider un attaquant à deviner les emails existants.
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    // L'utilisateur trouvé (une seule ligne en principe, car email est UNIQUE)
    const user = rows[0];

    // =========================
    // 2) COMPARER LE MOT DE PASSE
    // =========================
    // bcrypt.compare compare le mot de passe en clair avec le hash stocké.
    // Il renvoie true si ça correspond.
    const passwordMatch = await bcrypt.compare(motDePasse, user.password_hash);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    // ====================================
    // 3) RETOURNER LES INFOS SANS LE HASH
    // ====================================
    // Très important : on ne renvoie pas password_hash au front.
    const userData = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
    };

    // Réponse succès
    return res.status(200).json({
      message: "Connexion réussie.",
      user: userData,
    });
  } catch (err) {
    // Erreur inattendue : logs pour debug
    console.error("Erreur /api/auth/login :", err);

    // Réponse 500 (erreur serveur)
    return res.status(500).json({
      message: err.message || "Erreur serveur pendant la connexion (voir logs).",
    });
  }
});

// On exporte le router pour le brancher dans l'application Express principale.
module.exports = router;
