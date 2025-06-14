// src/pages/Home.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, attributes, loading } = useContext(AuthContext);
  let displayName = "";
  if (attributes) {
    if (attributes.given_name || attributes.family_name) {
      displayName = `${attributes.given_name || ""} ${
        attributes.family_name || ""
      }`.trim();
    } else if (attributes.name) displayName = attributes.name;
  }
  if (!displayName && user) displayName = user.username;

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Benvenuto{displayName ? `, ${displayName}` : ""} 👋
      </h1>
      <p className="mb-6">Clicca qui per vedere le tue skill</p>
      <Link
        to="/skills"
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
      >
        Lista Skill
      </Link>
    </div>
  );
}
