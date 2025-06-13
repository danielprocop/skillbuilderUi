import { useState } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

export default function SkillForm() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillData = {
      name,
      level: parseInt(level),
    };

    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setResponse({ message: "Errore durante l'invio", error: err.toString() });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Aggiungi Skill</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome skill
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Livello (1-5)
          </label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            min="1"
            max="5"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          Invia
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
