// src/hooks/useAddSkills.js
import { useState } from "react";
import { API_BASE_URL, skillsEndpoint } from "../config";
import { getAuthHeader } from "../utils/authHeader";

export function useAddSkills() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSkill = async (skillData) => {
    setLoading(true);
    console.log("POST a:", `${API_BASE_URL}${skillsEndpoint}`);
    if (!API_BASE_URL) {
      setResponse({ message: "Configurazione API mancante" });
      setLoading(false);
      return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      };
      const res = await fetch(`${API_BASE_URL}${skillsEndpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(skillData),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Errore ${res.status}: ${text}`);
      }
      const result = await res.json();
      setResponse(result);
      return result;
    } catch (err) {
      setResponse({ message: "Errore durante l'invio", error: err.message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, addSkill };
}
