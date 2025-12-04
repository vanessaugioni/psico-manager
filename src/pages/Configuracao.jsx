import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ConfiguracaoEdit() {
  const [loading, setLoading] = useState(false);

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [nomePsicologa, setNomePsicologa] = useState("");
  const [emailNotificacao, setEmailNotificacao] = useState("");

  const [novoEmailLogin, setNovoEmailLogin] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [inicioExpediente, setInicioExpediente] = useState("08:00");
  const [fimExpediente, setFimExpediente] = useState("18:00");

  const [avisarPorEmail, setAvisarPorEmail] = useState(false);
  const [lembrete24h, setLembrete24h] = useState(false);
  const [lembrete1h, setLembrete1h] = useState(false);

  const inputClass =
    "w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40 text-sm bg-white transition-all duration-200";

  const blockClass =
    "bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6";

  const sectionTitle = "text-lg font-semibold text-gray-800";

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase.from("configuracoes").select("*").single();

      if (data) {
        setNomePsicologa(data.nome_psicologa || "");
        setEmailNotificacao(data.email_notificacao || "");
        setInicioExpediente(data.inicio_expediente || "08:00");
        setFimExpediente(data.fim_expediente || "18:00");
        setAvisarPorEmail(data.avisar_email || false);
        setLembrete24h(data.lembrete_24h || false);
        setLembrete1h(data.lembrete_1h || false);
        setFotoPreview(data.foto_url || null);
      }
    }
    fetchConfig();
  }, []);

  async function uploadFoto() {
    if (!foto) return fotoPreview;

    const fileName = `psicologa_${Date.now()}`;
    const { error } = await supabase.storage.from("avatars").upload(fileName, foto);

    if (error) {
      toast.error("Erro ao enviar foto.");
      return fotoPreview;
    }

    return supabase.storage.from("avatars").getPublicUrl(fileName).data.publicUrl;
  }

  async function salvar() {
    setLoading(true);

    const fotoUrl = await uploadFoto();

    const { error } = await supabase.from("configuracoes").upsert(
      {
        id: 1,
        nome_psicologa: nomePsicologa,
        email_notificacao: emailNotificacao,
        inicio_expediente: inicioExpediente,
        fim_expediente: fimExpediente,
        avisar_email: avisarPorEmail,
        lembrete_24h: lembrete24h,
        lembrete_1h: lembrete1h,
        foto_url: fotoUrl,
      },
      { onConflict: "id" }
    );

    if (!error) toast.success("Configurações atualizadas!");
    else toast.error("Erro ao salvar.");

    setLoading(false);
  }

  async function atualizarLogin() {
    if (novoEmailLogin) {
      const { error } = await supabase.auth.updateUser({ email: novoEmailLogin });
      if (error) return toast.error("Erro ao atualizar email.");
    }

    if (novaSenha) {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) return toast.error("Erro ao atualizar senha.");
    }

    toast.success("Login atualizado!");
  }

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <ToastContainer />

      <aside className="w-20 sm:w-64 h-screen sticky top-0">
        <Sidebar />
      </aside>

      <main className="flex-1 space-y-8 p-8">
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Configurações</h1>
          <p className="text-gray-500 text-sm">
            Personalize informações, horários e preferências da plataforma.
          </p>
        </header>

        {/* BOTÕES SUPERIORES */}
        <div className="flex gap-3 mb-6 justify-end">
          <button
            onClick={() => window.history.back()}
            className="
              h-10 px-5 flex items-center justify-center gap-2
              text-[#4A3F39] bg-gray-200 rounded-lg shadow-md
              transition-all duration-300 font-normal text-sm
              hover:bg-gray-300 hover:shadow-lg active:scale-[0.97]
            "
          >
            Cancelar
          </button>

          <button
            onClick={salvar}
            className="
              h-10 px-5 flex items-center justify-center gap-2
              bg-[#9F6C4D] text-white rounded-lg shadow-md
              font-normal text-sm transition-all duration-300
              hover:bg-[#875B3F] hover:shadow-lg active:scale-[0.97]
            "
          >
            Salvar
          </button>
        </div>

        <section className={blockClass}>
          <p className={sectionTitle}>Perfil da Psicóloga</p>
          <hr className="border-gray-300" />

          {/* <div className="flex items-center gap-6">
            {fotoPreview ? (
              <img
                src={fotoPreview}
                alt="Foto"
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border">
                <span className="text-gray-400 text-sm">Sem foto</span>
              </div>
            )}

            <div className="flex-1">
              <label className="text-sm text-gray-700 mb-1 block">Foto da Psicóloga</label>
              <input
                type="file"
                className="text-sm"
                onChange={(e) => {
                  setFoto(e.target.files[0]);
                  setFotoPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </div>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Nome</label>
              <input
                className={inputClass}
                value={nomePsicologa}
                onChange={(e) => setNomePsicologa(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Email de Notificação</label>
              <input
                className={inputClass}
                value={emailNotificacao}
                onChange={(e) => setEmailNotificacao(e.target.value)}
              />
            </div>
          </div>

          <p className={sectionTitle + " pt-4"}>Dados de Login</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Novo Email</label>
              <input
                className={inputClass}
                value={novoEmailLogin}
                onChange={(e) => setNovoEmailLogin(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Nova Senha</label>
              <input
                type="password"
                className={inputClass}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>

          
          </div>

          <p className={sectionTitle + " pt-4"}>Horários e Avisos</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Início do Expediente</label>
              <input
                type="time"
                className={inputClass}
                value={inicioExpediente}
                onChange={(e) => setInicioExpediente(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Fim do Expediente</label>
              <input
                type="time"
                className={inputClass}
                value={fimExpediente}
                onChange={(e) => setFimExpediente(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 col-span-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={avisarPorEmail}
                onChange={(e) => setAvisarPorEmail(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Avisar por email sobre novas consultas
            </label>

            <label className="flex items-center gap-3 col-span-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lembrete24h}
                onChange={(e) => setLembrete24h(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Enviar lembrete 24 horas antes
            </label>

            <label className="flex items-center gap-3 col-span-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lembrete1h}
                onChange={(e) => setLembrete1h(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Enviar lembrete 1 hora antes
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
