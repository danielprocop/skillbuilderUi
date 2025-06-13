import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">Benvenuto 👋</h1>
      <p className="mb-6">Clicca qui per aggiungere un nuovo utente</p>
      <Link
        to="/skills"
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
      >
        Vai al Form
      </Link>
    </div>
  );
}
