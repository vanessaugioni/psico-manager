import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { User, FileText, Calendar } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [pacientesCount, setPacientesCount] = useState(0);
  const [prontuariosCount, setProntuariosCount] = useState(0);
  const [consultasAgendadasCount, setConsultasAgendadasCount] = useState(0);
  const [consultasPorMes, setConsultasPorMes] = useState([]);
  const [faixaEtariaData, setFaixaEtariaData] = useState([]);

  const colors = ["#9F6C4D", "#C89F7A", "#E3C7A8", "#6B4F3A"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { count: pacientes } = await supabase
        .from("pacientes")
        .select("id_paciente", { count: "exact", head: true });

      setPacientesCount(pacientes || 0);


      const { count: prontuarios } = await supabase
        .from("prontuarios")
        .select("id", { count: "exact", head: true });

      setProntuariosCount(prontuarios || 0);


      const today = new Date().toISOString().split("T")[0];

      const { count: consultasAgendadas } = await supabase
        .from("consultas")
        .select("id", { count: "exact", head: true })
        .gte("data_consulta", today);

      setConsultasAgendadasCount(consultasAgendadas || 0);

      const { data: consultas } = await supabase
        .from("consultas")
        .select("id, data_consulta")
        .order("data_consulta", { ascending: true });

      const mesesMap = {};
      const meses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ];

      if (consultas) {
        consultas.forEach((c) => {
          const d = new Date(c.data_consulta);
          const chave = `${meses[d.getMonth()]}-${d.getFullYear()}`;

          mesesMap[chave] = (mesesMap[chave] || 0) + 1;
        });
      }

      setConsultasPorMes(
        Object.entries(mesesMap).map(([month, consultas]) => ({
          month,
          consultas,
        }))
      );

      const { data: pacientesData } = await supabase
        .from("pacientes")
        .select("id_paciente, data_nascimento");

      const faixaMap = {
        "Criança (0-12)": 0,
        "Adolescente (13-17)": 0,
        "Jovem (18-29)": 0,
        "Adulto (30-59)": 0,
        "Idoso (60+)": 0,
      };

      if (pacientesData) {
        pacientesData.forEach((p) => {
          if (!p.data_nascimento) return;

          const nascimento = new Date(p.data_nascimento);
          const hoje = new Date();
          let idade = hoje.getFullYear() - nascimento.getFullYear();

          const fezAniversario =
            hoje.getMonth() > nascimento.getMonth() ||
            (hoje.getMonth() === nascimento.getMonth() &&
              hoje.getDate() >= nascimento.getDate());

          if (!fezAniversario) idade--;

          if (idade <= 12) faixaMap["Criança (0-12)"]++;
          else if (idade <= 17) faixaMap["Adolescente (13-17)"]++;
          else if (idade <= 29) faixaMap["Jovem (18-29)"]++;
          else if (idade <= 59) faixaMap["Adulto (30-59)"]++;
          else faixaMap["Idoso (60+)"]++;
        });
      }

      setFaixaEtariaData(
        Object.entries(faixaMap).map(([name, value]) => ({ name, value }))
      );
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <Sidebar />

      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Visão geral do sistema e estatísticas importantes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#9F6C4D] text-white rounded-xl">
              <User size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pacientes cadastrados</p>
              <p className="text-2xl font-bold">{pacientesCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#9F6C4D] text-white rounded-xl">
              <FileText size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantidade de prontuários</p>
              <p className="text-2xl font-bold">{prontuariosCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#9F6C4D] text-white rounded-xl">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultas agendadas</p>
              <p className="text-2xl font-bold">{consultasAgendadasCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Consultas por mês
            </h2>

            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={consultasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="consultas"
                    stroke="#9F6C4D"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Pacientes por faixa etária
            </h2>

            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={faixaEtariaData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >
                    {faixaEtariaData.map((entry, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
