// src/context/UserContext.jsx
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // user = null quand personne n'est connecté
  // ou un objet : { id, nom, prenom, email, telephone }
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
