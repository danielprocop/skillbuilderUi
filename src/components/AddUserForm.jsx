import { useState } from "react";
import { useAddUser } from "../hooks/useAddUser";

export default function AddUserForm() {
  const [user, setUser] = useState(""); // 👈 aggiunto
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState(1);
  const { response, loading, addSkill } = useAddUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSkill({ user, skill, level: parseInt(level) });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl mt-10">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Aggiungi Utente</h2> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skill
          </label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
