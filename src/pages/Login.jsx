import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ArrowLeft } from "lucide-react"; // import da seta
import "react-toastify/dist/ReactToastify.css";
import capa from "../assets/capa.jpeg";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

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
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#9F6C4D] transition-colors"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F6C4D] transition"
                placeholder="Usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F6C4D] transition"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-[#9F6C4D] hover:bg-[#8b5f44] text-white p-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              Entrar
            </button>

            <p className="text-center text-sm text-gray-500">
              Esqueceu sua senha?{" "}
              <a href="#" className="text-[#9F6C4D] hover:underline">
                Recuperar acesso
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
