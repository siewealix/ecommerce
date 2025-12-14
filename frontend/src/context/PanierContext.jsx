// src/context/PanierContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  const [panier, setPanier] = useState([]);

  const ajouterAuPanier = useCallback((produit) => {
    setPanier((prevPanier) => {
      // Fonction pour obtenir un identifiant unique, même si "id" n'existe pas
      const getId = (p) => p.id ?? p._id ?? p.name;

      const produitId = getId(produit);

      // Cherche si ce produit existe déjà (même id / _id / name)
      const index = prevPanier.findIndex(
        (p) => getId(p) === produitId
      );

      if (index !== -1) {
        // déjà présent → on augmente la quantité
        const copie = [...prevPanier];
        const existant = copie[index];
        copie[index] = {
          ...existant,
          quantite: (existant.quantite || 1) + 1,
        };
        return copie;
      }

      // pas encore dans le panier → on l'ajoute avec un id normalisé
      return [
        ...prevPanier,
        {
          ...produit,
          id: produitId, // on force un id cohérent pour le panier
          quantite: produit.quantite || 1,
        },
      ];
    });
  }, []);

  // Total d’articles (somme des quantités)
  const totalArticles = useMemo(
    () =>
      panier.reduce(
        (somme, item) => somme + (item.quantite || 1),
        0
      ),
    [panier]
  );

  return (
    <PanierContext.Provider
      value={{ panier, setPanier, ajouterAuPanier, totalArticles }}
    >
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => useContext(PanierContext);
