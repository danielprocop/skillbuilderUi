// src/pages/SkillFormPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddSkills } from "../hooks/useAddSkills"; // per POST
import { useFetchSkillById } from "../hooks/useFetchSkillById"; // per GET by id
import { API_BASE_URL, skillsEndpoint } from "../config";
import { AuthContext } from "../context/AuthContext";

export default function SkillFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState(""); // se serve
  const [level, setLevel] = useState(1);
  const [loadingInit, setLoadingInit] = useState(isEdit);
  const [error, setError] = useState("");
  const {
    data: existingSkill,
    loading: loadingFetch,
    error: errorFetch,
  } = useFetchSkillById(id);
  const { response, loading: loadingAdd, addSkill } = useAddSkills();

  useEffect(() => {
    if (isEdit) {
      if (existingSkill) {
        setSkillName(existingSkill.name || "");
        setDescription(existingSkill.description || "");
        setLevel(existingSkill.level || 1);
        setLoadingInit(false);
      }
      if (errorFetch) {
        setError(errorFetch);
        setLoadingInit(false);
      }
    }
  }, [existingSkill, errorFetch, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        user: user?.username,
        name: skillName,
        description,
        level: parseInt(level, 10),
      };
      if (isEdit) {
        // PUT: esempio diretto
        const res = await fetch(`${API_BASE_URL}${skillsEndpoint}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Errore aggiornamento ${res.status}`);
        // opzionalmente leggere res.json()
      } else {
        await addSkill({
          user: user?.username,
          skill: skillName,
          level: parseInt(level, 10),
        });
      }
      navigate("/skills");
    } catch (err) {
      setError(err.message || "Errore salvataggio");
    }
  };

  if (loadingInit) return <p className="p-4">Caricamento...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Modifica Skill" : "Nuova Skill"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome Skill</label>
          <input
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Descrizione</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Livello</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
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
          disabled={loadingAdd}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
            loadingAdd ? "opacity-50" : ""
          }`}
        >
          {isEdit ? "Aggiorna" : loadingAdd ? "Invio..." : "Crea"}
        </button>
      </form>
      {response && !isEdit && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p className="text-sm">
            Risultato creazione: {JSON.stringify(response)}
          </p>
        </div>
      )}
    </div>
  );
}
