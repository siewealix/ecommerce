// src/styles/accueil.js

export const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#004E64",
    display: "flex",
    flexDirection: "column",
  },

  menuContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: "6px 0",
    borderBottom: "1px solid #ccc",
  },

  menuWrapper: {
    padding: "0 10px",
  },

  menu: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#004E64",
    padding: "10px 12px",
    borderRadius: 6,
    margin: "6px",
    color: "#fff",
    fontSize: 14,
    textDecoration: "none",
    display: "inline-block",
  },

  cardWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  conteneur: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxWidth: 500,
    width: "100%",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },

  titre: {
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
    fontSize: 20,
    fontWeight: 600,
  },

  sousTitre: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginBottom: 6,
  },
};
