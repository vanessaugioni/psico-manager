import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";
import Slider from "react-slick"; 
import banner from "../assets/banner.png";
import feedback1 from "../assets/feedback1.png"; 
import feedback2 from "../assets/feedback2.png";
import feedback3 from "../assets/feedback3.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function LandingPage() {
  const feedbacks = [feedback1, feedback2, feedback3];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#9F6C4D] text-white overflow-x-hidden">

      <header className="flex justify-between items-center px-8 py-4 shadow-md w-full">
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <Instagram size={20} />
          </a>
          <a
            href="mailto:contato@luanafeliciano.com"
            className="hover:text-gray-300 transition"
          >
            <Mail size={20} />
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#sobre" className="hover:text-gray-200 transition">Sobre</a>
            <a href="#consultas" className="hover:text-gray-200 transition">Consultas</a>
            <a href="#feedbacks" className="hover:text-gray-200 transition">Feedbacks</a>
            <a href="#contato" className="hover:text-gray-200 transition">Contato</a>
          </nav>
          <Link
            to="/login"
            className="bg-white w-full hover:bg-[#8b5f44] text-[#9F6C4D] p-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            Login
          </Link>
        </div>
      </header>

    
      <section className="flex flex-col justify-center items-center text-center px-6 py-12 bg-[#9F6C4D]">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bem-estar com Luana
        </h2>
        <p className="max-w-2xl text-base md:text-lg text-gray-100 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      </section>

      <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <img
          src={banner}
          alt="Luana Feliciano"
          className="w-screen h-auto object-cover block"
        />
      </section>


      <section id="sobre" className="px-6 py-12 text-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Sobre Mim</h3>
        <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-100">
          Olá! Eu sou Luana Feliciano, psicóloga clínica com CRP 12/13402. 
          Tenho experiência em ajudar pessoas a encontrarem equilíbrio emocional, 
          enfrentarem desafios e alcançarem bem-estar em suas vidas.
        </p>
      </section>

      <section id="consultas" className="px-6 py-12 text-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Consultas</h3>
        <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-100 mb-6">
          Ofereço consultas presenciais e online, com horários flexíveis e 
          acompanhamento personalizado. Meu objetivo é criar um ambiente acolhedor e seguro.
        </p>
        <Link
          to="/agendamento"
          className="bg-white text-[#8C5F44] p-3 rounded-lg font-medium hover:bg-[#A77B5B] transition-colors"
        >
          Agendar Consulta
        </Link>
      </section>

       <section id="contato" className="px-6 py-12 text-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Contato e Parcerias</h3>
        <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-100">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      </section>

     
      <section id="feedbacks" className="px-6 py-12 text-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-8">Feedbacks</h3>
        <div className="max-w-3xl mx-auto">
          <Slider {...sliderSettings}>
            {feedbacks.map((img, idx) => (
              <div key={idx}>
                <img src={img} alt={`Feedback ${idx + 1}`} className="mx-auto rounded-lg shadow-md"/>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-200 py-4 border-t border-gray-300/20 bg-[#8C5F44] w-full">
        © {new Date().getFullYear()} Luana Feliciano • Todos os direitos reservados
      </footer>
    </div>
  );
}
