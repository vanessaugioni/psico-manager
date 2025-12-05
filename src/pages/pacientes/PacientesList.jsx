import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Edit, Plus, Search, X, ChevronLeft, ChevronRight, User } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function PacienteList() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchPacientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro ao buscar pacientes:", error);
    } else {
      setPacientes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const filteredPacientes = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage);
  const paginatedPacientes = filteredPacientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return "-";
    const today = new Date();
    const birthDate = new Date(dataNascimento);
    let idade = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) idade--;
    return idade;
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <aside className="w-20 sm:w-64 h-screen sticky top-0 border-r border-gray-200 bg-white z-40 shadow-sm">
        <Sidebar />
      </aside>


      <main className="flex-1 p-8">



        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Pacientes</h1>
          <p className="text-gray-500 text-sm">
            Gerencie e acompanhe os pacientes cadastrados no sistema.
          </p>
        </header>


        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div className="flex-1 relative shadow-sm rounded-lg">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-9 h-10 border border-gray-200 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40 text-sm bg-white transition-all duration-200"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => navigate("/paciente/novo")}
            className="
  h-10 px-5
  flex items-center justify-center gap-2
  bg-[#9F6C4D] text-white
  rounded-lg 
  font-normal text-sm
  shadow-md

  transition-all duration-300
  hover:bg-[#875B3F]
  hover:shadow-lg
  active:scale-[0.97]
"

          >
            Novo paciente
          </button>

        </div>



        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto min-h-[360px]">
          <table className="w-full text-sm text-left text-gray-700 min-w-[750px]">
            <thead className="bg-white text-gray-600 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-6">
                  <input type="checkbox" className="accent-[#9F6C4D]" />
                </th>
                <th className="px-4 py-3 font-semibold">Foto</th>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Celular</th>
                <th className="px-4 py-3 font-semibold">Idade</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Carregando pacientes...
                  </td>
                </tr>
              ) : paginatedPacientes.length > 0 ? (
                <>
                  {paginatedPacientes.map((p) => (
                    <tr
                      key={p.id}
                      className="bg-white hover:bg-[#F6F1ED] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" className="accent-[#9F6C4D]" />
                      </td>
                      <td className="px-4 py-3">
                        {p.foto ? (
                          <img
                            src={p.foto}
                            alt={p.nome}
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={16} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.nome}</td>
                      <td className="px-4 py-3">{p.contato}</td>
                      <td className="px-4 py-3">{calcularIdade(p.data_nascimento)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/paciente/edit/${p.id_paciente}`)}
                          className="p-2 rounded-md hover:bg-gray-100 transition"
                        >
                          <Edit size={17} className="text-gray-600" />
                        </button>

                      </td>
                    </tr>
                  ))}

                  {paginatedPacientes.length < itemsPerPage &&
                    Array.from({ length: itemsPerPage - paginatedPacientes.length }).map((_, i) => (
                      <tr key={`empty-${i}`} className="h-12">
                        <td colSpan="6"></td>
                      </tr>
                    ))}
                </>
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mt-6 gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={18} className="text-gray-600" /> Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 disabled:opacity-50"
          >
            Próxima <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </main>
    </div>
  );
}
