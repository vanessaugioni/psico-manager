import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProntuarioEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [pacientes, setPacientes] = useState([]);
    const [situacoes, setSituacoes] = useState([]);

    const [pacienteId, setPacienteId] = useState("");
    const [situacaoId, setSituacaoId] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [relato, setRelato] = useState("");
    const [queixa, setQueixa] = useState("");
    const [resumoVida, setResumoVida] = useState("");
    const [comorbidades, setComorbidades] = useState("");
    const [alergias, setAlergias] = useState("");
    const [histFamiliar, setHistFamiliar] = useState("");
    const [histMedico, setHistMedico] = useState("");
    const [histPsico, setHistPsico] = useState("");
    const [medicacoes, setMedicacoes] = useState("");
    const [sono, setSono] = useState("");
    const [alimentacao, setAlimentacao] = useState("");
    const [atividadeFisica, setAtividadeFisica] = useState("");
    const [interacaoSocial, setInteracaoSocial] = useState("");
    const [violencia, setViolencia] = useState("");
    const [delirios, setDelirios] = useState("");
    const [hobbies, setHobbies] = useState("");
    const [manias, setManias] = useState("");
    const [pensamentos, setPensamentos] = useState("");
    const [sintomas, setSintomas] = useState("");
    const [vicios, setVicios] = useState("");
    const [plano, setPlano] = useState("");
    const [estadoAtual, setEstadoAtual] = useState("");

    const [openSections, setOpenSections] = useState({
        basico: true,
        historico: false,
        medico: false,
        psicologico: false,
        habitos: false,
        plano: false,
    });

    const toggleSection = (sec) => {
        setOpenSections({ ...openSections, [sec]: !openSections[sec] });
    };

    const inputClass =
        "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D] transition bg-white text-gray-700 placeholder-gray-400 text-sm sm:text-base";
    const textareaClass = `${inputClass} h-24 resize-none`;
    const sectionClass =
        "bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4";

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const [{ data: pacientesData }, { data: situacoesData }] =
                await Promise.all([
                    supabase.from("pacientes").select("id_paciente, nome"),
                    supabase.from("situacoes").select("*"),
                ]);

            setPacientes(pacientesData || []);
            setSituacoes(situacoesData || []);


            const { data: prontuarioData, error } = await supabase
                .from("prontuarios")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.log(error);
                toast.error("Erro ao carregar prontuário");
                navigate("/prontuarios");
                return;
            }

            setPacienteId(prontuarioData.id_paciente);
            setSituacaoId(prontuarioData.situacao);
            setMotivoConsulta(prontuarioData.motivo_consulta || "");
            setRelato(prontuarioData.relato_paciente || "");
            setQueixa(prontuarioData.queixa_principal || "");
            setResumoVida(prontuarioData.resumo_vida || "");
            setComorbidades(prontuarioData.comorbidades || "");
            setAlergias(prontuarioData.alergias || "");
            setHistFamiliar(prontuarioData.historico_familiar || "");
            setHistMedico(prontuarioData.historico_medico || "");
            setHistPsico(prontuarioData.historico_psicossocial || "");
            setMedicacoes(prontuarioData.medicacoes || "");
            setSono(prontuarioData.sono || "");
            setAlimentacao(prontuarioData.alimentacao || "");
            setAtividadeFisica(prontuarioData.atividade_fisica || "");
            setInteracaoSocial(prontuarioData.interacao_social || "");
            setViolencia(prontuarioData.violencia || "");
            setDelirios(prontuarioData.delirios_alucinacoes || "");
            setHobbies(prontuarioData.hobbies || "");
            setManias(prontuarioData.manias_toq || "");
            setPensamentos(prontuarioData.pensamentos_intrusivos || "");
            setSintomas(prontuarioData.sintomas || "");
            setVicios(prontuarioData.vicios || "");
            setPlano(prontuarioData.plano_terapeutico || "");
            setEstadoAtual(prontuarioData.estado_atual || "");

            setLoading(false);
        };

        loadData();
    }, [id, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();

        if (!pacienteId || !situacaoId || !motivoConsulta.trim()) {
            toast.error("Campos obrigatórios não preenchidos!");
            return;
        }

        const { data, error } = await supabase
            .from("prontuarios")
            .update({
                id_paciente: pacienteId,
                situacao: situacaoId,
                motivo_consulta: motivoConsulta,
                relato_paciente: relato,
                queixa_principal: queixa,
                resumo_vida: resumoVida,
                comorbidades,
                alergias,
                historico_familiar: histFamiliar,
                historico_medico: histMedico,
                historico_psicossocial: histPsico,
                medicacoes,
                sono,
                alimentacao,
                atividade_fisica: atividadeFisica,
                interacao_social: interacaoSocial,
                violencia,
                delirios_alucinacoes: delirios,
                hobbies,
                manias_toq: manias,
                pensamentos_intrusivos: pensamentos,
                sintomas,
                vicios,
                plano_terapeutico: plano,
                estado_atual: estadoAtual,
            })
            .eq("id", id);

        if (error) {
            console.log(error);
            toast.error("Erro ao atualizar prontuário");
            return;
        }

        toast.success("Prontuário atualizado!");
        setTimeout(() => navigate("/prontuarios"), 1500);
    };

    const handleCancel = () => navigate("/prontuarios");

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#f8f8f8]">
            <ToastContainer position="top-right" />
            <aside className="flex-shrink-0 w-20 sm:w-64 h-screen sticky top-0">
                <Sidebar />
            </aside>

            <main className="flex-1 p-4 sm:p-8 flex flex-col">
                <header className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Editar Prontuário
                    </h1>
                    <p className="text-gray-500">
                        Atualize os dados clínicos do paciente.
                    </p>
                </header>

                <div className="flex justify-end gap-2 mb-6">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md bg-[#9F6C4D] text-white hover:bg-[#8e5b41]"
                    >
                        Salvar
                    </button>
                </div>

                <form className="flex flex-col gap-6">
 
                    <div className={sectionClass}>
                        <button
                            type="button"
                            onClick={() => toggleSection("basico")}
                            className="w-full flex justify-between items-center mb-4 text-left text-gray-700 font-semibold"
                        >
                            Informações Básicas
                            {openSections.basico ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        {openSections.basico && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <select
                                    className={`${inputClass} appearance-none`}
                                    value={pacienteId}
                                    onChange={(e) => setPacienteId(e.target.value)}
                                >
                                    <option value="">Selecione o Paciente *</option>
                                    {pacientes.map((p) => (
                                        <option key={p.id_paciente} value={p.id_paciente}>
                                            {p.nome}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className={`${inputClass} appearance-none`}
                                    value={situacaoId}
                                    onChange={(e) => setSituacaoId(e.target.value)}
                                >
                                    <option value="">Situação *</option>
                                    {situacoes.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.descricao}
                                        </option>
                                    ))}
                                </select>

                                <textarea
                                    className={textareaClass}
                                    placeholder="Motivo da Consulta *"
                                    value={motivoConsulta}
                                    onChange={(e) => setMotivoConsulta(e.target.value)}
                                />

                                <textarea
                                    className={textareaClass}
                                    placeholder="Relato do Paciente"
                                    value={relato}
                                    onChange={(e) => setRelato(e.target.value)}
                                />

                                <textarea
                                    className={textareaClass}
                                    placeholder="Queixa Principal"
                                    value={queixa}
                                    onChange={(e) => setQueixa(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className={sectionClass}>
                        <button
                            type="button"
                            onClick={() => toggleSection("historico")}
                            className="w-full flex justify-between items-center mb-4 font-semibold text-gray-700"
                        >
                            Prontuário
                            {openSections.historico ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        {openSections.historico && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <textarea className={textareaClass} placeholder="Resumo de Vida" value={resumoVida} onChange={(e) => setResumoVida(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Comorbidades" value={comorbidades} onChange={(e) => setComorbidades(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Alergias" value={alergias} onChange={(e) => setAlergias(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Histórico Familiar" value={histFamiliar} onChange={(e) => setHistFamiliar(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Histórico Médico" value={histMedico} onChange={(e) => setHistMedico(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Medicações" value={medicacoes} onChange={(e) => setMedicacoes(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Sono" value={sono} onChange={(e) => setSono(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Alimentação" value={alimentacao} onChange={(e) => setAlimentacao(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Histórico Psicossocial" value={histPsico} onChange={(e) => setHistPsico(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Interação Social" value={interacaoSocial} onChange={(e) => setInteracaoSocial(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Violência" value={violencia} onChange={(e) => setViolencia(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Delírios / Alucinações" value={delirios} onChange={(e) => setDelirios(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Atividade Física" value={atividadeFisica} onChange={(e) => setAtividadeFisica(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Hobbies" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Manias / TOC" value={manias} onChange={(e) => setManias(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Pensamentos Intrusivos" value={pensamentos} onChange={(e) => setPensamentos(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Vícios" value={vicios} onChange={(e) => setVicios(e.target.value)} />
                                <textarea className={textareaClass} placeholder="Sintomas" value={sintomas} onChange={(e) => setSintomas(e.target.value)} />
                                <textarea className={`${textareaClass} h-32`} placeholder="Plano Terapêutico" value={plano} onChange={(e) => setPlano(e.target.value)} />
                                <textarea className={`${textareaClass} h-32`} placeholder="Estado Atual" value={estadoAtual} onChange={(e) => setEstadoAtual(e.target.value)} />
                            </div>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
}
