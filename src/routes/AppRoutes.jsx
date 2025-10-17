import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Pacientes from "../pages/Pacientes";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Páginas privadas */}
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
       
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
