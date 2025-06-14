// src/components/AddSkillsForm.jsx
import React, { useState, useContext } from "react";
import { useAddSkills } from "../hooks/useAddSkills";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function AddSkillsForm() {
  const { user } = useContext(AuthContext);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const { response, loading, addSkill } = useAddSkills();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Utente non autenticato");
      return;
    }
    user.username;
    // Costruisci il payload
    const payload = { skill, level: parseInt(level, 10) };
    try {
      await addSkill(payload);
      // Notifica di successo
      toast.success("Skill aggiunta con successo");
      // Pulisci campi
      setSkill("");
      setLevel("");
      // Eventualmente fai altre azioni con result
    } catch (err) {
      // Notifica di errore, usa il messaggio se presente
      const msg = err.message || "Errore durante l'aggiunta della skill";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skill
          </label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Livello
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Seleziona livello</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white transition ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Invio in corso..." : "Invia"}
        </button>
      </form>
      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md text-sm text-gray-800">
          <h4 className="font-semibold mb-2">Risposta:</h4>
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
