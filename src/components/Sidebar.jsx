import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link to="/pacientes" className="hover:bg-gray-700 p-2 rounded">Pacientes</Link>
        <Link to="/login" className="hover:bg-gray-700 p-2 rounded" onClick={() => localStorage.removeItem("user")}>Sair</Link>
      </nav>
    </div>
  );
}
