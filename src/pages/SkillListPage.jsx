// src/pages/SkillListPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useFetchSkills } from "../hooks/useFetchSkills";

export default function SkillListPage() {
  const { data: skills, loading, error, refetch } = useFetchSkills();

  console.log("SkillListPage skills:", skills);

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

  if (skills.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Elenco Skill</h2>
        <p>Nessuna skill trovata.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Elenco Skill</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Skill
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Livello
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Data Acquisizione
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {skills.map((s) => {
              const id = s.Skill_UID; // verifica che esista e sia unico
              const level = s.level ?? s.Level ?? "-";
              const acquired = s.acquired_on ?? s.acquiredOn ?? s.AcquiredOn;
              let acquiredStr = "-";
              if (acquired) {
                const d = new Date(acquired);
                if (!isNaN(d)) {
                  acquiredStr = d.toLocaleDateString("it-IT", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                } else {
                  acquiredStr = acquired;
                }
              }
              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      to={`/skills/${id}`}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                    {level}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                    {acquiredStr}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
