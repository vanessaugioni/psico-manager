import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import capa from "../assets/capa.jpeg";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "admin" && password === "teste123") {
      toast.success("Login realizado com sucesso!", { autoClose: 2000 });
      localStorage.setItem("user", user);
      setTimeout(() => navigate("/dashboard"), 2100);
    } else {
      toast.error("Usuário ou senha incorretos", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!resetEmail.includes("@")) {
      toast.error("Digite um e-mail válido.");
      return;
    }

    toast.success("Se existir uma conta com esse e-mail, enviaremos um link de redefinição.");
    setShowResetModal(false);
    setResetEmail("");
  };

  return (
    <>
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl space-y-4">

            <h3 className="text-xl font-semibold text-center">Recuperar senha</h3>
            <p className="text-sm text-gray-600 text-center">
              Informe seu e-mail para receber instruções de redefinição.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9F6C4D]"
                type="email"
                placeholder="Digite seu e-mail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-[#9F6C4D] text-white p-3 rounded-lg hover:bg-[#8b5f44] transition"
              >
                Enviar link
              </button>
            </form>

            <button
              onClick={() => setShowResetModal(false)}
              className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-sm mt-2 p-2 rounded-lg transition"
            >
              Cancelar
            </button>


          </div>
        </div>
      )}

      <ToastContainer />

      <div className="min-h-screen flex flex-col md:flex-row bg-white text-gray-800 relative">
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${capa})` }}
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center"></div>
        </div>

        <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-12 relative">

          <Link
            to="/"
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#9F6C4D]"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm">Voltar</span>
          </Link>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">PsicoManager</h2>
              <p className="text-gray-500 text-sm">
                Acesse sua conta para continuar
              </p>
            </div>

            <div className="space-y-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9F6C4D]"
                placeholder="Usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9F6C4D]"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full bg-[#9F6C4D] hover:bg-[#8b5f44] text-white p-3 rounded-lg">
              Entrar
            </button>

            <p className="text-center text-sm text-gray-500">
              Esqueceu sua senha?{" "}
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[#9F6C4D] hover:underline"
              >
                Recuperar acesso
              </button>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}
