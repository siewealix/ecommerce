// src/components/AppLayout.jsx

// MenuPrincipal = la barre de navigation en haut (liens + icône panier + compteur)
import { MenuPrincipal } from "./MenuPrincipal.jsx";

// layoutStyles = objet qui contient tous les styles du layout (page, main, center, footer)
import { layoutStyles } from "../styles/layout.js";

/**
 * AppLayout
 * ---------
 * Rôle :
 * - Fournir une "structure" commune à toutes les pages (header + contenu + footer).
 * - Éviter de répéter le même code sur Accueil, Catalogue, Panier, Connexion, etc.
 *
 * children :
 * - C’est le contenu spécifique de chaque page.
 * - Exemple : si on fait <AppLayout><Catalogue /></AppLayout>,
 *   alors "Catalogue" sera placé dans la zone centrale.
 */
export const AppLayout = ({ children }) => {
  return (
    // Conteneur global de la page
    <div style={layoutStyles.page}>
      {/* 
        HEADER
        ------
        On affiche le menu principal sur toutes les pages :
        - les liens de navigation
        - l’icône panier + le compteur (badge)
      */}
      <MenuPrincipal />

      {/* 
        CONTENU PRINCIPAL
        -----------------
        Zone principale : 
        - fond bleu
        - contenu centré horizontalement (et généralement verticalement selon ton style)
      */}
      <main style={layoutStyles.main}>
        {/* 
          "center" sert de conteneur à la page actuelle.
          Le contenu ici varie selon la route (Accueil, Catalogue, Profil, etc.)
        */}
        <div style={layoutStyles.center}>{children}</div>
      </main>

      {/* 
        FOOTER
        ------
        Partie du bas affichée partout.
        On y met généralement : copyright, infos, liens utiles, etc.
      */}
      <footer style={layoutStyles.footer}>
        © 2025 Ecommerce. Tous droits réservés.
      </footer>
    </div>
  );
};
