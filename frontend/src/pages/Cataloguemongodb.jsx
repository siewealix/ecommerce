// src/pages/Cataloguemongodb.jsx

/**
 * Page Catalogue (API MongoDB)
 * ----------------------------
 * Cette page affiche le catalogue en récupérant les produits depuis le backend,
 * qui lui-même lit les produits dans MongoDB.
 *
 * Fonctionnalités :
 * - Charger les produits via axios (GET /api/produits)
 * - Gérer l'état de chargement (loading)
 * - Gérer l'état d'erreur (erreur)
 * - Rechercher un produit par son nom (filtrage en temps réel)
 * - Ajouter un produit au panier (en normalisant l'id)
 * - Afficher des détails simples via alert
 */

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { AppLayout } from "../components/AppLayout.jsx";
import { styles as catalogueStyles } from "../styles/catalogue";
import { styles as articleStyles } from "../styles/article";
import { usePanier } from "../context/PanierContext.jsx";

// URL de l'API backend qui renvoie les produits.
// Attention : doit correspondre au port de ton backend (ici 5000).
const API_URL = "http://localhost:5000/api/produits";

/**
 * formatPrix
 * ----------
 * Objectif : afficher le prix de manière uniforme en ajoutant le symbole € si nécessaire.
 *
 * Cas gérés :
 * - null/undefined -> retourne ""
 * - string vide -> retourne ""
 * - déjà contient "€" -> retourne tel quel
 * - sinon -> ajoute "€"
 *
 * Exemple :
 * - 25000 -> "25000€"
 * - "25000" -> "25000€"
 * - "25000€" -> "25000€"
 */
const formatPrix = (prix) => {
  if (prix === null || prix === undefined) return "";
  const texte = String(prix).trim();
  if (!texte) return "";
  if (texte.includes("€")) return texte;
  return `${texte}€`;
};

export const Cataloguemongodb = () => {
  // On récupère la fonction qui ajoute au panier depuis le contexte Panier
  const { ajouterAuPanier } = usePanier();

  // produits : liste récupérée depuis l'API
  const [produits, setProduits] = useState([]);

  // searchText : texte de recherche tapé dans l'input
  const [searchText, setSearchText] = useState("");

  // erreur : message d'erreur affichable à l'utilisateur
  const [erreur, setErreur] = useState("");

  // loading : indique si on est en train de charger les produits
  const [loading, setLoading] = useState(false);

  /**
   * useEffect (au montage)
   * ---------------------
   * Au chargement de la page, on appelle l'API pour récupérer les produits.
   *
   * Pourquoi useEffect([]) ?
   * - Le tableau vide [] signifie : "exécuter une seule fois au montage".
   */
  useEffect(() => {
    // Fonction interne asynchrone qui charge les produits
    const chargerProduits = async () => {
      // On passe en mode "chargement"
      setLoading(true);

      // On réinitialise l'erreur à chaque tentative de chargement
      setErreur("");

      try {
        // Appel API : récupère la liste JSON de produits
        const response = await axios.get(API_URL);

        // On protège le code : si response.data est undefined, on met un tableau vide
        setProduits(response.data || []);
      } catch (err) {
        // En cas d'erreur réseau / serveur, on log pour debug
        console.error("Erreur chargement produits API :", err);

        // Message simple (côté utilisateur)
        setErreur("Impossible de charger les produits depuis le serveur.");
      } finally {
        // Dans tous les cas, on sort du mode chargement
        setLoading(false);
      }
    };

    // On exécute le chargement
    chargerProduits();
  }, []);

  /**
   * produitsFiltres
   * ---------------
   * Filtrage en mémoire selon le nom du produit.
   *
   * useMemo :
   * - évite de recalculer le filtre si produits/searchText ne changent pas
   */
  const produitsFiltres = useMemo(() => {
    const texte = searchText.toLowerCase();
    return produits.filter((p) =>
      (p.name || "").toLowerCase().includes(texte)
    );
  }, [produits, searchText]);

  /**
   * afficherDetails
   * ---------------
   * Détails simples : pour l'instant, un alert affichant nom + prix.
   * Plus tard : page détails ou modal si tu veux.
   */
  const afficherDetails = (produit) => {
    window.alert(`${produit.name} - ${formatPrix(produit.prix)}`);
  };

  /**
   * handleAjouterAuPanier
   * ---------------------
   * Très important ici :
   * - Les produits MongoDB ont souvent un _id (ObjectId) et pas "id".
   * - On normalise donc l'identifiant pour éviter que tous les produits aient id=undefined.
   *
   * On prépare un objet "propre" pour le panier :
   * - on force un champ id cohérent
   * - on formate le prix avec €
   */
  const handleAjouterAuPanier = (item) => {
    const produitPourPanier = {
      ...item,
      // On garantit un identifiant :
      // - _id (MongoDB) en priorité
      // - sinon id (si un jour l'API renvoie id)
      // - sinon name (dernier recours)
      id: item._id || item.id || item.name,
      // On uniformise l'affichage du prix dans le panier
      prix: formatPrix(item.prix),
    };

    // Ajout au panier (via contexte)
    ajouterAuPanier(produitPourPanier);
  };

  return (
    <AppLayout>
      {/* Conteneur principal de la page */}
      <div style={catalogueStyles.page}>
        <div style={catalogueStyles.content}>
          {/* ======================
              En-tête (titre + recherche + messages)
              ====================== */}
          <div style={catalogueStyles.header}>
            {/* Titre de la page */}
            <h2 style={catalogueStyles.titre}>Catalogue</h2>

            {/* Barre de recherche */}
            <div style={catalogueStyles.searchBar}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={catalogueStyles.searchInput}
              />
            </div>

            {/* Message de chargement */}
            {loading && (
              <p style={{ marginTop: 10, color: "#333" }}>
                Chargement des produits...
              </p>
            )}

            {/* Message d'erreur (si le chargement a échoué) */}
            {erreur && (
              <p style={{ marginTop: 10, color: "red" }}>{erreur}</p>
            )}
          </div>

          {/* ======================
              Liste des produits (cartes)
              ====================== */}
          <div style={catalogueStyles.list}>
            {/* Si pas d'erreur, pas de chargement, mais aucun résultat */}
            {!loading && !erreur && produitsFiltres.length === 0 && (
              <p style={{ color: "#fff" }}>
                Aucun produit ne correspond à votre recherche.
              </p>
            )}

            {/* Affichage des produits filtrés */}
            {produitsFiltres.map((item) => (
              <div
                // key : doit être unique pour React.
                // Avec MongoDB, on utilise généralement _id.
                key={item._id || item.id}
                style={articleStyles.articleContainer}
              >
                {/* Image du produit (si disponible) */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={articleStyles.image}
                  />
                )}

                {/* Infos + actions */}
                <div style={articleStyles.info}>
                  {/* Nom + prix */}
                  <div>
                    <div style={articleStyles.nom}>{item.name}</div>
                    <div style={articleStyles.prix}>
                      {formatPrix(item.prix)}
                    </div>
                  </div>

                  {/* Boutons d'actions */}
                  <div style={articleStyles.actionsRow}>
                    {/* Ajouter au panier */}
                    <button
                      type="button"
                      style={{
                        ...articleStyles.button,
                        ...articleStyles.buttonAdd,
                      }}
                      onClick={() => handleAjouterAuPanier(item)}
                    >
                      Ajouter au panier
                    </button>

                    {/* Détails */}
                    <button
                      type="button"
                      style={{
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
