import { useState } from "react";
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
import userPhoto from "../assets/userPhoto.png"; // ajuste a extensão correta

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Pacientes", icon: <Users size={18} />, path: "/pacientes" },
    { name: "Prontuários", icon: <FileText size={18} />, path: "/prontuarios" },
    { name: "Consultas", icon: <Calendar size={18} />, path: "/consultas" },
    { name: "Configurações", icon: <Settings size={18} />, path: "/configuracoes" },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white text-[#2A2343] min-h-screen flex flex-col justify-between shadow-md transition-all duration-300`}
    >
      {/* Cabeçalho */}
      <div>
        <div
          className={`flex items-center justify-between px-4 py-4 ${
            !isOpen && "flex-col justify-center"
          }`}
        >
          {isOpen ? (
            <div className="flex items-center gap-3">
              <img
                src={userPhoto}
                alt="Usuário"
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex flex-col">
                <h2 className="font-semibold text-lg text-[#2A2343]">Luana Feliciano</h2>
                <span className="text-sm text-gray-500">Psicóloga</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full py-4">
              <img
                src={userPhoto}
                alt="Usuário"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#9F6C4D]"
              />
            </div>
          )}

          {/* Botão abrir/fechar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded hover:bg-gray-100 transition-colors mt-2"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 mt-4 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-[#9F6C4D] text-white font-medium shadow"
                    : "text-[#2A2343] hover:bg-[#F5F2F7] hover:text-[#9F6C4D] font-normal"
                } ${isOpen ? "justify-start" : "justify-center"}`}
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign Out */}
      <div className="p-4">
        <Link
          to="/login"
          onClick={() => localStorage.removeItem("user")}
          className="flex items-center gap-2 bg-[#9F6C4D] text-white py-2 rounded-lg font-medium shadow hover:bg-[#8C5F44] transition-colors duration-300 justify-center"
        >
          <LogOut size={18} />
          {isOpen && <span>Sign Out</span>}
        </Link>
      </div>
    </div>
  );
}
