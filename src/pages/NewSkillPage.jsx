// src/pages/NewSkillPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAddSkills } from "../hooks/useAddSkills";
import { AuthContext } from "../context/AuthContext";

export default function NewSkillPage() {
  const { user } = useContext(AuthContext);
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState(1);
  const { response, loading, addSkill } = useAddSkills();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!skillName) {
      setError("Inserisci il nome della skill");
      return;
    }
    try {
      // payload adatta i campi che il tuo backend si aspetta
      await addSkill({
        user: user.username,
        skill: skillName,
        level: parseInt(level, 10),
      });
      // dopo creazione, torna alla lista o al dettaglio: qui lista
      navigate("/skills");
    } catch (err) {
      setError(err.message || "Errore invio");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Nuova Skill</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome Skill
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
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
          {loading ? "Invio..." : "Crea"}
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
