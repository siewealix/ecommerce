// src/pages/Connexion.jsx

/**
 * Page Connexion
 * --------------
 * Cette page gère l'authentification (login) côté frontend.
 *
 * Ce que fait la page :
 * - Affiche un formulaire (email + mot de passe)
 * - Valide les champs côté client (front)
 * - Envoie une requête au backend (POST /api/auth/login)
 * - Si succès : stocke l'utilisateur dans UserContext + redirige vers /profil
 * - Si erreur : affiche un message clair à l'utilisateur
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // navigation programmatique (redirection après login)
import axios from "axios"; // pour faire les requêtes HTTP vers le backend
import { AppLayout } from "../components/AppLayout.jsx"; // layout global (header + footer)
import styles from "../styles/connexion"; // styles spécifiques à cette page
import { useUser } from "../context/UserContext.jsx"; // contexte utilisateur (user connecté)

// Base URL de l'API backend
// Ici : backend local, route de base /api
const API_BASE_URL = "http://localhost:5000/api";

const Connexion = () => {
  /**
   * formData
   * --------
   * Contient les valeurs actuelles du formulaire.
   * On utilise un state unique pour gérer plusieurs champs facilement.
   */
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  });

  /**
   * formErreur
   * ----------
   * Stocke les messages d'erreur par champ.
   * Exemple :
   *  { email: "Email invalide", motDePasse: "Minimum 12 caractères" }
   */
  const [formErreur, setFormErreur] = useState({});

  /**
   * loading
   * -------
   * Indique si la requête est en cours (évite double-clic + permet d'afficher "Connexion...")
   */
  const [loading, setLoading] = useState(false);

  // navigate : permet de rediriger l'utilisateur vers une autre page
  const navigate = useNavigate();

  // setUser : permet de sauvegarder l'utilisateur connecté dans le contexte global
  const { setUser } = useUser();

  /**
   * useEffect (au montage)
   * ---------------------
   * Petite amélioration UX : focus automatique sur le champ email quand la page s'ouvre.
   */
  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.focus();
  }, []);

  /**
   * handleChange
   * ------------
   * Met à jour formData quand l'utilisateur tape dans un champ.
   * En bonus :
   * - Si une erreur existait déjà sur ce champ, on la supprime dès que l'utilisateur retape
   *   (ça évite de garder un message d'erreur alors que l'utilisateur corrige).
   */
  const handleChange = (champ, valeur) => {
    // Mise à jour du champ ciblé (ex: email ou motDePasse)
    setFormData((prev) => ({ ...prev, [champ]: valeur }));

    // Si une erreur existe sur ce champ, on l'efface dès qu'il y a une modification
    if (formErreur[champ]) {
      setFormErreur((prev) => ({ ...prev, [champ]: "" }));
    }
  };

  /**
   * validerFormulaire
   * -----------------
   * Vérifie les champs côté front (avant d'appeler l'API).
   *
   * Règles :
   * - email obligatoire + format valide
   * - mot de passe obligatoire
   * - mot de passe >= 12 caractères
   * - mot de passe contient : majuscule + minuscule + chiffre + caractère spécial
   *
   * Retour :
   * - true si tout est OK
   * - false si au moins une erreur existe (et les erreurs sont stockées dans formErreur)
   */
  const validerFormulaire = () => {
    const erreurs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ----- Email -----
    if (!formData.email.trim()) erreurs.email = "L'email est requis";
    else if (!emailRegex.test(formData.email))
      erreurs.email = "Email invalide";

    // ----- Mot de passe -----
    if (!formData.motDePasse)
      erreurs.motDePasse = "Le mot de passe est requis";
    else if (formData.motDePasse.length < 12)
      erreurs.motDePasse = "Minimum 12 caractères";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(
        formData.motDePasse
      )
    )
      erreurs.motDePasse =
        "Le mot de passe doit contenir au moins 12 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial";

    // On met à jour l'état des erreurs pour affichage dans l'UI
    setFormErreur(erreurs);

    // Si erreurs est vide => formulaire valide
    return Object.keys(erreurs).length === 0;
  };

  /**
   * handleSubmit
   * ------------
   * Déclenché quand l'utilisateur soumet le formulaire.
   *
   * Étapes :
   * 1) Bloquer le comportement par défaut du navigateur (rechargement de page)
   * 2) Valider le formulaire côté front
   * 3) Appeler le backend (login)
   * 4) En cas de succès :
   *    - setUser(...) dans le contexte global
   *    - message de succès
   *    - reset formulaire
   *    - redirection vers /profil
   * 5) En cas d'échec :
   *    - afficher le message renvoyé par l'API (ou un message par défaut)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si validation échoue, on arrête ici (les erreurs sont déjà affichées)
    if (!validerFormulaire()) return;

    try {
      // On active le loading (désactive le bouton + feedback texte)
      setLoading(true);

      // Payload envoyé au backend
      // - trim sur l'email pour éviter "email@x.com  "
      const payload = {
        email: formData.email.trim(),
        motDePasse: formData.motDePasse,
      };

      // Appel API : connexion
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        payload
      );

      // Le backend renvoie un user dans response.data.user
      const user = response.data.user;

      // Petite sécurité : si le backend ne renvoie pas user comme attendu
      if (!user) {
        window.alert("Réponse du serveur invalide.");
        return;
      }

      // On stocke les infos utilisateur dans le contexte global (UserContext)
      // pour que Profil, Menu, etc. puissent savoir que l'utilisateur est connecté.
      setUser({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
      });

      // Message succès (si le backend fournit un message, on l'affiche)
      window.alert(response.data.message || "Connexion réussie.");

      // Nettoyage : on vide le formulaire et les erreurs
      setFormData({ email: "", motDePasse: "" });
      setFormErreur({});

      // Redirection vers la page profil après connexion
      navigate("/profil");
    } catch (err) {
      // Log technique utile pendant le développement
      console.error("Erreur connexion :", err);

      // Message propre pour l'utilisateur :
      // - si l'API fournit un message (err.response.data.message), on le prend
      // - sinon on met un message générique
      const message =
        err.response?.data?.message ||
        "Erreur lors de la connexion. Veuillez réessayer.";

      window.alert(message);
    } finally {
      // Quoi qu'il arrive, on désactive le loading
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Conteneur global de la page */}
      <div style={styles.page}>
        {/* Carte / bloc central */}
        <div style={styles.conteneur}>
          {/* En-tête : titre + sous-titre */}
          <div style={styles.header}>
            <h1 style={styles.titre}>Connectez-vous à votre compte</h1>
            <p style={styles.sousTitre}>
              Remplissez le formulaire ci-dessous
            </p>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit}>
            {/* Champ email */}
            <div style={styles.champContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email" // utilisé aussi pour le focus automatique
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                style={styles.input}
              />
              {/* Affichage de l'erreur email (si elle existe) */}
              {formErreur.email && (
                <div style={styles.texteErreur}>{formErreur.email}</div>
              )}
            </div>

            {/* Champ mot de passe */}
            <div style={styles.champContainer}>
              <label htmlFor="motDePasse" style={styles.label}>
                Mot de passe
              </label>
              <input
                id="motDePasse"
                type="password"
                value={formData.motDePasse}
                onChange={(e) => handleChange("motDePasse", e.target.value)}
                placeholder="********"
                style={styles.input}
              />
              {/* Affichage de l'erreur motDePasse (si elle existe) */}
              {formErreur.motDePasse && (
                <div style={styles.texteErreur}>{formErreur.motDePasse}</div>
              )}
            </div>

            {/* Actions du formulaire */}
            <div style={styles.formActions}>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={loading} // empêche de soumettre plusieurs fois
              >
                {/* Feedback utilisateur pendant l'appel API */}
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Connexion;
