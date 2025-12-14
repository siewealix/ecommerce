// src/styles/panier.js

const styles = {
  page: {
    width: "100%",
  },

  conteneur: {
    maxWidth: 900,
    width: "100%",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
  },

  titre: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },

  sousTitre: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },

  liste: {
    listStyle: "none",
    padding: 0,
    margin: "16px 0",
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  cartItemText: {
    fontSize: 14,
  },

  quantiteRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  quantiteButton: {
    borderRadius: 4,
    border: "1px solid #ccc",
    padding: "4px 10px",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
  },

  quantiteValue: {
    minWidth: 24,
    textAlign: "center",
  },

  totalContainer: {
    marginTop: 16,
    textAlign: "right",
    fontSize: 16,
  },

  actions: {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
  },

  viderButton: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#ff5b5b",
    color: "#fff",
    cursor: "pointer",
  },
};

export default styles;
