import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Edit, Trash2, Plus } from "lucide-react";


export default function PacienteList() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([
    { id: 1, fullName: "Ana Clara Souza", email: "ana.souza@email.com", phone: "(11) 91234-5678", birthDate: "1990-03-15" },
    { id: 2, fullName: "Bruno Lima", email: "bruno.lima@email.com", phone: "(21) 99876-5432", birthDate: "1985-07-22" },
    { id: 3, fullName: "Carla Fernandes", email: "carla.fernandes@email.com", phone: "(31) 98765-4321", birthDate: "1992-12-05" },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState(null);

  const filteredPacientes = pacientes.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (paciente) => {
    setPacientes((prev) => prev.filter((p) => p.id !== paciente.id));
    setShowModal(false);
    setPacienteToDelete(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Pacientes</h1>

        <div className="flex justify-between items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 transition max-w-sm"
          />
          <button
            className="flex items-center gap-1 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900 transition"
            onClick={() => navigate("/pacientesForm")}
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">Nome</th>
                <th className="border px-3 py-2 text-left">Email</th>
                <th className="border px-3 py-2 text-left">Telefone</th>
                <th className="border px-3 py-2 text-left">Nascimento</th>
                <th className="border px-3 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="border px-3 py-2">{p.fullName}</td>
                  <td className="border px-3 py-2">{p.email}</td>
                  <td className="border px-3 py-2">{p.phone}</td>
                  <td className="border px-3 py-2">{p.birthDate}</td>
                  <td className="border px-3 py-2 flex gap-2">
                    <button
                      onClick={() => navigate(`/pacientes/${p.id}`)} 
                      className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setPacienteToDelete(p);
                        setShowModal(true);
                      }}
                      className="flex items-center justify-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && pacienteToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
              <p className="mb-6">
                Deseja realmente excluir <strong>{pacienteToDelete.fullName}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDelete(pacienteToDelete)}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
