import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 } from "lucide-react";

export default function ConsultaEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [horaConsulta, setHoraConsulta] = useState("");
  const [duracao, setDuracao] = useState("");
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
  const blockClass =
    "bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4";
  const sectionTitle = "text-lg font-semibold text-gray-800 mb-1";

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // FETCH PACIENTES
  useEffect(() => {
    const fetchPacientes = async () => {
      const { data } = await supabase
        .from("pacientes")
        .select("id_paciente, nome")
        .order("nome", { ascending: true });

      setPacientes(data || []);
    };

    fetchPacientes();
  }, []);

  // FETCH CONSULTA
  useEffect(() => {
    const fetchConsulta = async () => {
      const { data, error } = await supabase
        .from("consultas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Não foi possível carregar os dados da consulta");
        return;
      }

      setPacienteId(data.id_paciente);
      setDataConsulta(data.data_consulta);
      setHoraConsulta(data.hora_consulta);
      setDuracao(data.duracao_horas.slice(0, 5));
      setTipo(data.tipo);
      setDescricao(data.descricao);
      setOrientacao(data.orientacao);
    };

    fetchConsulta();
  }, [id]);

  // EXCLUIR CONSULTA
  const deletarConsulta = async () => {
    const { error } = await supabase
      .from("consultas")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir consulta!");
      return;
    }

    toast.success("Consulta excluída com sucesso!");
    setTimeout(() => navigate("/consultas"), 1200);
  };


  const handleSave = async (e) => {
    e.preventDefault();

    const newErrors = {
      paciente: !pacienteId,
      dataConsulta: !dataConsulta,
      horaConsulta: !horaConsulta,
      duracao: !duracao,
      tipo: !tipo,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Preencha corretamente todos os campos obrigatórios!");
      return;
    }

    const duracaoEnviar = duracao.length === 5 ? duracao + ":00" : duracao;

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
      toast.error("Erro ao atualizar a consulta!");
      return;
    }

    toast.success("Consulta atualizada com sucesso!");
    setTimeout(() => navigate("/consultas"), 1500);
  };

  const handleCancel = () => navigate("/consultas");

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Excluir consulta?
        </h2>

        <p className="text-gray-600 mb-6">Essa ação não pode ser desfeita.</p>

        <div className="flex justify-between gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 h-10 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            Cancelar
          </button>

          <button
            onClick={deletarConsulta}
            className="flex-1 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <ToastContainer />

      <aside className="w-20 sm:w-64 h-screen sticky top-0">
        <Sidebar />
      </aside>

      <main className="flex-1 space-y-8 p-8">
        {/* TITULO */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Editar Consulta</h1>
          <p className="text-gray-500 text-sm">Atualize as informações da consulta.</p>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 mb-6 justify-end">
          <button
            onClick={handleCancel}
            className="h-10 px-5 bg-gray-200 text-[#4A3F39] rounded-lg text-sm shadow-md hover:bg-gray-300 active:scale-95"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="h-10 px-5 bg-[#9F6C4D] text-white rounded-lg text-sm shadow-md hover:bg-[#875B3F] active:scale-95"
          >
            Salvar
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="h-10 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 active:scale-95"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* BLOCO 1 */}
        <div className={blockClass}>
          <p className={sectionTitle}>Informações Básicas</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

            {/* PACIENTE */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Paciente: *</label>
              <select
                className={`${inputClass} h-12 ${errors.paciente ? "border-red-500" : "border-gray-200"}`}
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

            {/* DATA */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Data: * </label>
              <input
                type="date"
                className={`${inputClass} h-12 ${errors.dataConsulta ? "border-red-500" : "border-gray-200"}`}
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
            </div>

            {/* HORA */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Hora Inicial: *</label>
              <input
                type="time"
                className={`${inputClass} h-12 ${errors.horaConsulta ? "border-red-500" : "border-gray-200"}`}
                value={horaConsulta}
                onChange={(e) => setHoraConsulta(e.target.value)}
              />
            </div>

            {/* DURAÇÃO */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Duração: *</label>
              <input
                type="time"
                className={`${inputClass} h-12 ${errors.duracao ? "border-red-500" : "border-gray-200"}`}
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
              />
            </div>

            {/* TIPO */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Tipo: *</label>
              <select
                className={`
    ${inputClass}
    w-full py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `} value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value=""></option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
        </div>

        {/* BLOCO 2 */}
        <div className={blockClass}>
          <p className={sectionTitle}>Detalhes</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 gap-4 mt-4">

            {/* DESCRIÇÃO */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Descrição: </label>
              <textarea
                className={`
  ${inputClass}
  w-full pr-9
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            {/* ORIENTAÇÃO */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Orientação / Conduta: </label>
              <textarea
                className={`
  ${inputClass}
  w-full pr-9
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                value={orientacao}
                onChange={(e) => setOrientacao(e.target.value)}
              />
            </div>

          </div>
        </div>

        {showDeleteModal && <DeleteModal />}
      </main>
    </div>
  );
}
