// src/pages/SkillDetailPage.jsx
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useFetchSkillById } from "../hooks/useFetchSkillById";

export default function SkillDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: skill, loading, error } = useFetchSkillById(id);

  if (loading) return <p className="p-4">Caricamento...</p>;
  if (error)
    return (
      <div className="p-4">
        <p className="text-red-500">Errore: {error}</p>
        <button
          onClick={() => navigate("/skills")}
          className="mt-2 text-indigo-600 hover:underline"
        >
          Torna alla lista
        </button>
      </div>
    );
  if (!skill)
    return (
      <div className="p-4">
        <p>Skill non trovata.</p>
        <Link to="/skills" className="text-indigo-600 hover:underline">
          Torna alla lista
        </Link>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{skill.name}</h2>
      <p className="mb-2">
        <strong>Descrizione:</strong> {skill.description}
      </p>
      {/* altri campi */}
      <div className="mt-4 space-x-4">
        <Link
          to={`/skills/${id}/edit`}
          className="text-yellow-600 hover:underline"
        >
          Modifica
        </Link>
        <Link to="/skills" className="text-indigo-600 hover:underline">
          ← Torna alla lista
        </Link>
      </div>
    </div>
  );
}
