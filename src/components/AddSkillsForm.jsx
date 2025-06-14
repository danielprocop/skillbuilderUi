// src/components/AddSkillsForm.jsx
import React, { useState } from "react";
import { useAddSkills } from "../hooks/useAddSkills";

export default function AddSkillsForm() {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState(1);
  const { response, loading, addSkill } = useAddSkills();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assumendo che la Lambda legga body.name o body.skill
      await addSkill({ name: skill, level: parseInt(level, 10) });
      setSkill("");
      setLevel(1);
    } catch (err) {
      console.error("Errore invio skill:", err);
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
