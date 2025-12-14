// src/styles/profil.js

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
    maxWidth: '600px',
    marginInline: 'auto',
  },
  titre: {
    textAlign: 'center',
    marginTop: '10px',
    marginBottom: '10px',
    color: '#333',
    fontSize: '20px',
    fontWeight: 600,
  },
  sousTitre: {
    textAlign: 'center',
    color: '#555',
    fontSize: '14px',
    marginBottom: '16px',
  },

  toggleBtn: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 18px',
    borderRadius: '8px',
    minWidth: '180px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 600,
  },
  btnDanger: {
    backgroundColor: '#c1121f',
  },
  btnPrimary: {
    backgroundColor: '#004E64',
  },
};

export default styles;
