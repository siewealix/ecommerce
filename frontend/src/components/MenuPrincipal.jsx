// src/components/MenuPrincipal.jsx

// Link : permet de naviguer entre les pages sans recharger le navigateur (routing React).
// useLocation : permet de connaître l'URL actuelle (pour "surligner" le lien actif).
import { Link, useLocation } from "react-router-dom";

// usePanier : hook de contexte qui donne accès au panier (et notamment au compteur totalArticles).
import { usePanier } from "../context/PanierContext.jsx";

// menuStyles : objet contenant tous les styles du header/menu (séparés dans /styles).
import { menuStyles } from "../styles/menu.js";

/**
 * MenuPrincipal
 * -------------
 * Ce composant représente la barre de navigation (header) affichée sur toutes les pages.
 * Il contient :
 * - les liens vers les routes principales (Accueil, Inscription, Connexion, Catalogue, Profil)
 * - l’icône panier avec le compteur d’articles (badge)
 *
 * Objectif UX :
 * - permettre une navigation simple
 * - montrer en permanence l'état du panier (combien d'articles)
 */
export const MenuPrincipal = () => {
  // totalArticles : total des articles dans le panier (somme des quantités)
  const { totalArticles } = usePanier();

  // location.pathname : route actuelle (ex: "/catalogue-api")
  // On l'utilise pour mettre un style "actif" sur le lien correspondant.
  const location = useLocation();

  /**
   * Liste des liens du menu.
   * - path : route
   * - label : texte affiché dans le menu
   *
   * Note : "Catalogue" local est commenté, car tu utilises MongoDB via /catalogue-api.
   */
  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/inscription", label: "Inscription" },
    { path: "/connexion", label: "Connexion" },
    // { path: "/catalogue", label: "Catalogue" }, // ancien catalogue local (désactivé)
    { path: "/catalogue-api", label: "Catalogue" },
    { path: "/profil", label: "Profil" },
  ];

  /**
   * linkStyle
   * ---------
   * Petite fonction pour générer le style d'un lien.
   * On prend le style de base (menuStyles.navLink) puis on ajoute une bordure en bas
   * quand le lien correspond à la route actuelle (effet "actif").
   */
  const linkStyle = (path) => ({
    ...menuStyles.navLink,
    borderBottom:
      location.pathname === path
        ? "2px solid #004E64" // lien actif : trait visible
        : "2px solid transparent", // lien inactif : trait invisible (garde la hauteur stable)
  });

  return (
    // Header principal
    <header style={menuStyles.header}>
      {/* Conteneur interne : permet de contrôler l'alignement et les espacements */}
      <div style={menuStyles.inner}>
        {/* 
          Placeholder vide (largeur 40px)
          ------------------------------
          Il sert simplement à équilibrer le layout :
          - à gauche : une zone vide
          - au centre : la nav
          - à droite : le panier
          Résultat : la navigation reste bien centrée visuellement.
        */}
        <div style={{ width: 40 }} />

        {/* 
          Navigation centrée
          ------------------
          On parcourt navItems pour générer les liens automatiquement.
          Avantage : si demain tu ajoutes une page, tu ajoutes juste un item ici.
        */}
        <nav style={menuStyles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path} // clé unique pour React (obligatoire dans un .map)
              to={item.path}  // route de destination
              style={linkStyle(item.path)} // style calculé (actif/inactif)
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 
          Panier (à droite)
          -----------------
          L’utilisateur peut accéder au panier depuis n'importe quelle page.
          On affiche :
          - une icône 🛒
          - le compteur totalArticles (badge)
        */}
        <Link
          to="/panier" // route vers la page panier
          style={menuStyles.cartButton}
          aria-label="Panier" // accessibilité : décrit le bouton aux lecteurs d'écran
        >
          {/* Icône panier (simple pour le moment) */}
          <span style={menuStyles.cartIcon}>🛒</span>

          {/* Badge compteur : nombre total d’articles dans le panier */}
          <span style={menuStyles.cartCount}>{totalArticles}</span>
        </Link>
      </div>
    </header>
  );
};
