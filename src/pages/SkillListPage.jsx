// src/pages/SkillListPage.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFetchSkills } from "../hooks/useFetchSkills";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function SkillListPage() {
  const { data: skills, loading, error, refetch } = useFetchSkills();

  const [sortField, setSortField] = useState(null); // 'skill' | 'level' | 'acquired_on'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' o 'desc'

  // Funzione per gestire click su header: toggle se stesso, altrimenti set nuovo con asc
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Funzione per parsare la data "DD/MM/YYYY" in oggetto Date
  const parseDate = (str) => {
    if (!str) return null;
    const parts = str.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map((p) => parseInt(p, 10));
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, day);
  };

  // Calcola array ordinato con useMemo per efficienza
  const sortedSkills = useMemo(() => {
    if (!Array.isArray(skills)) return [];
    if (!sortField) return skills;

    // Copia per non mutare l'originale
    const arr = [...skills];
    arr.sort((a, b) => {
      let aVal, bVal;
      if (sortField === "skill") {
        aVal = a.skill?.toLowerCase() ?? "";
        bVal = b.skill?.toLowerCase() ?? "";
      } else if (sortField === "level") {
        // level è stringa, converti a numero
        aVal = parseInt(a.level, 10) || 0;
        bVal = parseInt(b.level, 10) || 0;
      } else if (sortField === "acquired_on") {
        const da = parseDate(a.acquired_on);
        const db = parseDate(b.acquired_on);
        aVal = da ? da.getTime() : 0;
        bVal = db ? db.getTime() : 0;
      } else {
        return 0;
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [skills, sortField, sortOrder]);

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

  if (!Array.isArray(skills) || skills.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Elenco Skill</h2>
        <p>Nessuna skill trovata.</p>
      </div>
    );
  }

  // Helper per render icona freccia
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="inline-block w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline-block w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Elenco Skill</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              {/* Skill */}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                <button
                  type="button"
                  onClick={() => handleSort("skill")}
                  className="flex items-center"
                >
                  Skill
                  {renderSortIcon("skill")}
                </button>
              </th>
              {/* Livello */}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                <button
                  type="button"
                  onClick={() => handleSort("level")}
                  className="flex items-center"
                >
                  Livello
                  {renderSortIcon("level")}
                </button>
              </th>
              {/* Data Acquisizione */}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                <button
                  type="button"
                  onClick={() => handleSort("acquired_on")}
                  className="flex items-center"
                >
                  Data Acquisizione
                  {renderSortIcon("acquired_on")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedSkills.map((s) => {
              const id = s.Skill_UID;
              const name = s.skill;
              const level = s.level;
              const acquiredStr = s.acquired_on;
              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      to={`/skills/${id}`}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      {name}
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
