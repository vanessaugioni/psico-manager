import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">PsicoManager</h1>
      <p className="text-lg text-blue-700 mb-6">Gerencie seus pacientes e consultas facilmente.</p>
      <Link 
        to="/login" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Login
      </Link>
    </div>
  );
}
