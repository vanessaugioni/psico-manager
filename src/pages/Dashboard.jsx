import Sidebar from "../components/Sidebar";
import {
  User,
  Calendar,
  MessageCircle,
  CheckCircle2
} from "lucide-react";

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
  Cell
} from "recharts";

export default function Dashboard() {
  const lineData = [
    { month: "Jan", consultas: 22 },
    { month: "Fev", consultas: 30 },
    { month: "Mar", consultas: 25 },
    { month: "Abr", consultas: 40 },
    { month: "Mai", consultas: 38 },
  ];

  const pieData = [
    { name: "Ansiedade", value: 40 },
    { name: "Depressão", value: 25 },
    { name: "TDAH", value: 20 },
    { name: "Outros", value: 15 },
  ];

  const colors = ["#9F6C4D", "#C89F7A", "#E3C7A8", "#6B4F3A"];

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Visão geral do sistema e estatísticas importantes.
          </p>
        </header>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* CARD 1 */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#9F6C4D] text-white rounded-xl">
              <User size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pacientes cadastrados</p>
              <p className="text-2xl font-bold">128</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#9F6C4D] text-white rounded-xl">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultas no mês</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#9F6C4D] text-white rounded-xl">
              <MessageCircle size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mensagens recebidas</p>
              <p className="text-2xl font-bold">17</p>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-[#9F6C4D] text-white rounded-xl">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultas concluídas</p>
              <p className="text-2xl font-bold">36</p>
            </div>
          </div>

        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LINE CHART */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Evolução de Consultas
            </h2>

            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
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

          {/* PIE CHART */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Distribuição de tipos de atendimento
            </h2>

            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >
                    {pieData.map((entry, i) => (
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
