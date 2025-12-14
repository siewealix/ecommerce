// src/components/AppLayout.jsx
import { MenuPrincipal } from "./MenuPrincipal.jsx";
import { layoutStyles } from "../styles/layout.js";

export const AppLayout = ({ children }) => {
  return (
    <div style={layoutStyles.page}>
      {/* Header avec le menu + panier */}
      <MenuPrincipal />

      {/* Zone principale : fond bleu + contenu au centre */}
      <main style={layoutStyles.main}>
        <div style={layoutStyles.center}>{children}</div>
      </main>

      {/* Footer */}
      <footer style={layoutStyles.footer}>
        © 2025 Ecommerce. Tous droits réservés.
      </footer>
    </div>
  );
};
