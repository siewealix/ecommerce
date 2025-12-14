// src/styles/inscription.js

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#004E64',
    padding: '16px',
    boxSizing: 'border-box',
  },

  menuContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: '6px 0',
    borderBottom: '1px solid #ccc',
    marginBottom: '12px',
  },
  menuWrapper: {
    maxHeight: '80px',
    overflowX: 'auto',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    gap: '8px',
  },
  button: {
    backgroundColor: '#004E64',
    padding: '10px 12px',
    borderRadius: '6px',
    margin: '6px',
    border: 'none',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    flexShrink: 0,
  },

  conteneur: {
    margin: '12px 16px',
    backgroundColor: '#fff',
    padding: '24px 40px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    maxWidth: '700px',
    marginInline: 'auto',
  },
  header: {
    marginBottom: '16px',
    textAlign: 'center',
  },
  titre: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '4px',
    color: '#333',
  },
  sousTitre: {
    color: '#555',
    fontSize: '14px',
  },

  champContainer: {
    marginBottom: '12px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '6px',
    color: '#333',
  },
  input: {
    width: '100%',
    border: '1px solid #aaa',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  texteErreur: {
    color: '#FF3B30',
    marginTop: '4px',
    fontSize: '12px',
  },

  formActions: {
    marginTop: '16px',
  },
  primaryButton: {
    backgroundColor: '#004E64',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default styles;
