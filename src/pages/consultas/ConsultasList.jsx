import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Edit, Plus, Search, X, ChevronLeft, ChevronRight, User } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function ConsultasList() {
    const navigate = useNavigate();

    const [consultas, setConsultas] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchData = async () => {
        setLoading(true);

        const [{ data: consultasData, error: errorConsultas }, { data: pacientesData }] =
            await Promise.all([
                supabase.from("consultas").select("*").order("data_consulta", { ascending: false }),
                supabase.from("pacientes").select("id_paciente, nome"),
            ]);

        if (errorConsultas) console.error("Erro ao buscar consultas:", errorConsultas);

        setConsultas(consultasData || []);
        setPacientes(pacientesData || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getPacienteNome = (id) => pacientes.find((p) => p.id_paciente === id)?.nome || "-";

    const filteredConsultas = consultas.filter((c) =>
        getPacienteNome(c.id_paciente).toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredConsultas.length / itemsPerPage);
    const paginatedConsultas = filteredConsultas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="flex min-h-screen bg-[#f8f8f8]">
            <aside className="flex-shrink-0">
                <Sidebar />
            </aside>
            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Consultas</h1>
                    <p className="text-gray-500 text-sm">Gerencie e acompanhe as consultas cadastradas.</p>
                </header>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                    <div className="flex-1 relative shadow-sm rounded-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por paciente..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40 text-sm bg-white"
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
                        onClick={() => navigate("/consultaForm")}
                        className="flex items-center justify-center gap-2 bg-[#9F6C4D] text-white px-4 py-2 rounded-lg hover:bg-[#875B3F] transition text-sm font-medium shadow-sm whitespace-nowrap"
                    >
                        <Plus size={16} />
                        Adicionar Consulta
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto min-h-[360px]">
                    <table className="w-full text-sm text-left text-gray-700 min-w-[750px]">
                        <thead className="bg-white text-gray-600 text-xs uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Paciente</th>
                                <th className="px-4 py-3 font-semibold">Data</th>
                                <th className="px-4 py-3 font-semibold">Hora</th>
                                <th className="px-4 py-3 font-semibold">Duração</th>
                                <th className="px-4 py-3 font-semibold">Tipo</th>
                                <th className="px-4 py-3 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        Carregando consultas...
                                    </td>
                                </tr>
                            ) : paginatedConsultas.length > 0 ? (
                                paginatedConsultas.map((c) => (
                                    <tr key={c.id} className="bg-white hover:bg-[#F6F1ED] transition-colors">
                                        <td className="px-4 py-3">{getPacienteNome(c.id_paciente)}</td>
                                        <td className="px-4 py-3">{new Date(c.data_consulta).toLocaleDateString("pt-BR")}</td>
                                        <td className="px-4 py-3">{c.hora_consulta}</td>
                                        <td className="px-4 py-3">{`${c.duracao_horas}h`}</td>
                                        <td className="px-4 py-3">{c.tipo}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => navigate(`/consulta/edit/${c.id}`)}
                                                className="p-2 rounded-md hover:bg-gray-100 transition"
                                            >
                                                <Edit size={17} className="text-gray-600" />
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                                        Nenhuma consulta encontrada.
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
