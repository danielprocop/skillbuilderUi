import { fetchAuthSession } from "aws-amplify/auth";

export async function getAuthHeader() {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (idToken) {
      return { Authorization: idToken };
    }
  } catch {
    // utente non loggato o errore
  }
  return {};
}
