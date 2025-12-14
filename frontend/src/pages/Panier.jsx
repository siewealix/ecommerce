// src/pages/Panier.jsx
import { useCallback, useMemo } from "react";
import { AppLayout } from "../components/AppLayout.jsx";
import styles from "../styles/panier.js";
import { usePanier } from "../context/PanierContext.jsx";

// convertit "59.99€" ou "59,99 €" en 59.99 (nombre)
const getPrixNumber = (prix) => {
  if (prix === null || prix === undefined) return 0;
  let texte = String(prix);

  texte = texte.replace("€", "");
  texte = texte.replace(",", ".");
  texte = texte.replace(/[^\d.]/g, "");

  const n = parseFloat(texte);
  return Number.isNaN(n) ? 0 : n;
};

export const Panier = () => {
  const { panier, setPanier } = usePanier();

  const incrementerQuantite = useCallback(
    (id) => {
      setPanier((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantite: (item.quantite || 1) + 1 }
            : item
        )
      );
    },
    [setPanier]
  );

  const decrementerQuantite = useCallback(
    (id) => {
      setPanier((prev) =>
        prev
          .map((item) =>
            item.id === id
              ? { ...item, quantite: (item.quantite || 1) - 1 }
              : item
          )
          .filter((item) => (item.quantite || 1) > 0)
      );
    },
    [setPanier]
  );

  const total = useMemo(
    () =>
      panier.reduce((somme, item) => {
        const quantite = item.quantite || 1;
        const prixNumber = getPrixNumber(item.prix);
        return somme + quantite * prixNumber;
      }, 0),
    [panier]
  );

  return (
    <AppLayout>
      <div style={styles.page}>
        <div style={styles.conteneur}>
          <h1 style={styles.titre}>🛒 Mon Panier</h1>

          {panier.length === 0 ? (
            <p style={styles.sousTitre}>Votre panier est vide.</p>
          ) : (
            <>
              <ul style={styles.liste}>
                {panier.map((item, index) => {
                  const quantite = item.quantite || 1;
                  const prixNumber = getPrixNumber(item.prix);
                  const sousTotal = prixNumber * quantite;

                  return (
                    <li
                      key={item.id + "-" + index}
                      style={styles.cartItem}
                    >
                      <div style={styles.cartItemText}>
                        • {item.name} - {prixNumber} x {quantite} ={" "}
                        {sousTotal.toFixed(2)}€
                      </div>

                      <div style={styles.quantiteRow}>
                        <button
                          type="button"
                          style={styles.quantiteButton}
                          onClick={() => decrementerQuantite(item.id)}
                        >
                          -
                        </button>
                        <span style={styles.quantiteValue}>
                          {quantite}
                        </span>
                        <button
                          type="button"
                          style={styles.quantiteButton}
                          onClick={() => incrementerQuantite(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div style={styles.totalContainer}>
                <strong>Total : {total.toFixed(2)}€</strong>
              </div>

              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.viderButton}
                  onClick={() => setPanier([])}
                >
                  Vider le panier
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
