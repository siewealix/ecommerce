// src/App.jsx
import { Routes, Route } from "react-router-dom";

// Pages avec exports nommés
import { Accueil } from "./pages/Accueil";
import { Catalogue } from "./pages/Catalogue";
import { Cataloguemongodb } from "./pages/Cataloguemongodb";
import { Panier } from "./pages/Panier";

// Pages avec export par défaut
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";

function App() {
  return (
    <Routes>
      {/* Accueil */}
      <Route path="/" element={<Accueil />} />

      {/* Catalogue local (données dans src/data/Data.js) */}
      <Route path="/catalogue" element={<Catalogue />} />

      {/* Catalogue connecté à l'API backend */}
      <Route path="/catalogue-api" element={<Cataloguemongodb />} />

      {/* Panier (données venant de PanierContext) */}
      <Route path="/panier" element={<Panier />} />

      {/* Authentification */}
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />

      {/* Profil utilisateur */}
      <Route path="/profil" element={<Profil />} />

      {/* Route par défaut : on renvoie vers l'accueil */}
      <Route path="*" element={<Accueil />} />
    </Routes>
  );
}

export default App;
