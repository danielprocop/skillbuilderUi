import { createContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

// Crea il context
export const AuthContext = createContext();

// Provider che avvolge l’app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Stato dell’utente autenticato (null se non autenticato)
  const [loading, setLoading] = useState(true); // Stato iniziale: stiamo verificando se c’è già sessione valida
  const navigate = useNavigate();

  // Alla prima render (montaggio), controlla se esiste una sessione valida da Amplify
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        // Prova a recuperare l’utente corrente; se non autenticato, genera eccezione
        await Auth.currentSession(); // ripristina la sessione al refresh
        // Se arriva qui, il token è valido. Possiamo ottenere attributi user:
        const currentUser = await Auth.currentAuthenticatedUser(); // ripristina la sessione al refresh
        // currentUser.username o altri attributi
        setUser({
          username: currentUser.getUsername(),
          attributes: currentUser.attributes, // contiene email, etc.
        });
      } catch {
        // Non autenticato o token scaduto
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkCurrentUser();
  }, []);

  // Funzione di login
  const signIn = async (username, password) => {
    try {
      // Effettua il login su Cognito
      const userObj = await Auth.signIn(username, password);
      // Dopo signIn, ottieni attributi o sessione:
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser({
        username: currentUser.getUsername(),
        attributes: currentUser.attributes,
      });
      return userObj;
    } catch (error) {
      console.error("Errore durante signIn:", error);
      // Propaga l’errore in modo che il componente LoginPage lo gestisca
      throw error;
    }
  };

  // Funzione di logout
  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      // Puoi reindirizzare a login:
      navigate("/login");
    } catch (error) {
      console.error("Errore in signOut:", error);
    }
  };

  // Funzione per ottenere header Authorization con il token corrente
  const getAuthHeader = async () => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      return { Authorization: idToken };
    } catch {
      return {};
    }
  };

  // Valori forniti dal context
  const value = {
    user,
    loading,
    signIn,
    signOut,
    getAuthHeader,
  };

  // Finché stiamo verificando la sessione, possiamo mostrare un loader o null
  if (loading) {
    return <div>Caricamento...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
