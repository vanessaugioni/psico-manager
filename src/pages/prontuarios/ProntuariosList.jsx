import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Edit, Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function ProntuariosList() {
    const navigate = useNavigate();
    const [prontuarios, setProntuarios] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchProntuarios();
    }, []);

    const fetchProntuarios = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("prontuarios")
            .select(`
                id,
                data_criacao,
                motivo_consulta,
                pacientes:pacientes!inner(id_paciente, nome),
                situacoes:situacoes!inner(id, descricao)
            `)
            .order("id", { ascending: false });

        if (error) {
            console.error("Erro ao buscar prontuários:", error);
        } else {
            console.log("Prontuários carregados:", data); 
            setProntuarios(data);
        }

        setLoading(false);
    };

    const filtered = prontuarios.filter((p) =>
        p.pacientes?.nome?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const handleNovo = () => navigate("/prontuarioForm");
    const handleEditar = (id) => navigate(`/prontuario/edit/${id}`);

    return (
        <div className="flex min-h-screen bg-[#f8f8f8]">
            <aside><Sidebar /></aside>
            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Prontuários</h1>
                    <p className="text-gray-500 text-sm">Gerencie os prontuários dos pacientes.</p>
                </header>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                    <div className="flex-1 relative shadow-sm rounded-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por paciente..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40 text-sm bg-white"
                        />
                        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
                    </div>

                    <button onClick={handleNovo} className="flex items-center justify-center gap-2 bg-[#9F6C4D] text-white px-4 py-2 rounded-lg hover:bg-[#875B3F] transition text-sm font-medium shadow-sm whitespace-nowrap">
                        <Plus size={16} /> Novo Prontuário
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto min-h-[360px]">
                    <table className="w-full text-sm text-left text-gray-700 min-w-[750px]">
                        <thead className="bg-white text-gray-600 text-xs uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Paciente</th>
                                <th className="px-4 py-3 font-semibold">Motivo</th>
                                <th className="px-4 py-3 font-semibold">Situação</th>
                                <th className="px-4 py-3 font-semibold">Data</th>
                                <th className="px-4 py-3 text-right font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-6 text-gray-500">Carregando...</td></tr>
                            ) : paginated.length > 0 ? (
                                paginated.map((p) => (
                                    <tr key={p.id} className="bg-white hover:bg-[#F6F1ED] transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">{p.pacientes?.nome || "—"}</td>
                                        <td className="px-4 py-3">{p.motivo_consulta || "—"}</td>
                                        <td className="px-4 py-3">{p.situacoes?.descricao || "—"}</td>
                                        <td className="px-4 py-3">{new Date(p.data_criacao).toLocaleDateString("pt-BR")}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleEditar(p.id)} className="p-2 rounded-md hover:bg-gray-100 transition">
                                                <Edit size={17} className="text-gray-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-6 text-gray-500 italic">Nenhum prontuário encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 mt-6 gap-3">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 disabled:opacity-50">
                        <ChevronLeft size={18} className="text-gray-600" /> Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages || 1}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 disabled:opacity-50">
                        Próxima <ChevronRight size={18} className="text-gray-600" />
                    </button>
                </div>
            </main>
        </div>
    );
}
