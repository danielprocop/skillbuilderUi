// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // conterrà username, userId, ecc.
  const [attributes, setAttributes] = useState(null); // oggetto con attributi utente
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // All’avvio, controlla utente autenticato
    getCurrentUser()
      .then(async (u) => {
        setUser(u);
        // Poi prendi gli attributi, se necessari
        try {
          const attrList = await fetchUserAttributes();
          // fetchUserAttributes restituisce un array di oggetti { Name, Value }
          const attrObj = attrList.reduce((acc, { Name, Value }) => {
            acc[Name] = Value;
            return acc;
          }, {});
          setAttributes(attrObj);
        } catch {
          setAttributes(null);
        }
      })
      .catch(() => {
        setUser(null);
        setAttributes(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username, password) => {
    if (!username || !password)
      throw new Error("Username e password sono richiesti");
    const u = await amplifySignIn({ username, password });
    setUser(u);
    // Dopo login, recupera anche attributi
    try {
      const attrList = await fetchUserAttributes();
      const attrObj = attrList.reduce((acc, { Name, Value }) => {
        acc[Name] = Value;
        return acc;
      }, {});
      setAttributes(attrObj);
    } catch {
      setAttributes(null);
    }
    return u;
  };

  const signOut = async () => {
    await amplifySignOut();
    setUser(null);
    setAttributes(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, attributes, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
