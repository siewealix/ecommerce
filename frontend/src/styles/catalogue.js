// src/styles/catalogue.js

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
    maxHeight: 80,
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

  content: {
    flex: 1,
    padding: 16,
  },

  header: {
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
  },

  titre: {
    fontSize: 20,
    fontWeight: 600,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },

  searchBar: {
    marginTop: 8,
  },

  searchInput: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  list: {
    marginTop: 16,
  },
};
