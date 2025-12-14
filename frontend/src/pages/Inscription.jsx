// src/pages/Inscription.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppLayout } from "../components/AppLayout.jsx";
import styles from "../styles/inscription";

const API_BASE_URL = "http://localhost:5000/api";

const Inscription = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    confirmMotDePasse: "",
  });

  const [formErreur, setFormErreur] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const nomInput = document.getElementById("nom");
    if (nomInput) nomInput.focus();
  }, []);

  const handleChange = (champ, valeur) => {
    setFormData((prev) => ({ ...prev, [champ]: valeur }));
    if (formErreur[champ]) {
      setFormErreur((prev) => ({ ...prev, [champ]: "" }));
    }
  };

  const validerFormulaire = () => {
    const erreurs = {};

    if (!formData.nom.trim()) erreurs.nom = "Le nom est requis";
    if (!formData.prenom.trim()) erreurs.prenom = "Le prénom est requis";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) erreurs.email = "L'email est requis";
    else if (!emailRegex.test(formData.email))
      erreurs.email = "Email invalide";

    const tel = formData.telephone.replace(/\s/g, "");
    if (!tel) erreurs.telephone = "Le téléphone est requis";
    else if (!/^\d{10}$/.test(tel))
      erreurs.telephone = "Téléphone invalide (10 chiffres)";

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

    if (!formData.confirmMotDePasse)
      erreurs.confirmMotDePasse = "La confirmation est requise";
    else if (formData.confirmMotDePasse !== formData.motDePasse)
      erreurs.confirmMotDePasse = "Les mots de passe ne correspondent pas";

    setFormErreur(erreurs);
    return Object.keys(erreurs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validerFormulaire()) return;

    try {
      setLoading(true);

      const payload = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.replace(/\s/g, ""),
        motDePasse: formData.motDePasse,
      };

      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        payload
      );

      const message =
        response.data?.message || "Inscription réussie. Vous pouvez vous connecter.";
      window.alert(message);

      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motDePasse: "",
        confirmMotDePasse: "",
      });
      setFormErreur({});

      navigate("/connexion");
    } catch (err) {
      console.error("Erreur inscription :", err);
      const message =
        err.response?.data?.message ||
        "Erreur lors de l'inscription. Veuillez réessayer.";
      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={styles.page}>
        <div style={styles.conteneur}>
          <div style={styles.header}>
            <h1 style={styles.titre}>Créer un compte</h1>
            <p style={styles.sousTitre}>
              Remplissez le formulaire pour vous inscrire
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.champContainer}>
              <label htmlFor="nom" style={styles.label}>
                Nom
              </label>
              <input
                id="nom"
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                style={styles.input}
              />
              {formErreur.nom && (
                <div style={styles.texteErreur}>{formErreur.nom}</div>
              )}
            </div>

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
              {formErreur.prenom && (
                <div style={styles.texteErreur}>{formErreur.prenom}</div>
              )}
            </div>

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
              {formErreur.email && (
                <div style={styles.texteErreur}>{formErreur.email}</div>
              )}
            </div>

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
              {formErreur.telephone && (
                <div style={styles.texteErreur}>{formErreur.telephone}</div>
              )}
            </div>

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
              {formErreur.motDePasse && (
                <div style={styles.texteErreur}>{formErreur.motDePasse}</div>
              )}
            </div>

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
              {formErreur.confirmMotDePasse && (
                <div style={styles.texteErreur}>
                  {formErreur.confirmMotDePasse}
                </div>
              )}
            </div>

            <div style={styles.formActions}>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={loading}
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
