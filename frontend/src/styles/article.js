// src/styles/article.js

export const styles = {
  articleContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1, // on peut garder pour la structure
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    objectFit: "cover",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  nom: { fontSize: 16, fontWeight: 600, color: "#333" },
  prix: { fontSize: 14, color: "#004E64", marginBottom: 6 },

  actionsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    gap: 8,
  },

  button: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
  },

  buttonAdd: {
    backgroundColor: "#004E64",
    color: "#fff",
  },

  buttonDetails: {
    backgroundColor: "#fff",
    color: "#004E64",
    border: "1px solid #004E64",
  },
};
