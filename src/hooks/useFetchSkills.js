// src/hooks/useFetchSkills.js
import { useState, useEffect } from "react";
import { API_BASE_URL, skillsEndpoint } from "../config";
import { getAuthHeader } from "../utils/authHeader";

export function useFetchSkills() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
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
      const res = await fetch(`${API_BASE_URL}${skillsEndpoint}`, {
        method: "GET",
        headers,
      });
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Errore fetching skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return { data, loading, error, refetch: fetchSkills };
}
