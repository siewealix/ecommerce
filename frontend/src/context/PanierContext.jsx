// src/context/PanierContext.jsx

/**
 * Contexte Panier (React Context)
 * ------------------------------
 * Objectif :
 * - Centraliser la gestion du panier au même endroit
 * - Permettre à n'importe quel composant (Menu, Catalogue, Panier, etc.)
 *   d'accéder au panier sans passer des props partout ("prop drilling").
 *
 * Exemple :
 * - Catalogue : ajoute un produit
 * - Menu : affiche le nombre total d'articles
 * - Page Panier : affiche la liste + quantités + total
 */

import React, {
  createContext, // permet de créer un contexte global accessible dans l'app
  useCallback,  // permet de mémoriser une fonction (évite des re-renders inutiles)
  useContext,   // permet de consommer un contexte facilement
  useMemo,      // permet de mémoriser des valeurs calculées (optimisation)
  useState,     // stocke l'état du panier
} from "react";

// Création du contexte
const PanierContext = createContext();

/**
 * PanierProvider
 * --------------
 * C'est le "fournisseur" du contexte panier.
 * Tout composant placé à l'intérieur de <PanierProvider> pourra accéder à :
 * - panier
 * - setPanier
 * - ajouterAuPanier
 * - totalArticles
 */
export const PanierProvider = ({ children }) => {
  // panier = tableau des produits ajoutés (chaque élément a une quantite)
  const [panier, setPanier] = useState([]);

  /**
   * ajouterAuPanier
   * ---------------
   * Rôle : ajouter un produit au panier.
   *
   * Cas possibles :
   * 1) Le produit est déjà dans le panier -> on augmente sa quantité.
   * 2) Le produit n'existe pas encore -> on l'ajoute avec quantite = 1.
   *
   * Important :
   * - On utilise setPanier(prev => ...) pour être sûr de travailler avec la dernière version du panier,
   *   même si plusieurs actions arrivent rapidement.
   * - On normalise l'identifiant du produit, car selon la source :
   *   - produits "locaux" : id
   *   - produits MongoDB : _id
   *   - en dernier recours : name
   */
  const ajouterAuPanier = useCallback((produit) => {
    setPanier((prevPanier) => {
      // getId : récupère un identifiant unique, quel que soit le type de produit.
      // - p.id : pour les produits locaux
      // - p._id : pour les produits MongoDB
      // - p.name : fallback (moins idéal, mais utile si pas d'id)
      const getId = (p) => p.id ?? p._id ?? p.name;

      // Identifiant du produit qu'on veut ajouter
      const produitId = getId(produit);

      // On cherche si ce produit existe déjà dans le panier
      // (même id / _id / name -> on considère que c'est le même produit)
      const index = prevPanier.findIndex((p) => getId(p) === produitId);

      // ===== CAS 1 : produit déjà présent =====
      if (index !== -1) {
        // On crée une copie du panier (immutabilité)
        // Important : on ne modifie jamais directement prevPanier
        const copie = [...prevPanier];

        // On récupère l'article existant
        const existant = copie[index];

        // On remplace cet article par une version "mise à jour" (quantité +1)
        copie[index] = {
          ...existant,
          quantite: (existant.quantite || 1) + 1,
        };

        // On renvoie la nouvelle version du panier
        return copie;
      }

      // ===== CAS 2 : produit pas encore dans le panier =====
      // On ajoute un nouvel élément au tableau
      return [
        ...prevPanier,
        {
          ...produit,
          // On force un id cohérent au niveau du panier,
          // ce qui évite des bugs lors des comparaisons plus tard.
          id: produitId,
          // Si le produit n'a pas de quantité, on initialise à 1.
          quantite: produit.quantite || 1,
        },
      ];
    });
  }, []);

  /**
   * totalArticles
   * -------------
   * Rôle : calculer le nombre total d'articles dans le panier.
   * - Ce n'est pas le nombre de lignes,
   * - C'est la somme des quantités.
   *
   * Exemple :
   * - Produit A (quantite 2)
   * - Produit B (quantite 1)
   * -> totalArticles = 3
   *
   * useMemo : on ne recalcule que si "panier" change.
   */
  const totalArticles = useMemo(
    () =>
      panier.reduce(
        (somme, item) => somme + (item.quantite || 1),
        0
      ),
    [panier]
  );

  /**
   * On expose au reste de l'application les données et fonctions utiles :
   * - panier : contenu du panier
   * - setPanier : possibilité de vider/modifier entièrement (ex: "Vider le panier")
   * - ajouterAuPanier : ajouter un produit
   * - totalArticles : badge compteur panier (header)
   */
  return (
    <PanierContext.Provider
      value={{ panier, setPanier, ajouterAuPanier, totalArticles }}
    >
      {children}
    </PanierContext.Provider>
  );
};

/**
 * usePanier
 * ---------
 * Hook utilitaire qui simplifie l'accès au contexte.
 *
 * Exemple d'utilisation :
 *   const { panier, ajouterAuPanier, totalArticles } = usePanier();
 */
export const usePanier = () => useContext(PanierContext);
