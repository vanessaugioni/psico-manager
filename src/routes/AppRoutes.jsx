import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Pacientes from "../pages/pacientes/PacientesList";
import PacienteEdit from "../pages/pacientes/PacienteEdit";
import PacienteForm from "../pages/pacientes/PacienteForm";
import ProntuariosList from "../pages/prontuarios/ProntuariosList";
import ProntuarioForm from "../pages/prontuarios/ProntuarioForm";
import ProntuarioEdit from "../pages/prontuarios/ProntuarioEdit";
import ConsultasList from "../pages/consultas/ConsultasList";
import ConsultaForm from "../pages/consultas/ConsultaForm";
import ConsultaEdit from "../pages/consultas/ConsultaEdit";
import ConfiguracaoEdit from "../pages/Configuracao";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* PACIENTES */}
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <Pacientes />
            </PrivateRoute>
          }
        />

        <Route
          path="/paciente/edit/:id"
          element={
            <PrivateRoute>
              <PacienteEdit />
            </PrivateRoute>
          }
        />

        <Route
          path="/paciente/novo"
          element={
            <PrivateRoute>
              <PacienteForm />
            </PrivateRoute>
          }
        />

        {/* PRONTUÁRIOS */}
        <Route
          path="/prontuarios"
          element={
            <PrivateRoute>
              <ProntuariosList />
            </PrivateRoute>
          }
        />

        <Route
          path="/prontuario/novo"
          element={
            <PrivateRoute>
              <ProntuarioForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/prontuario/edit/:id"
          element={
            <PrivateRoute>
              <ProntuarioEdit />
            </PrivateRoute>
          }
        />

        {/* CONSULTAS */}
        <Route
          path="/consultas"
          element={
            <PrivateRoute>
              <ConsultasList />
            </PrivateRoute>
          }
        />

        <Route
          path="/consultas/edit/:id"
          element={
            <PrivateRoute>
              <ConsultaEdit />
            </PrivateRoute>
          }
        />

        <Route
          path="/consultas/nova"
          element={
            <PrivateRoute>
              <ConsultaForm />
            </PrivateRoute>
          }
        />

        {/* CONFIGURAÇÕES */}
        <Route
          path="/configuracoes"
          element={
            <PrivateRoute>
              <ConfiguracaoEdit />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
