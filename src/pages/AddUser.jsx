import AddSkillsForm from "../components/AddSkillsForm";

export default function AddUser() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Aggiungi utente</h2>
        <AddSkillsForm />
      </div>
    </div>
  );
}
