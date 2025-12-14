// src/pages/Profil.jsx
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout.jsx";
import styles from "../styles/profil";
import { useUser } from "../context/UserContext.jsx";

const Profil = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const isConnected = !!user;

  const handleLogout = () => {
    if (!isConnected) {
      window.alert("Vous n'êtes pas connecté(e).");
      return;
    }

    const confirmLogout = window.confirm(
      "Voulez-vous vraiment vous déconnecter ?"
    );
    if (confirmLogout) {
      logout();
      window.alert("Vous avez été déconnecté(e).");
      navigate("/connexion");
    }
  };

  const allerConnexion = () => {
    navigate("/connexion");
  };

  // Pour le bouton "Se connecter" quand l'utilisateur N'EST PAS connecté :
  // on fusionne styles.button et styles.btnPrimary (si btnPrimary existe).
  const styleBoutonConnexion = {
    ...(styles.button || {}),
    ...(styles.btnPrimary || {}),
  };

  return (
    <AppLayout>
      <div style={styles.page}>
        <div style={styles.conteneur}>
          <h1 style={styles.titre}>Profil</h1>

          {isConnected ? (
            <>
              <p style={styles.sousTitre}>
                Bienvenue {user.prenom} {user.nom}
              </p>

              <div style={{ marginTop: 20 }}>
                <p style={styles.sousTitre}>Vos informations :</p>
                <p style={{ marginTop: 10 }}>Nom : {user.nom}</p>
                <p>Prénom : {user.prenom}</p>
                <p>Email : {user.email}</p>
                <p>Téléphone : {user.telephone}</p>
              </div>

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
              <p style={styles.sousTitre}>
                Vous n'êtes pas connecté(e). Veuillez vous connecter pour voir
                votre profil.
              </p>

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
