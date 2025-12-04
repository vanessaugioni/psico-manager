import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../lib/supabaseClient";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/daygrid";
import "@fullcalendar/timegrid";

export default function ConsultasList() {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  const fetchData = async () => {
    const [{ data: consultasData }, { data: pacientesData }] = await Promise.all([
      supabase.from("consultas").select("*"),
      supabase.from("pacientes").select("id_paciente, nome"),
    ]);

    setConsultas(consultasData || []);
    setPacientes(pacientesData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPacienteNome = (id) =>
    pacientes.find((p) => p.id_paciente === id)?.nome || "Paciente";

  const eventos = consultas.map((c) => ({
    id: c.id,
    title: getPacienteNome(c.id_paciente),
    start: `${c.data_consulta}T${c.hora_consulta}`,
    end: calcularFim(c.data_consulta, c.hora_consulta, c.duracao_horas),
    backgroundColor: "#9F6C4D",
    borderColor: "#9F6C4D",
    textColor: "#fff",
  }));

  function calcularFim(data, hora, duracao) {
    if (!duracao) return `${data}T${hora}`;
    const dt = new Date(`${data}T${hora}`);
    const [h, m] = duracao.split(":").map(Number);
    dt.setHours(dt.getHours() + h);
    dt.setMinutes(dt.getMinutes() + m);
    return dt.toISOString();
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">

      {/* ⭐ SIDEBAR RESPONSIVA PADRONIZADA */}
      <aside className="w-20 sm:w-64 h-screen sticky top-0 border-r border-gray-200 bg-white z-40 shadow-sm">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Agenda de Consultas
          </h1>
          <p className="text-gray-500 text-sm">
            Visualize e gerencie suas consultas.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">

          <style>{`
            .fc {
              font-family: Inter, sans-serif !important;
              color: #444 !important;
            }
            .fc-toolbar-title {
              font-size: 1.4rem !important;
              font-weight: 600 !important;
              color: #2d2d2d !important;
            }
            .fc-button {
              background: #ffffff !important;
              border: 1px solid #d1d5db !important;
              color: #4b5563 !important;
              border-radius: 8px !important;
              padding: 6px 14px !important;
              font-weight: 500;
              transition: all 0.2s;
            }
            .fc-button:hover {
              background: #f3f3f3 !important;
            }
            .fc-button-active {
              background: #9F6C4D !important;
              border-color: #9F6C4D !important;
              color: white !important;
              font-weight: 600 !important;
            }
            .fc-button-group, .fc-toolbar-chunk {
              display: flex;
              gap: 6px !important;
            }
            .fc-col-header-cell {
              background: #fafafa !important;
              font-weight: 600;
              color: #555 !important;
            }
            .fc-event {
              padding: 4px 6px !important;
              border-radius: 8px !important;
              font-size: 0.85rem !important;
            }
            .fc-day-today {
              background: #f7ebe4 !important;
              position: relative;
            }
            .fc-day-today::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 3px;
              background: #9F6C4D;
            }
          `}</style>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            height="80vh"
            events={eventos}
            eventClick={(info) => navigate(`/consulta/edit/${info.event.id}`)}
            dateClick={(info) => navigate(`/consultaForm?data=${info.dateStr}`)}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
          />
        </div>
      </main>
    </div>
  );
}
