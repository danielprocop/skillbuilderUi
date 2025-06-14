// src/hooks/useUpdateSkill.js
import { useState } from "react";
import { API_BASE_URL, skillsEndpoint } from "../config";
import { getAuthHeader } from "../utils/authHeader";

export function useUpdateSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSkill = async (id, payload) => {
    setLoading(true);
    setError(null);
    if (!API_BASE_URL) {
      setError("Configurazione API mancante");
      setLoading(false);
      return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      };
      const res = await fetch(`${API_BASE_URL}${skillsEndpoint}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Errore ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (err) {
      setError(err.message || "Errore aggiornamento");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateSkill };
}
