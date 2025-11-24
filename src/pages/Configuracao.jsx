import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

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


  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*")
        .single();

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
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, foto);

    if (error) {
      toast.error("Erro ao enviar foto.");
      return fotoPreview;
    }

    const url = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName).data.publicUrl;

    return url;
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
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações</h1>

 
        <div className="bg-white p-6 rounded-2xl shadow-md border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Perfil da Psicóloga
          </h2>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">Foto da psicóloga:</p>

            {fotoPreview && (
              <img
                src={fotoPreview}
                alt="Foto"
                className="w-24 h-24 rounded-full mb-3 object-cover border"
              />
            )}

            <input
              type="file"
              onChange={(e) => {
                setFoto(e.target.files[0]);
                setFotoPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>

          <label className="text-gray-600">Nome:</label>
          <input
            className="w-full p-2 mb-3 border rounded"
            value={nomePsicologa}
            onChange={(e) => setNomePsicologa(e.target.value)}
          />

          <label className="text-gray-600">Email para notificações:</label>
          <input
            className="w-full p-2 mb-3 border rounded"
            value={emailNotificacao}
            onChange={(e) => setEmailNotificacao(e.target.value)}
          />

          <button
            onClick={salvar}
            disabled={loading}
            className="bg-[#9F6C4D] text-white px-4 py-2 rounded-lg mt-3"
          >
            {loading ? "Salvando..." : "Salvar perfil"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Atualizar Login
          </h2>

          <label className="text-gray-600">Novo email:</label>
          <input
            className="w-full p-2 mb-3 border rounded"
            value={novoEmailLogin}
            onChange={(e) => setNovoEmailLogin(e.target.value)}
          />

          <label className="text-gray-600">Nova senha:</label>
          <input
            type="password"
            className="w-full p-2 mb-3 border rounded"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />

          <button
            onClick={atualizarLogin}
            className="bg-[#9F6C4D] text-white px-4 py-2 rounded-lg mt-1"
          >
            Atualizar login
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Configurações do Sistema
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-600">Início expediente:</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={inicioExpediente}
                onChange={(e) => setInicioExpediente(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600">Fim expediente:</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={fimExpediente}
                onChange={(e) => setFimExpediente(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={avisarPorEmail}
                onChange={(e) => setAvisarPorEmail(e.target.checked)}
              />
              Avisar por e-mail sobre novas consultas
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lembrete24h}
                onChange={(e) => setLembrete24h(e.target.checked)}
              />
              Enviar lembrete 24h antes
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lembrete1h}
                onChange={(e) => setLembrete1h(e.target.checked)}
              />
              Enviar lembrete 1h antes
            </label>
          </div>

          <button
            onClick={salvar}
            className="bg-[#9F6C4D] text-white px-4 py-2 rounded-lg"
          >
            Salvar configurações
          </button>
        </div>
      </div>
    </div>
  );
}
