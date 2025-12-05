import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProntuarioForm() {
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

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
            const [{ data: pacientes }, { data: situacoes }] = await Promise.all([
                supabase.from("pacientes").select("id_paciente, nome"),
                supabase.from("situacoes").select("*"),
            ]);

            setPacientes(pacientes || []);
            setSituacoes(situacoes || []);
        };

        loadData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        if (!pacienteId || !situacaoId || !motivoConsulta.trim()) {
            toast.error("Campos obrigatórios não preenchidos!");
            return;
        }

        const { data, error } = await supabase.from("prontuarios").insert([
            {
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
            },
        ]);

        if (error) {
            console.log(error);
            toast.error("Já existe um prontuário para esse paciente!");
            return;
        }

        toast.success("Prontuário salvo!");
        setTimeout(() => navigate("/prontuarios"), 1500);
    };

    const handleCancel = () => navigate("/prontuarios");

    return (
        <div className="flex min-h-screen bg-[#f8f8f8]">
            <ToastContainer position="top-right" />

            <aside className="flex-shrink-0 w-20 sm:w-64 h-screen sticky top-0">
                <Sidebar />
            </aside>

            <main className="flex-1 p-4 sm:p-8 flex flex-col">
                <header className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Novo Prontuário
                    </h1>
                    <p className="text-gray-500">
                        Preencha os dados clínicos do paciente.
                    </p>
                </header>

                <div className="flex gap-3 mb-6 justify-end">
                    <button
                        onClick={handleCancel}
                        className="
            h-10 px-5
            flex items-center justify-center gap-2 text-[#4A3F39]
            rounded-lg
            font-normal text-sm
            shadow-md
            transition-all duration-300
            hover:bg-gray-300
            hover:shadow-lg
            active:scale-[0.97]
            bg-gray-200
        "
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
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

                        <hr className="border-gray-300" />

                        {openSections.basico && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Paciente: *
                                    </label>
                                    <select
                                        className={`${inputClass} h-12 py-2 appearance-none border-gray-200`}
                                        value={pacienteId}
                                        onChange={(e) => setPacienteId(e.target.value)}
                                    >
                                        <option value=""></option>
                                        {pacientes.map((p) => (
                                            <option key={p.id_paciente} value={p.id_paciente}>
                                                {p.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Situação: *
                                    </label>
                                    <select
                                        className={`${inputClass} h-12 py-2 appearance-none border-gray-200`}
                                        value={situacaoId}
                                        onChange={(e) => setSituacaoId(e.target.value)}
                                    >
                                        <option value=""></option>
                                        {situacoes.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.descricao}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Motivo da Consulta: *
                                    </label>
                                    <textarea
                                        className={`${textareaClass} h-24`}
                                        value={motivoConsulta}
                                        onChange={(e) => setMotivoConsulta(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Relato do Paciente:
                                    </label>
                                    <textarea
                                        className={`${textareaClass} h-24`}
                                        value={relato}
                                        onChange={(e) => setRelato(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Queixa Principal:
                                    </label>
                                    <textarea
                                        className={`${textareaClass} h-24`}
                                        value={queixa}
                                        onChange={(e) => setQueixa(e.target.value)}
                                    />
                                </div>
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

                        <hr className="border-gray-300" />


                        {openSections.historico && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Resumo de Vida:
                                    </label>
                                    <textarea
                                        className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${textareaClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`} value={resumoVida}
                                        onChange={(e) => setResumoVida(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Comorbidades:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={comorbidades}
                                        onChange={(e) => setComorbidades(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Alergias:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={alergias}
                                        onChange={(e) => setAlergias(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Histórico Familiar:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={histFamiliar}
                                        onChange={(e) => setHistFamiliar(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Histórico Médico:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={histMedico}
                                        onChange={(e) => setHistMedico(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Medicações:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={medicacoes}
                                        onChange={(e) => setMedicacoes(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Sono:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={sono}
                                        onChange={(e) => setSono(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Alimentação:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={alimentacao}
                                        onChange={(e) => setAlimentacao(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Histórico Psicossocial:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={histPsico}
                                        onChange={(e) => setHistPsico(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Interação Social:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={interacaoSocial}
                                        onChange={(e) => setInteracaoSocial(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Violência:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={violencia}
                                        onChange={(e) => setViolencia(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Delírios / Alucinações:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={delirios}
                                        onChange={(e) => setDelirios(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Atividade Física:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={atividadeFisica}
                                        onChange={(e) => setAtividadeFisica(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Hobbies:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={hobbies}
                                        onChange={(e) => setHobbies(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Manias / TOC:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={manias}
                                        onChange={(e) => setManias(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Pensamentos Intrusivos:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={pensamentos}
                                        onChange={(e) => setPensamentos(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Vícios:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={vicios}
                                        onChange={(e) => setVicios(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Sintomas:
                                    </label>
                                    <textarea
                                        className={textareaClass}
                                        value={sintomas}
                                        onChange={(e) => setSintomas(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Plano Terapêutico:
                                    </label>
                                    <textarea
                                        className={`${textareaClass} h-32`}
                                        value={plano}
                                        onChange={(e) => setPlano(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Estado Atual:
                                    </label>
                                    <textarea
                                        className={`${textareaClass} h-32`}
                                        value={estadoAtual}
                                        onChange={(e) => setEstadoAtual(e.target.value)}
                                    />
                                </div>

                            </div>

                        )}
                    </div>
                </form>
            </main>
        </div>
    );
}
