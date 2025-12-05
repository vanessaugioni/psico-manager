import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsuarioEdit() {
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [atuacao, setAtuacao] = useState("");


  const [avisarPorEmail, setAvisarPorEmail] = useState(false);
  const [lembrete24h, setLembrete24h] = useState(false);
  const [lembrete1h, setLembrete1h] = useState(false);

  const inputClass =
    "w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40 text-sm bg-white transition-all duration-200";

  const blockClass =
    "bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6";

  const sectionTitle = "text-lg font-semibold text-gray-800";

  useEffect(() => {
    carregarAdmin();
  }, []);

  async function carregarAdmin() {
    const { data, error } = await supabase
      .from("configuracoes")
      .select("*")
      .eq("id", 1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.log(error);
      toast.error("Erro ao carregar dados.");
      return;
    }

    // Se registro não existe → criar automaticamente
    if (!data) {
      await supabase
        .from("configuracoes")
        .insert({ id: 1, nome: "Admin", usuario: "admin", senha: "hash" });

      return carregarAdmin(); // puxa novamente
    }

    setNome(data.nome);
    setEmail(data.email);
    setUsuario(data.usuario);
    setAtuacao(data.atuacao);
    setAvisarPorEmail(data.avisar_por_email);
    setLembrete24h(data.lembrete_24h);
    setLembrete1h(data.lembrete_1h);
  }

  async function salvar() {
    setLoading(true);

    const { error } = await supabase
      .from("configuracoes")
      .update({
        nome,
        email,
        usuario,
        senha,
        atuacao,
        avisar_por_email: avisarPorEmail,
        lembrete_1h: lembrete1h,
        lembrete_24h: lembrete24h,
      })
      .eq("id", 1);

    if (error) {
      toast.error("Erro ao salvar.");
      console.log(error);
    } else {
      toast.success("Configurações atualizadas!");
    }

    setLoading(false);
  }

  async function atualizarLogin() {
    if (email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) return toast.error("Erro ao atualizar email.");
    }

    if (senha) {
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) return toast.error("Erro ao atualizar senha.");
    }

    toast.success("Dados de login atualizados!");
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
            Personalize seu perfil e preferências da plataforma.
          </p>
        </header>

        <div className="flex gap-3 mb-6 justify-end">
          <button
            onClick={() => window.history.back()}
            className="h-10 px-5 flex items-center justify-center gap-2
                       text-[#4A3F39] bg-gray-200 rounded-lg shadow-md
                       transition-all duration-300 font-normal text-sm
                       hover:bg-gray-300 hover:shadow-lg active:scale-[0.97]"
          >
            Cancelar
          </button>

          <button
            onClick={salvar}
            className="h-10 px-5 flex items-center justify-center gap-2
                       bg-[#9F6C4D] text-white rounded-lg shadow-md
                       font-normal text-sm transition-all duration-300
                       hover:bg-[#875B3F] hover:shadow-lg active:scale-[0.97]"
          >
            Salvar
          </button>
        </div>

        <section className={blockClass}>
          <p className={sectionTitle}>Dados Pessoais</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Nome</label>
              <input
className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Email</label>
              <input
className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Atuação:</label>
              <input
className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}                value={atuacao}
                onChange={(e) => setAtuacao(e.target.value)}
                placeholder="Ex: Psicóloga, Nutricionista..."
              />
            </div>


          </div>

          <p className={sectionTitle + " pt-4"}>Dados de Login</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Usuário</label>
              <input
className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Nova Senha</label>
              <input
                type="password"
className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          {/* <p className={sectionTitle + " pt-4"}>Preferências</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div> */}
        </section>
      </main>
    </div>
  );
}
