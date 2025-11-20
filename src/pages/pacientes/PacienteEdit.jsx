import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import PacienteForm from "./PacienteForm";

export default function PacienteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const pacientesMock = [
      { id: "1", fullName: "Ana Clara Souza", email: "ana.souza@email.com", phone: "(11) 91234-5678", birthDate: "1990-03-15" },
      { id: "2", fullName: "Bruno Lima", email: "bruno.lima@email.com", phone: "(21) 99876-5432", birthDate: "1985-07-22" },
      { id: "3", fullName: "Carla Fernandes", email: "carla.fernandes@email.com", phone: "(31) 98765-4321", birthDate: "1992-12-05" },
    ];
    const found = pacientesMock.find((p) => p.id === id);
    setPaciente(found);
  }, [id]);

  const handleSave = (updatedPaciente) => {
    console.log("Paciente atualizado:", updatedPaciente);
    navigate("/pacientes");
  };

  if (!paciente) return <p>Carregando...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Editar Paciente</h1>
        <PacienteForm pacienteData={paciente} onSave={handleSave} onCancel={() => navigate("/pacientes")} />
      </div>
    </div>
  );
}
