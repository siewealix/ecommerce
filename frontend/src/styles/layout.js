// src/styles/layout.js

export const layoutStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },

  // Zone centrale : fond bleu, contenu centré
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004E64",
    padding: 24,
    boxSizing: "border-box",
  },

  // Conteneur du contenu de page (la carte, le formulaire, etc.)
  center: {
    maxWidth: 900,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    borderTop: "1px solid #ddd",
    padding: "8px 16px",
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
};
