// src/pages/Profil.jsx

/**
 * Page Profil
 * -----------
 * Cette page affiche :
 * - soit les informations de l'utilisateur connecté (nom, prénom, email, téléphone)
 * - soit un message indiquant que l'utilisateur n'est pas connecté, avec un bouton "Se connecter"
 *
 * Les infos de connexion viennent de UserContext :
 * - user : null si personne n'est connecté, sinon un objet utilisateur
 * - logout : fonction qui remet user à null (déconnexion côté front)
 */

import { useNavigate } from "react-router-dom"; // pour rediriger l'utilisateur (connexion / après logout)
import { AppLayout } from "../components/AppLayout.jsx"; // layout global (menu + footer)
import styles from "../styles/profil"; // styles spécifiques à la page profil
import { useUser } from "../context/UserContext.jsx"; // accès au contexte utilisateur

const Profil = () => {
  /**
   * On récupère depuis UserContext :
   * - user : données de l'utilisateur connecté (ou null)
   * - logout : fonction qui déconnecte
   */
  const { user, logout } = useUser();

  // navigate permet de changer de page par code (redirection)
  const navigate = useNavigate();

  /**
   * isConnected
   * -----------
   * Boolean pratique pour savoir si l'utilisateur est connecté.
   * - !!user transforme user en true/false.
   */
  const isConnected = !!user;

  /**
   * handleLogout
   * ------------
   * Gère la déconnexion.
   *
   * Étapes :
   * 1) Vérifier si l'utilisateur est connecté (sinon on ne fait rien)
   * 2) Demander confirmation (window.confirm)
   * 3) Si confirmé :
   *    - appeler logout() (vide le user dans le contexte)
   *    - afficher un message
   *    - rediriger vers /connexion
   */
  const handleLogout = () => {
    // Sécurité : si l'utilisateur n'est pas connecté, on ne tente pas de logout
    if (!isConnected) {
      window.alert("Vous n'êtes pas connecté(e).");
      return;
    }

    // Confirmation utilisateur (évite les déconnexions accidentelles)
    const confirmLogout = window.confirm(
      "Voulez-vous vraiment vous déconnecter ?"
    );

    if (confirmLogout) {
      // Déconnexion : remet user à null dans le contexte
      logout();

      // Feedback utilisateur
      window.alert("Vous avez été déconnecté(e).");

      // Redirection vers la page connexion
      navigate("/connexion");
    }
  };

  /**
   * allerConnexion
   * --------------
   * Redirige directement vers la page Connexion.
   * Utilisé quand l'utilisateur n'est pas connecté et clique sur "Se connecter".
   */
  const allerConnexion = () => {
    navigate("/connexion");
  };

  /**
   * styleBoutonConnexion
   * --------------------
   * Ici tu fusionnes deux styles :
   * - styles.button : style de bouton de base
   * - styles.btnPrimary : variante (si elle existe)
   *
   * Pourquoi ce format ?
   * - Dans le web, on ne peut pas faire style={[a, b]} comme en React Native.
   * - Donc on fusionne en un objet unique grâce au spread {...}
   *
   * Note :
   * - Le (styles.button || {}) protège contre le cas où styles.button serait undefined
   */
  const styleBoutonConnexion = {
    ...(styles.button || {}),
    ...(styles.btnPrimary || {}),
  };

  return (
    <AppLayout>
      {/* Structure principale de la page profil */}
      <div style={styles.page}>
        <div style={styles.conteneur}>
          {/* Titre de la page */}
          <h1 style={styles.titre}>Profil</h1>

          {/* 
            Affichage conditionnel :
            - Si connecté : infos + bouton "Se déconnecter"
            - Sinon : message + bouton "Se connecter"
          */}
          {isConnected ? (
            <>
              {/* Message de bienvenue */}
              <p style={styles.sousTitre}>
                Bienvenue {user.prenom} {user.nom}
              </p>

              {/* Bloc informations utilisateur */}
              <div style={{ marginTop: 20 }}>
                <p style={styles.sousTitre}>Vos informations :</p>

                {/* On affiche les champs un par un pour rester clair */}
                <p style={{ marginTop: 10 }}>Nom : {user.nom}</p>
                <p>Prénom : {user.prenom}</p>
                <p>Email : {user.email}</p>
                <p>Téléphone : {user.telephone}</p>
              </div>

              {/* Bouton de déconnexion */}
              <div style={{ marginTop: 30 }}>
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleLogout}
                >
                  Se déconnecter
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Message pour utilisateur non connecté */}
              <p style={styles.sousTitre}>
                Vous n'êtes pas connecté(e). Veuillez vous connecter pour voir
                votre profil.
              </p>

              {/* Bouton pour aller vers la page Connexion */}
              <button
                type="button"
                style={styleBoutonConnexion}
                onClick={allerConnexion}
              >
                Se connecter
              </button>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profil;
