// src/pages/Connexion.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppLayout } from "../components/AppLayout.jsx";
import styles from "../styles/connexion";
import { useUser } from "../context/UserContext.jsx";

const API_BASE_URL = "http://localhost:5000/api";

const Connexion = () => {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  });

  const [formErreur, setFormErreur] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.focus();
  }, []);

  const handleChange = (champ, valeur) => {
    setFormData((prev) => ({ ...prev, [champ]: valeur }));
    if (formErreur[champ]) {
      setFormErreur((prev) => ({ ...prev, [champ]: "" }));
    }
  };

  const validerFormulaire = () => {
    const erreurs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) erreurs.email = "L'email est requis";
    else if (!emailRegex.test(formData.email))
      erreurs.email = "Email invalide";

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

    setFormErreur(erreurs);
    return Object.keys(erreurs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validerFormulaire()) return;

    try {
      setLoading(true);

      const payload = {
        email: formData.email.trim(),
        motDePasse: formData.motDePasse,
      };

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        payload
      );

      const user = response.data.user;
      if (!user) {
        window.alert("Réponse du serveur invalide.");
        return;
      }

      setUser({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
      });

      window.alert(response.data.message || "Connexion réussie.");

      setFormData({ email: "", motDePasse: "" });
      setFormErreur({});
      navigate("/profil");
    } catch (err) {
      console.error("Erreur connexion :", err);
      const message =
        err.response?.data?.message ||
        "Erreur lors de la connexion. Veuillez réessayer.";
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
            <h1 style={styles.titre}>Connectez-vous à votre compte</h1>
            <p style={styles.sousTitre}>
              Remplissez le formulaire ci-dessous
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.champContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                style={styles.input}
              />
              {formErreur.email && (
                <div style={styles.texteErreur}>{formErreur.email}</div>
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
                placeholder="********"
                style={styles.input}
              />
              {formErreur.motDePasse && (
                <div style={styles.texteErreur}>{formErreur.motDePasse}</div>
              )}
            </div>

            <div style={styles.formActions}>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={loading}
              >
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
