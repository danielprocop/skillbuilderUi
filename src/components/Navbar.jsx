// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, attributes, signOut, loading } = useContext(AuthContext);
  if (loading) return null;
  let displayName = "";
  if (attributes) {
    if (attributes.given_name || attributes.family_name) {
      displayName = `${attributes.given_name || ""} ${
        attributes.family_name || ""
      }`.trim();
    } else if (attributes.name) {
      displayName = attributes.name;
    }
  }
  if (!displayName && user) displayName = user.username;

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold">
          Logo
        </Link>
        {user && (
          <>
            <Link to="/skills" className="hover:underline">
              Lista Skill
            </Link>
            <Link to="/add-skill" className="hover:underline">
              Nuova Skill
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">👤 {displayName}</span>
            <button
              onClick={signOut}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
