// src/pages/Catalogue.jsx
import { useMemo, useState } from "react";
import { AppLayout } from "../components/AppLayout.jsx";
import { produits } from "../data/Data";
import { usePanier } from "../context/PanierContext.jsx";
import { styles as catalogueStyles } from "../styles/catalogue";
import { styles as articleStyles } from "../styles/article";

// on garde les prix tels qu'ils sont dans Data (déjà avec €)

export const Catalogue = () => {
  const { ajouterAuPanier } = usePanier();
  const [searchText, setSearchText] = useState("");

  const produitsFiltres = useMemo(() => {
    const texte = searchText.toLowerCase();
    return produits.filter((p) =>
      (p.name || "").toLowerCase().includes(texte)
    );
  }, [searchText]);

  const afficherDetails = (produit) => {
    window.alert(`${produit.name} - ${produit.prix}`);
  };

  const handleAjouterAuPanier = (item) => {
    ajouterAuPanier(item);
  };

  return (
    <AppLayout>
      <div style={catalogueStyles.page}>
        <div style={catalogueStyles.content}>
          {/* En-tête */}
          <div style={catalogueStyles.header}>
            <h2 style={catalogueStyles.titre}>Catalogue (données locales)</h2>

            <div style={catalogueStyles.searchBar}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={catalogueStyles.searchInput}
              />
            </div>
          </div>

          {/* Liste */}
          <div style={catalogueStyles.list}>
            {produitsFiltres.length === 0 && (
              <p style={{ color: "#fff" }}>
                Aucun produit ne correspond à votre recherche.
              </p>
            )}

            {produitsFiltres.map((item) => (
              <div
                key={item.id}
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
                    <div style={articleStyles.prix}>{item.prix}</div>
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
