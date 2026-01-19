// src/pages/Accueil.jsx

// AppLayout : gère la structure commune à toutes les pages (header + zone centrale + footer)
import { AppLayout } from "../components/AppLayout.jsx";

// accueilStyles : styles spécifiques à la page d'accueil (séparés dans le dossier /styles)
import { styles as accueilStyles } from "../styles/accueil";

/**
 * Page Accueil
 * ------------
 * Rôle :
 * - Page d'entrée du site
 * - Présente rapidement l'objectif du site (catalogue + panier + profil)
 * - Oriente l'utilisateur : s'inscrire / se connecter / consulter le catalogue
 *
 * Important :
 * - Le design global (fond bleu, header, footer) vient de AppLayout
 * - Ici, on ne gère que le contenu propre à l'accueil (carte + texte)
 */
export const Accueil = () => {
  return (
    // AppLayout enveloppe la page pour appliquer le layout global
    <AppLayout>
      {/* 
        Carte centrale sur fond bleu
        ----------------------------
        cardWrapper : généralement utilisé pour centrer la carte / contrôler l'espacement
        conteneur   : contenu réel de la carte (fond blanc, padding, etc.)
      */}
      <div style={accueilStyles.cardWrapper}>
        <div style={accueilStyles.conteneur}>
          {/* Titre principal : donne tout de suite l'idée du site */}
          <h1 style={accueilStyles.titre}>
            Votre boutique, toujours à portée de main 🛒
          </h1>

          {/* 
            Texte de présentation :
            - explique les fonctionnalités principales (catalogue, panier, profil)
            - invite l'utilisateur à s'inscrire ou se connecter
          */}
          <p style={accueilStyles.sousTitre}>
            Découvrez nos produits, ajoutez-les à votre panier et retrouvez-les à tout moment.
            Nouveau ici ? Inscrivez-vous en quelques secondes. Déjà membre ? Connectez-vous
            pour accéder à votre profil.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
