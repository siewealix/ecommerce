// src/pages/Catalogue.jsx

/**
 * Page Catalogue (données locales)
 * --------------------------------
 * Cette page affiche un catalogue basé sur des données locales (src/data/Data.js),
 * donc sans appel API (contrairement à Cataloguemongodb.jsx).
 *
 * Fonctionnalités principales :
 * - Afficher la liste des produits
 * - Rechercher un produit (filtrage par nom)
 * - Ajouter un produit au panier
 * - Afficher une alerte simple "Détails"
 */

import { useMemo, useState } from "react";

// AppLayout : structure commune (header/menu + zone centrale + footer)
import { AppLayout } from "../components/AppLayout.jsx";

// produits : tableau local importé depuis Data.js
import { produits } from "../data/Data";

// usePanier : accès à la fonction d'ajout au panier (PanierContext)
import { usePanier } from "../context/PanierContext.jsx";

// Styles de la page catalogue + styles d'un article (carte produit)
import { styles as catalogueStyles } from "../styles/catalogue";
import { styles as articleStyles } from "../styles/article";

// Note : on garde les prix tels qu'ils sont dans Data (déjà avec €)

export const Catalogue = () => {
  // On récupère la fonction "ajouterAuPanier" depuis le contexte panier
  const { ajouterAuPanier } = usePanier();

  // searchText : texte tapé dans la barre de recherche
  const [searchText, setSearchText] = useState("");

  /**
   * produitsFiltres
   * ---------------
   * On filtre les produits en fonction du texte de recherche.
   *
   * useMemo :
   * - Evite de recalculer le filtrage à chaque re-render inutilement
   * - Recalcule uniquement quand searchText change
   *
   * Logique :
   * - On met en minuscule pour faire une recherche "insensible à la casse"
   * - On protège (p.name || "") au cas où name serait absent
   */
  const produitsFiltres = useMemo(() => {
    const texte = searchText.toLowerCase();
    return produits.filter((p) =>
      (p.name || "").toLowerCase().includes(texte)
    );
  }, [searchText]);

  /**
   * afficherDetails
   * ---------------
   * Version simple des détails : on affiche juste un alert.
   * Plus tard, si tu veux, on pourra faire :
   * - une page /produit/:id
   * - ou un modal
   */
  const afficherDetails = (produit) => {
    window.alert(`${produit.name} - ${produit.prix}`);
  };

  /**
   * handleAjouterAuPanier
   * ---------------------
   * On centralise l'action "ajouter au panier" dans une fonction,
   * c'est plus propre et ça te permet d'ajouter des logs / validations plus tard.
   */
  const handleAjouterAuPanier = (item) => {
    ajouterAuPanier(item);
  };

  return (
    // AppLayout enveloppe toute la page (menu + footer)
    <AppLayout>
      {/* Conteneur principal de la page */}
      <div style={catalogueStyles.page}>
        <div style={catalogueStyles.content}>
          {/* ======================
              En-tête (titre + recherche)
              ====================== */}
          <div style={catalogueStyles.header}>
            {/* Titre de la page */}
            <h2 style={catalogueStyles.titre}>
              Catalogue (données locales)
            </h2>

            {/* Barre de recherche */}
            <div style={catalogueStyles.searchBar}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchText} // valeur contrôlée par React
                onChange={(e) => setSearchText(e.target.value)} // mise à jour du state
                style={catalogueStyles.searchInput}
              />
            </div>
          </div>

          {/* ======================
              Liste des produits
              ====================== */}
          <div style={catalogueStyles.list}>
            {/* Si aucun produit ne correspond à la recherche */}
            {produitsFiltres.length === 0 && (
              <p style={{ color: "#fff" }}>
                Aucun produit ne correspond à votre recherche.
              </p>
            )}

            {/* On parcourt les produits filtrés pour générer une "carte" par produit */}
            {produitsFiltres.map((item) => (
              <div
                key={item.id} // clé unique pour React (important pour la perf et éviter les warnings)
                style={articleStyles.articleContainer}
              >
                {/* Image (affichée seulement si elle existe) */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={articleStyles.image}
                  />
                )}

                {/* Zone informations : nom / prix + actions */}
                <div style={articleStyles.info}>
                  {/* Bloc texte (nom + prix) */}
                  <div>
                    <div style={articleStyles.nom}>{item.name}</div>
                    <div style={articleStyles.prix}>{item.prix}</div>
                  </div>

                  {/* Actions : Ajouter au panier + Détails */}
                  <div style={articleStyles.actionsRow}>
                    {/* Bouton Ajouter */}
                    <button
                      type="button"
                      style={{
                        // On combine un style "button" commun + une variante "Add"
                        ...articleStyles.button,
                        ...articleStyles.buttonAdd,
                      }}
                      onClick={() => handleAjouterAuPanier(item)}
                    >
                      Ajouter au panier
                    </button>

                    {/* Bouton Détails */}
                    <button
                      type="button"
                      style={{
                        // Même principe : style commun + variante "Details"
                        ...articleStyles.button,
                        ...articleStyles.buttonDetails,
                      }}
                      onClick={() => afficherDetails(item)}
                    >
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
