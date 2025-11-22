import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] text-gray-800 px-6">
      <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center text-center max-w-md w-full">
        <h1 className="text-8xl font-extrabold text-[#9F6C4D] mb-4 tracking-wide">
          404
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Oops! A página que você está procurando não foi encontrada.
        </p>

        <Link
          to="/dashboard"
          className="px-8 py-3 rounded-lg bg-[#9F6C4D] text-white font-semibold shadow-md hover:bg-[#8b5f44] transition-colors duration-300"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}
