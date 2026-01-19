// src/App.jsx

/**
 * Fichier App.jsx
 * ---------------
 * C'est le "routeur" principal de l'application React.
 *
 * Rôle :
 * - Définir toutes les routes (URLs) accessibles dans l'application
 * - Associer chaque route à une page (composant React)
 *
 * Exemple :
 * - "/"             -> Accueil
 * - "/catalogue"    -> Catalogue local (Data.js)
 * - "/catalogue-api"-> Catalogue via API MongoDB (backend)
 * - "/panier"       -> Panier (PanierContext)
 * - "/connexion"    -> Connexion (MySQL)
 * - "/inscription"  -> Inscription (MySQL)
 * - "/profil"       -> Profil (UserContext)
 */

import { Routes, Route } from "react-router-dom";

// Pages avec exports nommés
// -> Ici ces fichiers exportent des composants comme : export const Accueil = () => {...}
import { Accueil } from "./pages/Accueil";
import { Catalogue } from "./pages/Catalogue";
import { Cataloguemongodb } from "./pages/Cataloguemongodb";
import { Panier } from "./pages/Panier";

// Pages avec export par défaut
// -> Ici ces fichiers exportent comme : export default Connexion;
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";

function App() {
  return (
    /**
     * <Routes> contient toutes les routes de l'application.
     * Chaque <Route> associe :
     * - path    : l'URL
     * - element : le composant à afficher quand l'utilisateur visite cette URL
     */
    <Routes>
      {/* ==========================
          Pages principales
          ========================== */}

      {/* Accueil */}
      <Route path="/" element={<Accueil />} />

      {/* Catalogue local (données dans src/data/Data.js) */}
      <Route path="/catalogue" element={<Catalogue />} />

      {/* Catalogue connecté à l'API backend (MongoDB) */}
      <Route path="/catalogue-api" element={<Cataloguemongodb />} />

      {/* Panier (données venant de PanierContext) */}
      <Route path="/panier" element={<Panier />} />

      {/* ==========================
          Authentification (MySQL)
          ========================== */}

      {/* Connexion */}
      <Route path="/connexion" element={<Connexion />} />

      {/* Inscription */}
      <Route path="/inscription" element={<Inscription />} />

      {/* ==========================
          Profil
          ========================== */}

      {/* Profil utilisateur (utilise UserContext) */}
      <Route path="/profil" element={<Profil />} />

      {/* ==========================
          Route fallback
          ========================== */}

      {/* 
        Route par défaut : si l'utilisateur tape une URL inconnue,
        on le renvoie vers l'accueil.
        Exemple : /nimporte-quoi -> Accueil
      */}
      <Route path="*" element={<Accueil />} />
    </Routes>
  );
}

export default App;
