import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function ConsultaForm() {
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState([]);
    const [pacienteId, setPacienteId] = useState("");
    const [dataConsulta, setDataConsulta] = useState("");
    const [horaConsulta, setHoraConsulta] = useState("");
    const [duracao, setDuracao] = useState(""); // HH:MM
    const [tipo, setTipo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [orientacao, setOrientacao] = useState("");

    const [errors, setErrors] = useState({
        paciente: false,
        dataConsulta: false,
        horaConsulta: false,
        duracao: false,
        tipo: false,
    });

    const inputClass =
        "w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40 text-sm bg-white transition-all duration-200";
    const textareaClass = `${inputClass} h-24 resize-none`;
    const blockClass =
        "bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4";
    const sectionTitle = "text-lg font-semibold text-gray-800 mb-1";

    useEffect(() => {
        const fetchPacientes = async () => {
            const { data, error } = await supabase
                .from("pacientes")
                .select("id_paciente, nome")
                .order("nome", { ascending: true });

            if (error) {
                console.error("Erro ao buscar pacientes:", error);
            } else {
                setPacientes(data || []);
            }
        };
        fetchPacientes();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        const newErrors = {
            paciente: !pacienteId,
            dataConsulta: !dataConsulta,
            horaConsulta: !horaConsulta,
            duracao: !duracao || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(duracao),
            tipo: !tipo,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) {
            toast.error("Preencha corretamente todos os campos obrigatórios!");
            return;
        }

        // Verificar conflitos
        const { data: conflitos, error: errorConflito } = await supabase
            .from("consultas")
            .select("*")
            .eq("id_paciente", pacienteId)
            .eq("data_consulta", dataConsulta)
            .eq("hora_consulta", horaConsulta);

        if (errorConflito) {
            console.error(errorConflito);
            toast.error("Erro ao verificar conflitos de horário");
            return;
        }

        if (conflitos.length > 0) {
            toast.error("Já existe uma consulta nesse paciente, data e horário!");
            return;
        }

        const { error } = await supabase.from("consultas").insert([
            {
                id_paciente: pacienteId,
                data_consulta: dataConsulta,
                hora_consulta: horaConsulta,
                duracao_horas: duracao,
                tipo,
                descricao,
                orientacao,
            },
        ]);

        if (error) {
            console.error(error);
            toast.error("Erro ao salvar a consulta!");
            return;
        }

        toast.success("Consulta salva com sucesso!");
        setTimeout(() => navigate("/consultas"), 1500);
    };

    const handleCancel = () => navigate("/consultas");

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const dataURL = params.get("data");

        if (dataURL) {
            setDataConsulta(dataURL);
        }
    }, [location.search]);


    return (
        <div className="flex min-h-screen bg-[#f6f6f6]">
            <ToastContainer />

            <aside className="w-20 sm:w-64 h-screen sticky top-0">
                <Sidebar />
            </aside>

            <main className="flex-1 space-y-8 p-8">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Nova Consulta</h1>
                    <p className="text-gray-500 text-sm">
                        Agende uma nova consulta para o paciente.
                    </p>
                </div>

                <div className="flex gap-3 mb-6 justify-end">
                    <button
                        onClick={handleCancel}
                        className="h-10 px-5 flex items-center justify-center gap-2 text-[#4A3F39] rounded-lg font-normal text-sm shadow-md transition-all duration-300 hover:bg-gray-300 hover:shadow-lg active:scale-[0.97] bg-gray-200"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        className="h-10 px-5 flex items-center justify-center gap-2 bg-[#9F6C4D] text-white rounded-lg font-normal text-sm shadow-md transition-all duration-300 hover:bg-[#875B3F] hover:shadow-lg active:scale-[0.97]"
                    >
                        Salvar
                    </button>
                </div>

                <div className={blockClass}>
                    <p className={sectionTitle}>Informações Básicas</p>
                    <hr className="border-gray-300" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                        <div className="flex flex-col">
                             <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Paciente: *
              </label>
                            <select
                                className={`${inputClass} w-full h-12 py-2 appearance-none ${errors.paciente ? "border-red-500" : "border-gray-200"}`}
                                value={pacienteId}
                                onChange={(e) => setPacienteId(e.target.value)}
                            >
                                <option value=""></option>
                                {pacientes.map((p) => (
                                    <option key={p.id_paciente} value={p.id_paciente}>
                                        {p.nome}
                                    </option>
                                ))}
                            </select></div>
                        </div>

                        <div className="flex flex-col">
                             <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Data: *
              </label>
                            <input
                                type="date"
                                className={`${inputClass} ${errors.dataConsulta ? "border-red-500" : "border-gray-200"} h-12`}
                                value={dataConsulta}
                                onChange={(e) => setDataConsulta(e.target.value)}
                            /></div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Hora de Início: *</label>
                            <input
                                type="time"
                                className={`${inputClass} ${errors.horaConsulta ? "border-red-500" : "border-gray-200"} h-12`}
                                value={horaConsulta}
                                onChange={(e) => setHoraConsulta(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Duração (HH:mm): *</label>
                            <input
                                type="time"
                                className={`${inputClass} ${errors.duracao ? "border-red-500" : "border-gray-200"} h-12`}
                                value={duracao}
                                onChange={(e) => setDuracao(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
 <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Tipo:
              </label>
                            <select
                                className={`
    ${inputClass}
    w-full py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="">Selecione o Tipo</option>
                                <option value="presencial">Presencial</option>
                                <option value="online">Online</option>
                            </select></div>
                        </div>
                    </div>
                </div>

                <div className={blockClass}>
                    <p className={sectionTitle}>Detalhes</p>
                    <hr className="border-gray-300" />

                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Descrição: </label>
                            <textarea
                                className={`
  ${inputClass}
  w-full pr-9
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`} value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Orientação / Conduta: </label>
                            <textarea
                                className={`
  ${inputClass}
  w-full pr-9
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`} value={orientacao}
                                onChange={(e) => setOrientacao(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
