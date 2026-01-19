// src/pages/Panier.jsx

/**
 * Page Panier
 * -----------
 * Cette page affiche le contenu du panier et permet :
 * - de voir tous les produits ajoutés
 * - d'augmenter / diminuer la quantité d'un produit
 * - de calculer le total global
 * - de vider complètement le panier
 *
 * Important :
 * - Le panier est stocké côté front dans PanierContext.
 * - Ici, on ne fait pas d'appel API : tout est géré localement dans l'état React.
 */

import { useCallback, useMemo } from "react";
import { AppLayout } from "../components/AppLayout.jsx";
import styles from "../styles/panier.js";
import { usePanier } from "../context/PanierContext.jsx";

/**
 * getPrixNumber
 * -------------
 * But : convertir un prix "texte" en nombre exploitable pour les calculs.
 *
 * Pourquoi ?
 * - Dans l'app, le prix peut arriver sous différentes formes :
 *   "59.99€", "59,99 €", " 59.99 € ", etc.
 * - Pour calculer le total, il faut un Number (ex: 59.99).
 *
 * Règles appliquées :
 * - Retire le symbole €
 * - Remplace la virgule par un point (format français -> format JS)
 * - Enlève tous les caractères non numériques (sauf le point)
 * - parseFloat -> Number
 *
 * Sécurité :
 * - Si parseFloat échoue, on retourne 0 pour éviter NaN dans les calculs.
 */
const getPrixNumber = (prix) => {
  if (prix === null || prix === undefined) return 0;
  let texte = String(prix);

  // On enlève le symbole euro
  texte = texte.replace("€", "");

  // On accepte la virgule comme séparateur décimal
  texte = texte.replace(",", ".");

  // On enlève tout ce qui n'est pas un chiffre ou un point
  texte = texte.replace(/[^\d.]/g, "");

  const n = parseFloat(texte);

  // Si n'est pas un nombre, on renvoie 0 (robuste)
  return Number.isNaN(n) ? 0 : n;
};

export const Panier = () => {
  /**
   * On récupère depuis le contexte panier :
   * - panier : la liste des items ajoutés (avec quantite)
   * - setPanier : permet de mettre à jour le panier (vider, modifier, etc.)
   */
  const { panier, setPanier } = usePanier();

  /**
   * incrementerQuantite
   * -------------------
   * Augmente la quantité d'un article du panier.
   *
   * Fonctionnement :
   * - On parcourt tous les items (map)
   * - Si l'id correspond, on incrémente quantite
   * - Sinon, on retourne l'item tel quel
   *
   * useCallback :
   * - évite de recréer la fonction à chaque render inutilement
   * - utile quand on passe la fonction en props (ou à des composants enfants)
   */
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

  /**
   * decrementerQuantite
   * -------------------
   * Diminue la quantité d'un article.
   *
   * Particularité :
   * - Après la diminution, si la quantité devient 0 (ou moins),
   *   on supprime l'item du panier grâce à filter().
   *
   * Exemple :
   * - quantite = 1, on clique "-" -> quantite = 0 -> l'item est retiré.
   */
  const decrementerQuantite = useCallback(
    (id) => {
      setPanier((prev) =>
        prev
          // 1) on diminue la quantité du produit ciblé
          .map((item) =>
            item.id === id
              ? { ...item, quantite: (item.quantite || 1) - 1 }
              : item
          )
          // 2) on enlève ceux dont la quantité est <= 0
          .filter((item) => (item.quantite || 1) > 0)
      );
    },
    [setPanier]
  );

  /**
   * total
   * -----
   * Calcule le total du panier :
   * - somme(quantite * prix) sur chaque item
   *
   * useMemo :
   * - on ne recalculera le total que si "panier" change
   */
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
      {/* Conteneur principal de la page panier */}
      <div style={styles.page}>
        <div style={styles.conteneur}>
          {/* Titre */}
          <h1 style={styles.titre}>🛒 Mon Panier</h1>

          {/* Cas 1 : panier vide */}
          {panier.length === 0 ? (
            <p style={styles.sousTitre}>Votre panier est vide.</p>
          ) : (
            // Cas 2 : panier avec items
            <>
              {/* Liste des articles du panier */}
              <ul style={styles.liste}>
                {panier.map((item, index) => {
                  // On sécurise la quantité (au cas où elle serait absente)
                  const quantite = item.quantite || 1;

                  // On convertit le prix en nombre pour calculs
                  const prixNumber = getPrixNumber(item.prix);

                  // Sous-total = prix * quantité
                  const sousTotal = prixNumber * quantite;

                  return (
                    <li
                      // key unique : ici on combine id + index
                      // (id seul devrait suffire si tu es certain qu'il est unique,
                      // mais ce format évite les collisions dans certains cas)
                      key={item.id + "-" + index}
                      style={styles.cartItem}
                    >
                      {/* Texte de l'article : nom + calcul visible */}
                      <div style={styles.cartItemText}>
                        • {item.name} - {prixNumber} x {quantite} ={" "}
                        {sousTotal.toFixed(2)}€
                      </div>

                      {/* Ligne de contrôle quantité : - / quantité / + */}
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

              {/* Bloc total */}
              <div style={styles.totalContainer}>
                <strong>Total : {total.toFixed(2)}€</strong>
              </div>

              {/* Actions (ex: vider le panier) */}
              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.viderButton}
                  onClick={() => setPanier([])} // remet le panier à vide
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
