import { useState } from "react";
import { API_BASE_URL, newSkill } from "../config";

export function useAddUser() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSkill = async (skillData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}${newSkill}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setResponse({ message: "Errore durante l'invio", error: err.toString() });
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, addSkill };
}
