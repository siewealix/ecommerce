// src/pages/Cataloguemongodb.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { AppLayout } from "../components/AppLayout.jsx";
import { styles as catalogueStyles } from "../styles/catalogue";
import { styles as articleStyles } from "../styles/article";
import { usePanier } from "../context/PanierContext.jsx";

const API_URL = "http://localhost:5000/api/produits";

// Ajoute le symbole €
const formatPrix = (prix) => {
  if (prix === null || prix === undefined) return "";
  const texte = String(prix).trim();
  if (!texte) return "";
  if (texte.includes("€")) return texte;
  return `${texte}€`;
};

export const Cataloguemongodb = () => {
  const { ajouterAuPanier } = usePanier();

  const [produits, setProduits] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const chargerProduits = async () => {
      setLoading(true);
      setErreur("");

      try {
        const response = await axios.get(API_URL);
        setProduits(response.data || []);
      } catch (err) {
        console.error("Erreur chargement produits API :", err);
        setErreur("Impossible de charger les produits depuis le serveur.");
      } finally {
        setLoading(false);
      }
    };

    chargerProduits();
  }, []);

  const produitsFiltres = useMemo(() => {
    const texte = searchText.toLowerCase();
    return produits.filter((p) =>
      (p.name || "").toLowerCase().includes(texte)
    );
  }, [produits, searchText]);

  const afficherDetails = (produit) => {
    window.alert(`${produit.name} - ${formatPrix(produit.prix)}`);
  };

const handleAjouterAuPanier = (item) => {
  const produitPourPanier = {
    ...item,
    id: item._id || item.id || item.name, // <-- on garantit un id
    prix: formatPrix(item.prix),
  };

  ajouterAuPanier(produitPourPanier);
};


  return (
    <AppLayout>
      <div style={catalogueStyles.page}>
        <div style={catalogueStyles.content}>
          <div style={catalogueStyles.header}>
            <h2 style={catalogueStyles.titre}>
              Catalogue
            </h2>

            <div style={catalogueStyles.searchBar}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={catalogueStyles.searchInput}
              />
            </div>

            {loading && (
              <p style={{ marginTop: 10, color: "#333" }}>
                Chargement des produits...
              </p>
            )}

            {erreur && (
              <p style={{ marginTop: 10, color: "red" }}>{erreur}</p>
            )}
          </div>

          <div style={catalogueStyles.list}>
            {!loading && !erreur && produitsFiltres.length === 0 && (
              <p style={{ color: "#fff" }}>
                Aucun produit ne correspond à votre recherche.
              </p>
            )}

            {produitsFiltres.map((item) => (
              <div
                key={item._id || item.id}
                style={articleStyles.articleContainer}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={articleStyles.image}
                  />
                )}

                <div style={articleStyles.info}>
                  <div>
                    <div style={articleStyles.nom}>{item.name}</div>
                    <div style={articleStyles.prix}>
                      {formatPrix(item.prix)}
                    </div>
                  </div>

                  <div style={articleStyles.actionsRow}>
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
