// src/pages/Accueil.jsx
import { AppLayout } from "../components/AppLayout.jsx";
import { styles as accueilStyles } from "../styles/accueil";

export const Accueil = () => {
  return (
    <AppLayout>
      {/* Carte centrale, sur le fond bleu du layout */}
      <div style={accueilStyles.cardWrapper}>
        <div style={accueilStyles.conteneur}>
          <h1 style={accueilStyles.titre}>Votre boutique, toujours à portée de main 🛒</h1>
          <p style={accueilStyles.sousTitre}>
            Découvrez nos produits, ajoutez-les à votre panier et retrouvez-les à tout moment. Nouveau ici ? Inscrivez-vous en quelques secondes. Déjà membre ? Connectez-vous pour accéder à votre profil.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
