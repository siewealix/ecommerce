// src/components/MenuPrincipal.jsx
import { Link, useLocation } from "react-router-dom";
import { usePanier } from "../context/PanierContext.jsx";
import { menuStyles } from "../styles/menu.js";

export const MenuPrincipal = () => {
  const { totalArticles } = usePanier();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/inscription", label: "Inscription" },
    { path: "/connexion", label: "Connexion" },
    // { path: "/catalogue", label: "Catalogue" },
    { path: "/catalogue-api", label: "Catalogue" },
    { path: "/profil", label: "Profil" },
  ];

  const linkStyle = (path) => ({
    ...menuStyles.navLink,
    borderBottom:
      location.pathname === path
        ? "2px solid #004E64"
        : "2px solid transparent",
  });

  return (
    <header style={menuStyles.header}>
      <div style={menuStyles.inner}>
        {/* Placeholder vide pour garder la nav centrée */}
        <div style={{ width: 40 }} />

        {/* Navigation centrée */}
        <nav style={menuStyles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={linkStyle(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Icône panier avec compteur à droite */}
        <Link
          to="/panier"
          style={menuStyles.cartButton}
          aria-label="Panier"
        >
          <span style={menuStyles.cartIcon}>🛒</span>
          <span style={menuStyles.cartCount}>{totalArticles}</span>
        </Link>
      </div>
    </header>
  );
};
