// src/context/UserContext.jsx

/**
 * Contexte Utilisateur (UserContext)
 * ---------------------------------
 * Objectif :
 * - Garder en mémoire l'utilisateur connecté dans toute l'application
 * - Éviter de passer "user" et "setUser" de composant en composant (props)
 *
 * Exemple :
 * - Connexion.jsx : après login OK, on fait setUser(user)
 * - Profil.jsx : on lit user pour afficher les infos
 * - Menu / autres pages : peuvent aussi savoir si l'utilisateur est connecté
 */

import React, {
  createContext, // permet de créer un contexte global
  useContext,    // permet de lire facilement le contexte depuis n'importe quel composant
  useState,      // stocke l'utilisateur connecté (ou null)
} from "react";

// On crée le contexte.
// Valeur initiale : null (par défaut, personne n'est connecté).
const UserContext = createContext(null);

/**
 * UserProvider
 * ------------
 * Fournit le contexte utilisateur à toute l'application.
 * Tous les composants placés dans <UserProvider> auront accès à :
 * - user : infos de l'utilisateur connecté
 * - setUser : pour définir/modifier l'utilisateur (ex: après connexion)
 * - logout : pour déconnecter l'utilisateur
 */
export const UserProvider = ({ children }) => {
  /**
   * user
   * ----
   * - null quand personne n'est connecté
   * - sinon un objet du type :
   *   { id, nom, prenom, email, telephone }
   */
  const [user, setUser] = useState(null);

  /**
   * logout
   * ------
   * Déconnexion simple :
   * - On remet user à null
   * - Le front considérera automatiquement que l'utilisateur n'est plus connecté
   *   (ex: Profil affichera le message "Veuillez vous connecter", etc.)
   *
   * Note :
   * - Ici tu n'as pas encore de token (JWT) ni de session serveur.
   * - Donc "logout" consiste juste à effacer l'utilisateur côté front.
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Provider
   * --------
   * value = ce que tous les composants pourront récupérer via useUser()
   */
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {/* Tous les composants enfants peuvent utiliser le contexte */}
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser
 * -------
 * Hook utilitaire : permet d'accéder au contexte utilisateur sans répéter useContext(UserContext)
 *
 * Exemple :
 *   const { user, setUser, logout } = useUser();
 */
export const useUser = () => useContext(UserContext);
