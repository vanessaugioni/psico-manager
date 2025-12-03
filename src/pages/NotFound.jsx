import { Link } from "react-router-dom";
import foto404 from "../assets/page_error.png";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] text-gray-800 px-6">
      
      <div
        className="
         rounded-3xl 
          p-10 md:p-14 
          flex flex-col items-center text-center 
          w-full 
          max-w-lg md:max-w-xl   
          gap-8
        "
      >
        
        <img
          src={foto404}
          alt="Luana Feliciano"
          className="
            w-4/5           
            md:w-3/4 
            h-auto 
            object-contain
          "
          loading="eager"
        />

        <Link
          to="/dashboard"
          className="
            px-8 py-3 
            rounded-lg 
            bg-[#9F6C4D] text-white 
            font-semibold 
            shadow-md 
            hover:bg-[#8b5f44] 
            transition-colors duration-300
          "
        >
          Voltar para a Página Inicial
        </Link>

      </div>
    </div>
  );
}
