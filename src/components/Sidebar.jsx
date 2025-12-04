import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import userPhoto from "../assets/userPhoto.png";
import { supabase } from "../lib/supabaseClient";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [atuacao, setAtuacao] = useState("");


  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Pacientes", icon: <Users size={18} />, path: "/pacientes" },
    { name: "Prontuários", icon: <FileText size={18} />, path: "/prontuarios" },
    { name: "Consultas", icon: <Calendar size={18} />, path: "/consultas" },
    { name: "Configurações", icon: <Settings size={18} />, path: "/configuracoes" },
  ];

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    const { data, error } = await supabase
      .from("configuracoes")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setNome(data.nome);
      setUsuario(data.usuario);
      setAtuacao(data.atuacao);
    }
  }

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-100 text-gray-800 min-h-screen flex flex-col justify-between transition-all duration-200 ease-in-out`}
    >
      <div>
        <div
          className={`flex items-center justify-between px-4 py-5 border-b border-gray-100 ${
            !isOpen ? "flex-col gap-3 justify-center" : ""
          }`}
        >
          <div className="flex items-center gap-3 justify-start w-full">
            <img
              src={userPhoto}
              alt="Usuário"
              className="w-12 h-12 rounded-lg object-cover shadow-md transition-all duration-200"
            />

            {isOpen && (
              <div className="flex flex-col">
                <h2 className="font-semibold text-gray-800 text-sm">
                  {nome || "Carregando..."}
                </h2>
                <span className="text-xs text-gray-500">
                  { atuacao || "Atuação"}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft size={18} className="text-gray-500" />
            ) : (
              <ChevronRight size={18} className="text-gray-500" />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1 mt-4 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ease-in-out ${
                  isActive
                    ? "bg-[#9F6C4D]/10 text-[#9F6C4D] font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#9F6C4D]"
                } ${isOpen ? "justify-start" : "justify-center"}`}
              >
                {item.icon}
                {isOpen && <span className="text-sm tracking-wide">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/login"
          onClick={() => localStorage.removeItem("user")}
          className="flex items-center gap-2 justify-center bg-[#9F6C4D] text-white text-sm font-medium px-3 py-2.5 rounded-md shadow-sm hover:bg-[#8b5f44] transition-colors duration-200"
        >
          <LogOut size={16} />
          {isOpen && <span>Sair</span>}
        </Link>
      </div>
    </aside>
  );
}
