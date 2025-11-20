import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Edit, Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PacienteList() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([
    {
      id: 1,
      fullName: "Ana Clara Souza",
      email: "ana.souza@email.com",
      phone: "123-456-7890",
      birthDate: "2021-03-19",
      grupo: "Grupo A",
    },
    {
      id: 2,
      fullName: "Bruno Lima",
      email: "bruno.lima@email.com",
      phone: "123-456-7890",
      birthDate: "2021-03-19",
      grupo: "Grupo A",
    },
    {
      id: 3,
      fullName: "Carla Fernandes",
      email: "carla.fernandes@email.com",
      phone: "123-456-7890",
      birthDate: "2021-03-19",
      grupo: "Grupo B",
    },
    {
      id: 4,
      fullName: "Daniel Rocha",
      email: "daniel.rocha@email.com",
      phone: "123-456-7890",
      birthDate: "2021-03-19",
      grupo: "Grupo C",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredPacientes = pacientes.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const getGrupoColor = (grupo) => {
    switch (grupo) {
      case "Grupo A":
        return "bg-blue-50 text-blue-600";
      case "Grupo B":
        return "bg-green-50 text-green-600";
      case "Grupo C":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Pacientes</h1>
          <p className="text-gray-500 text-sm">
            Gerencie e acompanhe os pacientes cadastrados no sistema.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          {/* Campo de busca ocupa todo o espaço */}
          <div className="flex-1 relative shadow-sm rounded-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4D7CFC]/30 text-sm bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => navigate("/pacientesForm")}
            className="flex items-center justify-center gap-2 bg-[#4D7CFC] text-white px-4 py-2 rounded-md hover:bg-[#3c6ae0] transition text-sm font-medium shadow-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="bg-white text-gray-600 text-xs uppercase border-b border-gray-100">
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
                filteredPacientes.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-white hover:bg-[#F7F8FF]/70 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" className="accent-gray-500" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700 hover:text-gray-900 transition">
                      {p.fullName}
                    </td>
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-4 py-3">{p.phone}</td>
                    <td className="px-4 py-3">{p.birthDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getGrupoColor(
                          p.grupo
                        )}`}
                      >
                        {p.grupo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/pacientes/PacienteEdit${p.id}`)}
                        className="p-2 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 transition"
                      >
                        <Edit
                          size={17}
                          className="text-gray-600 hover:text-gray-800 transition"
                        />
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

    
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 mt-6 gap-3">
          <div className="flex items-center gap-2 shadow-sm bg-white px-3 py-2 rounded-md">
            <span className="text-gray-500">Itens por página:</span>
            <select className="border-none rounded-md text-sm focus:ring-[#4D7CFC]/40 focus:outline-none bg-transparent">
              <option>5</option>
              <option>10</option>
              <option>25</option>
            </select>
            <span className="text-gray-500">1/4 de 100</span>
          </div>

          <div className="flex items-center gap-1 bg-white px-3 py- rounded-md shadow-sm">
            <button className="p-1 rounded-md hover:bg-gray-100 transition">
              <ChevronLeft size={18} className="text-gray-500" />
            </button>
            <span className="text-gray-500">1 de 40</span>
            <button className="p-1 rounded-md hover:bg-gray-100 transition">
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
