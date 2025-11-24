import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ConsultaEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [horaConsulta, setHoraConsulta] = useState("");
  const [duracaoTime, setDuracaoTime] = useState(""); 
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [orientacao, setOrientacao] = useState("");

  const [openSections, setOpenSections] = useState({
    basico: true,
    detalhes: false,
  });

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D] transition bg-white text-gray-700 placeholder-gray-400 text-sm sm:text-base";
  const textareaClass = `${inputClass} h-24 resize-none`;
  const sectionClass =
    "bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4";

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

  useEffect(() => {
    const fetchConsulta = async () => {
      const { data, error } = await supabase
        .from("consultas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao carregar consulta:", error);
        toast.error("Não foi possível carregar os dados da consulta");
        return;
      }

      setPacienteId(data.id_paciente);
      setDataConsulta(data.data_consulta);
      setHoraConsulta(data.hora_consulta);
      setDuracaoTime(data.duracao_horas.slice(0, 5)); 
      setTipo(data.tipo);
      setDescricao(data.descricao);
      setOrientacao(data.orientacao);
    };
    fetchConsulta();
  }, [id]);

  const toggleSection = (sec) => {
    setOpenSections({ ...openSections, [sec]: !openSections[sec] });
  };

  const handleSave = async (e) => {
    e.preventDefault();


    if (!pacienteId || !dataConsulta || !horaConsulta || !duracaoTime || !tipo) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(duracaoTime)) {
      toast.error("Duração inválida! Use o formato HH:MM");
      return;
    }


    const duracaoEnviar =
      duracaoTime.length === 5 ? duracaoTime + ":00" : duracaoTime;


    const { error } = await supabase
      .from("consultas")
      .update({
        id_paciente: pacienteId,
        data_consulta: dataConsulta,
        hora_consulta: horaConsulta,
        duracao_horas: duracaoEnviar,
        tipo,
        descricao,
        orientacao,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Erro ao atualizar a consulta!");
      return;
    }

    toast.success("Consulta atualizada com sucesso!");
    setTimeout(() => navigate("/consultas"), 1500);
  };

  const handleCancel = () => navigate("/consultas");

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <ToastContainer position="top-right" />
      <aside className="flex-shrink-0 w-20 sm:w-64 h-screen sticky top-0">
        <Sidebar />
      </aside>

      <main className="flex-1 p-4 sm:p-8 flex flex-col">
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Editar Consulta</h1>
          <p className="text-gray-500">
            Altere os dados da consulta do paciente.
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

                <input
                  type="date"
                  className={inputClass}
                  value={dataConsulta}
                  onChange={(e) => setDataConsulta(e.target.value)}
                />

                <input
                  type="time"
                  className={inputClass}
                  value={horaConsulta}
                  onChange={(e) => setHoraConsulta(e.target.value)}
                />

                <input
                  type="time"
                  className={inputClass}
                  value={duracaoTime}
                  onChange={(e) => setDuracaoTime(e.target.value)}
                />

                <select
                  className={inputClass}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="">Selecione o Tipo *</option>
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                </select>
              </div>
            )}
          </div>


          <div className={sectionClass}>
            <button
              type="button"
              onClick={() => toggleSection("detalhes")}
              className="w-full flex justify-between items-center mb-4 text-left text-gray-700 font-semibold"
            >
              Detalhes
              {openSections.detalhes ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSections.detalhes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <textarea
                  className={textareaClass}
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
                <textarea
                  className={textareaClass}
                  placeholder="Orientação / Conduta"
                  value={orientacao}
                  onChange={(e) => setOrientacao(e.target.value)}
                />
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
