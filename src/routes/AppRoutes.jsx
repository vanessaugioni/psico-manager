import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Pacientes from "../pages/pacientes/PacientesList";
import PacienteEdit from "../pages/pacientes/PacienteEdit"; // <- aqui
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";
import PacienteForm from "../pages/pacientes/PacienteForm";

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

        <Route 
          path="/pacientes/:id" 
          element={
            <PrivateRoute>
              <PacienteEdit />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/pacientesForm" 
          element={
            <PrivateRoute>
              <PacienteForm />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
