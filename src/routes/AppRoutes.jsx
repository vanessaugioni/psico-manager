import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Pacientes from "../pages/pacientes/PacientesList";
import PacienteEdit from "../pages/pacientes/PacienteEdit"; // <- aqui
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";
import PacienteForm from "../pages/pacientes/PacienteForm";
import ProntuariosList from "../pages/prontuarios/ProntuariosList";
import ProntuarioForm from "../pages/prontuarios/ProntuarioForm";
import ProntuarioEdit from "../pages/prontuarios/ProntuarioEdit";
import ConsultasList from "../pages/consultas/ConsultasList";
import ConsultaForm from "../pages/consultas/ConsultaForm";
import ConsultaEdit from "../pages/consultas/ConsultaEdit";
import ConfiguracaoEdit from "../pages/Configuracao";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <Pacientes />
            </PrivateRoute>
          }
        />

        <Route path="/paciente/edit/:id" element={<PacienteEdit />} />

        <Route
          path="/pacienteForm"
          element={
            <PrivateRoute>
              <PacienteForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/prontuarios"
          element={
            <PrivateRoute>
              <ProntuariosList />
            </PrivateRoute>
          }
        />

        <Route
          path="/prontuarioForm"
          element={
            <PrivateRoute>
              <ProntuarioForm />
            </PrivateRoute>
          }
        />

        <Route path="/prontuario/edit/:id" element={<ProntuarioEdit />} />

        <Route
          path="/consultas"
          element={
            <PrivateRoute>
              <ConsultasList />
            </PrivateRoute>
          }
        />

        <Route path="/consulta/edit/:id" element={<ConsultaEdit />} />

        <Route
          path="/consultaForm"
          element={
            <PrivateRoute>
              <ConsultaForm />
            </PrivateRoute>
          }
        />

             <Route
          path="/configuracoes"
          element={
            <PrivateRoute>
              <ConfiguracaoEdit />
            </PrivateRoute>
          }
        />


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
