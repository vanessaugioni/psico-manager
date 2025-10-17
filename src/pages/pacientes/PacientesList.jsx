import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Edit, Trash2, Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PacienteList() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([
    { id: 1, fullName: "Ana Clara Souza", email: "ana.souza@email.com", phone: "123-456-7890", birthDate: "2021-03-19", grupo: "Grupo A" },
    { id: 2, fullName: "Bruno Lima", email: "bruno.lima@email.com", phone: "123-456-7890", birthDate: "2021-03-19", grupo: "Grupo A" },
    { id: 3, fullName: "Carla Fernandes", email: "carla.fernandes@email.com", phone: "123-456-7890", birthDate: "2021-03-19", grupo: "Grupo B" },
    { id: 4, fullName: "Daniel Rocha", email: "daniel.rocha@email.com", phone: "123-456-7890", birthDate: "2021-03-19", grupo: "Grupo C" },
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Pacientes
          </h1>
          <p className="text-gray-600 text-sm">
            Gerencie e acompanhe os pacientes cadastrados no sistema.
          </p>
        </header>

        {/* TOPO: Busca e botão */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          {/* Campo de busca */}
          <div className="flex items-center w-full sm:w-auto min-w-[300px] relative">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/30 text-sm bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Botão adicionar */}
          <button
            onClick={() => navigate("/pacientesForm")}
            className="flex items-center justify-center gap-2 bg-[#9F6C4D] text-white px-4 py-2 rounded-md hover:bg-[#8C5F44] transition text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            Adicionar Paciente
          </button>
        </div>

        {/* TABELA */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 border-b text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 w-6">
                  <input type="checkbox" className="accent-gray-500" />
                </th>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Celular</th>
                <th className="px-4 py-3 font-semibold">Data registro</th>
                <th className="px-4 py-3 font-semibold">Grupo</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.length > 0 ? (
                filteredPacientes.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" className="accent-gray-500" />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/pacientes/${p.id}`)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {p.fullName}
                      </button>
                    </td>
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-4 py-3">{p.phone}</td>
                    <td className="px-4 py-3">{p.birthDate}</td>
                    <td className="px-4 py-3">{p.grupo}</td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/pacientes/${p.id}`)}
                        className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setPacienteToDelete(p);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                      >
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO minimalista */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 mt-6 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Itens por página:</span>
            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-[#9F6C4D]/40 focus:outline-none bg-white">
              <option>5</option>
              <option>10</option>
              <option>25</option>
            </select>
            <span className="text-gray-500">1–4 de 100 itens</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition">
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <span className="px-3 text-gray-700 font-medium">1 de 40</span>
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition">
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* MODAL */}
        {showModal && pacienteToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Confirmar exclusão
              </h2>
              <p className="text-gray-600 mb-6">
                Deseja realmente excluir{" "}
                <strong>{pacienteToDelete.fullName}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(pacienteToDelete)}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
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
