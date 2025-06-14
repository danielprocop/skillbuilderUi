import { createContext, useState, useEffect } from "react";
// Import delle funzioni Amplify Auth che usavi: signIn, signOut, getCurrentUser, fetchUserAttributes
import {
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth";

// Crea il Context per l’autenticazione
export const AuthContext = createContext();

// Provider che avvolge l’app e fornisce user, attributi e funzioni login/logout
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Stato dell’utente autenticato (null se non autenticato)
  const [attributes, setAttributes] = useState(null); // Stato degli attributi Cognito dell’utente
  const [loading, setLoading] = useState(true); // Stato di caricamento iniziale: verifica sessione

  useEffect(() => {
    // All’avvio (montaggio), verifica se c’è un utente già autenticato
    getCurrentUser()
      .then(async (u) => {
        // Se getCurrentUser() risolve, c’è un utente valido
        setUser(u); // Imposta user con l’oggetto restituito
        // Prova a recuperare gli attributi utente (es. email, nome, ecc.)
        try {
          const attrList = await fetchUserAttributes();
          // fetchUserAttributes restituisce array di { Name, Value }
          const attrObj = attrList.reduce((acc, { Name, Value }) => {
            acc[Name] = Value;
            return acc;
          }, {});
          setAttributes(attrObj); // Imposta attributi nel context
        } catch {
          // Se fallisce fetchUserAttributes, mantieni attributes a null
          setAttributes(null);
        }
      })
      .catch(() => {
        // Se getCurrentUser() fallisce, significa che non c’è sessione valida
        setUser(null);
        setAttributes(null);
      })
      .finally(() => {
        // In ogni caso, termina il caricamento iniziale
        setLoading(false);
      });
  }, []); // L’array vuoto fa eseguire solo al montaggio

  // Funzione di login esposta nel context
  const signIn = async (username, password) => {
    // Controllo base: username e password obbligatori
    if (!username || !password)
      throw new Error("Username e password sono richiesti");
    // Chiama Amplify Auth.signIn
    const u = await amplifySignIn({ username, password });
    // Imposta user con l’oggetto restituito (può contenere info base)
    setUser(u);
    // Dopo login, recupera nuovamente attributi utente
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
    return u; // Ritorna l’oggetto user per eventuali ulteriori usi
  };

  // Funzione di logout esposta nel context
  const signOut = async () => {
    // Chiama Amplify Auth.signOut
    await amplifySignOut();
    // Pulisci lo stato user e attributes
    setUser(null);
    setAttributes(null);
    // Nota: qui non facciamo navigate; gestisci il redirect nel componente che chiama signOut
  };

  // Se siamo ancora in fase di caricamento iniziale, mostra un loader
  if (loading) {
    return <div>Caricamento...</div>;
  }

  // Provider espone user, attributes, loading (ormai false), signIn, signOut
  return (
    <AuthContext.Provider
      value={{ user, attributes, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
