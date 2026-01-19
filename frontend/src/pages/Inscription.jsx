// src/pages/Inscription.jsx

/**
 * Page Inscription
 * ----------------
 * Cette page permet à un utilisateur de créer un compte (register).
 *
 * Comportement général :
 * - Affiche un formulaire complet (nom, prénom, email, téléphone, mot de passe, confirmation)
 * - Valide les champs côté frontend (avant l'appel API)
 * - Envoie les données au backend (POST /api/auth/register)
 * - En cas de succès : message + reset formulaire + redirection vers Connexion
 * - En cas d'erreur : affiche un message clair à l'utilisateur
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // pour rediriger après inscription
import axios from "axios"; // client HTTP pour appeler le backend
import { AppLayout } from "../components/AppLayout.jsx"; // layout global (menu + footer)
import styles from "../styles/inscription"; // styles spécifiques à la page Inscription

// Base URL de l'API backend (local)
const API_BASE_URL = "http://localhost:5000/api";

const Inscription = () => {
  /**
   * formData
   * --------
   * Contient toutes les valeurs du formulaire.
   * On regroupe tout dans un seul state pour garder le code simple.
   */
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    confirmMotDePasse: "",
  });

  /**
   * formErreur
   * ----------
   * Objet d'erreurs par champ :
   * - si un champ est invalide, on ajoute une propriété (ex: erreurs.email)
   * - l'UI affiche ensuite l'erreur sous le champ concerné
   */
  const [formErreur, setFormErreur] = useState({});

  /**
   * loading
   * -------
   * true pendant l'appel API (on désactive le bouton et on affiche "En cours...")
   */
  const [loading, setLoading] = useState(false);

  // navigate : permet de rediriger vers une autre route après succès
  const navigate = useNavigate();

  /**
   * useEffect (au montage)
   * ---------------------
   * Amélioration UX :
   * - on met automatiquement le curseur dans le champ "nom" dès que la page s'ouvre
   */
  useEffect(() => {
    const nomInput = document.getElementById("nom");
    if (nomInput) nomInput.focus();
  }, []);

  /**
   * handleChange
   * ------------
   * Met à jour formData dès que l'utilisateur tape dans un champ.
   *
   * Bonus UX :
   * - Si une erreur existait sur ce champ, on l'efface dès la première modification,
   *   ce qui donne un ressenti plus naturel (l'utilisateur voit qu'il corrige).
   */
  const handleChange = (champ, valeur) => {
    // Mise à jour du champ ciblé (ex: "email", "telephone", etc.)
    setFormData((prev) => ({ ...prev, [champ]: valeur }));

    // Si une erreur existe déjà pour ce champ, on la supprime
    if (formErreur[champ]) {
      setFormErreur((prev) => ({ ...prev, [champ]: "" }));
    }
  };

  /**
   * validerFormulaire
   * -----------------
   * Vérifie les champs côté front avant de contacter le backend.
   * L'objectif est double :
   * - éviter d'envoyer des données clairement invalides au serveur
   * - donner un feedback immédiat à l'utilisateur
   *
   * Règles appliquées :
   * - nom / prenom obligatoires
   * - email obligatoire + format valide
   * - téléphone obligatoire + 10 chiffres
   * - mot de passe : requis, >= 12 caractères, complexité
   * - confirmation : requise + doit correspondre au mot de passe
   *
   * Retour :
   * - true si aucune erreur
   * - false sinon (et formErreur est rempli)
   */
  const validerFormulaire = () => {
    const erreurs = {};

    // ----- Nom / Prénom -----
    if (!formData.nom.trim()) erreurs.nom = "Le nom est requis";
    if (!formData.prenom.trim()) erreurs.prenom = "Le prénom est requis";

    // ----- Email -----
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) erreurs.email = "L'email est requis";
    else if (!emailRegex.test(formData.email))
      erreurs.email = "Email invalide";

    // ----- Téléphone -----
    // On enlève les espaces pour accepter les saisies du type "6 99 12 34 56"
    const tel = formData.telephone.replace(/\s/g, "");
    if (!tel) erreurs.telephone = "Le téléphone est requis";
    else if (!/^\d{10}$/.test(tel))
      erreurs.telephone = "Téléphone invalide (10 chiffres)";

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

    // ----- Confirmation mot de passe -----
    if (!formData.confirmMotDePasse)
      erreurs.confirmMotDePasse = "La confirmation est requise";
    else if (formData.confirmMotDePasse !== formData.motDePasse)
      erreurs.confirmMotDePasse = "Les mots de passe ne correspondent pas";

    // On stocke toutes les erreurs pour affichage dans l'UI
    setFormErreur(erreurs);

    // Formulaire valide si aucune erreur
    return Object.keys(erreurs).length === 0;
  };

  /**
   * handleSubmit
   * ------------
   * Déclenché quand l'utilisateur clique sur "S'inscrire" (submit).
   *
   * Étapes :
   * 1) Empêcher le rechargement (e.preventDefault)
   * 2) Valider le formulaire côté front
   * 3) Construire le payload "propre"
   * 4) Appeler l'API backend /auth/register
   * 5) Succès -> message + reset + redirection Connexion
   * 6) Erreur -> afficher le message serveur ou un fallback
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si le formulaire n'est pas valide, on ne fait pas l'appel API
    if (!validerFormulaire()) return;

    try {
      // On passe en mode chargement
      setLoading(true);

      // Payload envoyé au backend
      // - trim : on nettoie les espaces de début/fin sur les champs texte
      // - téléphone : on enlève les espaces
      // - on n'envoie pas confirmMotDePasse (utile seulement côté front)
      const payload = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.replace(/\s/g, ""),
        motDePasse: formData.motDePasse,
      };

      // Appel API : création du compte
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        payload
      );

      // Message de succès (si le backend renvoie un message, on l'utilise)
      const message =
        response.data?.message ||
        "Inscription réussie. Vous pouvez vous connecter.";
      window.alert(message);

      // Reset du formulaire après inscription réussie
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motDePasse: "",
        confirmMotDePasse: "",
      });
      setFormErreur({});

      // Redirection vers la page connexion (logique après inscription)
      navigate("/connexion");
    } catch (err) {
      // Log technique utile en dev
      console.error("Erreur inscription :", err);

      // Message utilisateur :
      // - si le backend renvoie un message (email déjà existant, etc.), on l'affiche
      // - sinon on affiche un message générique
      const message =
        err.response?.data?.message ||
        "Erreur lors de l'inscription. Veuillez réessayer.";
      window.alert(message);
    } finally {
      // Quoi qu'il arrive, on quitte le mode chargement
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Conteneur global de la page */}
      <div style={styles.page}>
        {/* Carte / bloc central */}
        <div style={styles.conteneur}>
          {/* En-tête de la page */}
          <div style={styles.header}>
            <h1 style={styles.titre}>Créer un compte</h1>
            <p style={styles.sousTitre}>
              Remplissez le formulaire pour vous inscrire
            </p>
          </div>

          {/* Formulaire d'inscription */}
          <form onSubmit={handleSubmit}>
            {/* Champ Nom */}
            <div style={styles.champContainer}>
              <label htmlFor="nom" style={styles.label}>
                Nom
              </label>
              <input
                id="nom" // utilisé aussi pour le focus auto
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                style={styles.input}
              />
              {/* Message d'erreur Nom */}
              {formErreur.nom && (
                <div style={styles.texteErreur}>{formErreur.nom}</div>
              )}
            </div>

            {/* Champ Prénom */}
            <div style={styles.champContainer}>
              <label htmlFor="prenom" style={styles.label}>
                Prénom
              </label>
              <input
                id="prenom"
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
                style={styles.input}
              />
              {/* Message d'erreur Prénom */}
              {formErreur.prenom && (
                <div style={styles.texteErreur}>{formErreur.prenom}</div>
              )}
            </div>

            {/* Champ Email */}
            <div style={styles.champContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={styles.input}
              />
              {/* Message d'erreur Email */}
              {formErreur.email && (
                <div style={styles.texteErreur}>{formErreur.email}</div>
              )}
            </div>

            {/* Champ Téléphone */}
            <div style={styles.champContainer}>
              <label htmlFor="telephone" style={styles.label}>
                Téléphone
              </label>
              <input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                placeholder="10 chiffres"
                style={styles.input}
              />
              {/* Message d'erreur Téléphone */}
              {formErreur.telephone && (
                <div style={styles.texteErreur}>{formErreur.telephone}</div>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div style={styles.champContainer}>
              <label htmlFor="motDePasse" style={styles.label}>
                Mot de passe
              </label>
              <input
                id="motDePasse"
                type="password"
                value={formData.motDePasse}
                onChange={(e) => handleChange("motDePasse", e.target.value)}
                style={styles.input}
              />
              {/* Message d'erreur Mot de passe */}
              {formErreur.motDePasse && (
                <div style={styles.texteErreur}>{formErreur.motDePasse}</div>
              )}
            </div>

            {/* Champ Confirmation mot de passe */}
            <div style={styles.champContainer}>
              <label htmlFor="confirmMotDePasse" style={styles.label}>
                Confirmer le mot de passe
              </label>
              <input
                id="confirmMotDePasse"
                type="password"
                value={formData.confirmMotDePasse}
                onChange={(e) =>
                  handleChange("confirmMotDePasse", e.target.value)
                }
                style={styles.input}
              />
              {/* Message d'erreur Confirmation */}
              {formErreur.confirmMotDePasse && (
                <div style={styles.texteErreur}>
                  {formErreur.confirmMotDePasse}
                </div>
              )}
            </div>

            {/* Bouton Submit */}
            <div style={styles.formActions}>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={loading} // évite double-soumission
              >
                {loading ? "En cours..." : "S'inscrire"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Inscription;
