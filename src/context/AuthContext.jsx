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
    console.log("AuthProvider: inizio verifica utente");
    getCurrentUser()
      .then(async (u) => {
        // Se getCurrentUser() risolve, c’è un utente valido
        console.log("AuthProvider: getCurrentUser ha restituito:", u);
        setUser(u); // Imposta user con l’oggetto restituito
        // Prova a recuperare gli attributi utente (es. email, nome, ecc.)
        try {
          const attrList = await fetchUserAttributes();
          console.log(
            "AuthProvider: fetchUserAttributes restituito:",
            attrList
          );

          let attrObj = null;

          if (Array.isArray(attrList)) {
            // array di { Name, Value }
            attrObj = attrList.reduce((acc, { Name, Value }) => {
              acc[Name] = Value;
              return acc;
            }, {});
          } else if (attrList && typeof attrList === "object") {
            // se è un oggetto, potrebbe avere proprietà che contengono l’array
            if (Array.isArray(attrList.Attributes)) {
              attrObj = attrList.Attributes.reduce((acc, { Name, Value }) => {
                acc[Name] = Value;
                return acc;
              }, {});
            } else if (Array.isArray(attrList.UserAttributes)) {
              attrObj = attrList.UserAttributes.reduce(
                (acc, { Name, Value }) => {
                  acc[Name] = Value;
                  return acc;
                },
                {}
              );
            } else {
              // potrebbe essere un oggetto piatto { sub: "...", email: "...", ... }
              const maybeAttrs = {};
              let count = 0;
              for (const [k, v] of Object.entries(attrList)) {
                if (typeof v === "string") {
                  maybeAttrs[k] = v;
                  count++;
                }
              }
              if (count > 0) {
                attrObj = maybeAttrs;
              } else {
                console.warn("Formato attributi inatteso:", attrList);
              }
            }
          } else {
            console.warn(
              "fetchUserAttributes ha restituito tipo inatteso:",
              attrList
            );
          }

          setAttributes(attrObj);
        } catch (err) {
          console.warn("AuthProvider: fetchUserAttributes ha fallito:", err);
          setAttributes(null);
        }
      })
      .catch((err) => {
        console.log("AuthProvider: nessun utente autenticato:", err);
        setUser(null);
        setAttributes(null);
      })
      .finally(() => {
        console.log("AuthProvider: caricamento iniziale completato");
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
    let freshUser = null;
    try {
      freshUser = await getCurrentUser();
    } catch {
      freshUser = u; // fallback se getCurrentUser fallisse, ma in genere non dovrebbe
    }
    setUser(freshUser);
    // Dopo login, recupera nuovamente attributi utente
    try {
      const attrList = await fetchUserAttributes();
      console.log("AuthProvider: fetchUserAttributes ha restituito:", attrList);
      const attrObj = attrList.reduce((acc, { Name, Value }) => {
        acc[Name] = Value;
        return acc;
      }, {});
      setAttributes(attrObj);
    } catch (err) {
      console.warn("AuthProvider: fetchUserAttributes ha fallito:", err);
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

  const providedUserId = user?.userId ?? attributes?.sub ?? null;
  console.log("AuthProvider: userId =", providedUserId);

  // Provider espone user, attributes, loading (ormai false), signIn, signOut
  return (
    <AuthContext.Provider
      value={{
        user,
        userId: providedUserId,
        attributes,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
