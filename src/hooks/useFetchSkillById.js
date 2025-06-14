// src/hooks/useFetchSkillById.js
import { useState, useEffect } from "react";
import { API_BASE_URL, skillsEndpoint } from "../config";
import { getAuthHeader } from "../utils/authHeader";

export function useFetchSkillById(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchById = async () => {
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
          method: "GET",
          headers,
        });
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        const json = await res.json();
        if (mounted) setData(json);
      } catch (err) {
        if (mounted) setError(err.message || "Errore fetching skill");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchById();
    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, loading, error };
}
