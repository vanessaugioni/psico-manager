import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f8f8] text-gray-800 px-6">
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center text-center max-w-lg w-full">
        <h1 className="text-7xl md:text-8xl font-extrabold text-[#4D7CFC] mb-4">
          404
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Oops! A página que você está procurando não foi encontrada.
        </p>

        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-[#4D7CFC] text-white font-medium shadow-md hover:bg-[#3c6ae0] transition-colors"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
}
