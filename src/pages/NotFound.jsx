import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#9F6C4D] text-white text-center px-6">
      <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
      <p className="text-2xl md:text-3xl mb-6">Página não encontrada</p>
      <Link
        to="/"
        className="bg-white text-[#9F6C4D] px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-[#8b5f44] hover:text-white transition-colors"
      >
        Voltar para a Home
      </Link>
    </div>
  );
}
