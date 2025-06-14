// src/pages/SkillListPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useFetchSkills } from "../hooks/useFetchSkills"; // come definito prima

export default function SkillListPage() {
  const { data: skills, loading, error, refetch } = useFetchSkills();

  if (loading) return <p className="p-4">Caricamento...</p>;
  if (error)
    return (
      <div className="p-4">
        <p className="text-red-500">Errore: {error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-indigo-600 hover:underline"
        >
          Riprova
        </button>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Elenco Skill</h2>
      {skills.length === 0 ? (
        <p>Nessuna skill trovata.</p>
      ) : (
        <ul className="space-y-2">
          {skills.map((s) => (
            <li key={s.id} className="border p-4 rounded hover:shadow">
              <Link
                to={`/skills/${s.id}`}
                className="text-indigo-600 hover:underline"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
