import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MessageCircle, MapPinned } from "lucide-react";
import Slider from "react-slick";
import banner from "../assets/banner.svg";
import logo from "../assets/logo.svg";
import feedback1 from "../assets/feedback1.png";
import feedback2 from "../assets/feedback2.png";
import fotoLuana from "../assets/luana.png";
import { Monitor } from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function LandingPage() {
  const feedbacks = [feedback1, feedback2];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#9F6C4D] text-white overflow-x-hidden font-[Inter] transition-colors duration-300 ease-in-out">

      <header className="flex justify-between items-center px-10  bg-[#8C5F44]/40 border-b border-white/20 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 relative">

        <div className="flex space-x-5">
          {/* {[
            {
              icon: Instagram,
              href: "https://www.instagram.com/psicologaluanafeliciano?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
            },
            { icon: Mail, href: "mailto:contato@luanafeliciano.com" },
          ].map(({ icon: Icon, href }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-white/10 border border-[#C8A38D]/40 rounded-full transition-all duration-300 ease-in-out"
            >
              <Icon size={22} className="text-white" />
            </a>
          ))} */}


          <img
            src={logo}
            alt="Luana Feliciano"
            className=" w-20 h-20 hover:bg-white/10 rounded-full transition-all duration-300 ease-in-out"
          />

        </div>


        <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-10 text-base font-medium">
          {[
            { href: "#sobre", label: "Sobre" },
            { href: "#consultas", label: "Consultas" },
            { href: "#feedbacks", label: "Feedbacks" },
            { href: "#contato", label: "Contato" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative group transition-colors text-white"
            >
              {item.label}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#C8A38D] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>



        <Link
          to="/login"
          className="bg-white text-[#9F6C4D] px-5 py-3 rounded-xl font-medium shadow-md border border-[#C8A38D] hover:bg-[#8C5F44] hover:text-white transition-all duration-300"
        >
          Login
        </Link>

        {/* {[
            {
              icon: Instagram,
              href: "https://www.instagram.com/psicologaluanafeliciano?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
            },
            { icon: Mail, href: "mailto:contato@luanafeliciano.com" },
          ].map(({ icon: Icon, href }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-white/10 border border-[#C8A38D]/40 rounded-full transition-all duration-300 ease-in-out"
            >
              <Icon size={22} className="text-white" />
            </a>
          ))} */}
      </header>

      <section className="w-screen relative">
        <img
          src={banner}
          alt="Luana Feliciano"
          className="w-screen h-auto object-cover block"
        />
      </section>

      <section id="consultas" className="px-6 py-24 text-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-16">


          <div className="md:w-1/2 flex flex-col gap-6">
            <h3 className="text-3xl font-semibold text-white/90 tracking-tight">
              Consultas
            </h3>
            <p className="text-base md:text-lg text-gray-200/90 leading-relaxed">
              Atendo brasileiros <span className="font-semibold text-white">em qualquer lugar do mundo</span> por meio de consultas online.
              Também realizo atendimentos presenciais, com horários flexíveis e acompanhamento personalizado.
              Minhas abordagens são baseadas em evidências científicas, incluindo Terapia Cognitivo-Comportamental (TCC), mindfulness e técnicas de regulação emocional, garantindo um atendimento ético, seguro e eficiente.
            </p>

            <div className="mt-8">
              <a
                href="https://wa.me/message/WTASCFY5D5RZM1"
                target="_blank"
                title="Abrir o WhatsApp"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#8C5F44] px-6 py-3 rounded-lg font-medium shadow-sm 
             hover:bg-green-600 hover:text-white transition-all duration-300 w-max"
              >
                <MessageCircle size={18} />
                Agendar Consulta
              </a>


            </div>
          </div>



          <div className="md:w-1/2 flex flex-col gap-6">

            <div className="flex items-start gap-4 bg-white/10 p-6 rounded-lg shadow-md hover:bg-white/20 transition-colors duration-300">
              <Monitor size={36} className="text-white/90 mt-1" />
              <div>
                <h4 className="font-semibold text-white/90 text-lg mb-1">Atendimento Online</h4>
                <p className="text-gray-200/80 text-sm">
                  Consultas por vídeo, especialmente focadas em brasileiros no exterior. Segurança, privacidade e flexibilidade de horários.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 p-6 rounded-lg shadow-md hover:bg-white/20 transition-colors duration-300">
              <MessageCircle size={36} className="text-white/90 mt-1" />
              <div>
                <h4 className="font-semibold text-white/90 text-lg mb-1">Atendimento Presencial</h4>
                <p className="text-gray-200/80 text-sm">
                  Consultas presenciais para quem busca acompanhamento direto, em um ambiente seguro, acolhedor e profissional.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="w-80 h-[2px] bg-white/80 mx-auto my-12 rounded-full"></div>

      <section
        id="sobre"
        className="px-6 py-20 md:px-16 lg:px-24 flex flex-col md:flex-row items-start justify-center gap-16 text-gray-100"
      >


        <div className="w-full md:w-1/4 flex justify-center md:justify-end">
          <div className="max-w-[14rem] md:max-w-[18rem] rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10">
            <img
              src={fotoLuana}
              alt="Luana Feliciano"
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 text-left">
          <h3 className="text-3xl font-semibold mb-5 text-gray-100 tracking-tight">
            Sobre Mim
          </h3>

          <p className="text-base md:text-lg leading-relaxed text-gray-100 max-w-2xl">
            Sou <span className="font-semibold text-gray-100">Luana Feliciano</span>, psicóloga clínica (CRP 12/13402).
            Tenho como propósito acolher pessoas em seus momentos de vulnerabilidade e acompanhá-las na construção
            de uma vida com mais equilíbrio, clareza e bem-estar emocional.

            <br /><br />

            Acredito que a terapia é um espaço seguro de escuta verdadeira, onde você pode se expressar sem
            julgamentos e encontrar novas formas de lidar com seus desafios. Meu compromisso é oferecer um
            atendimento ético, sensível e respeitoso, considerando suas necessidades, limites e história.

            <br /><br />

            Quero que você se sinta compreendido(a), amparado(a) e protagonista do seu próprio processo de mudança,
            no seu ritmo, com suporte e acolhimento a cada passo.
          </p>
        </div>

      </section>


      <div className="w-80 h-[2px] bg-white/80 mx-auto my-12 rounded-full"></div>

      <section id="contato" className="px-6 py-20 text-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">


          <div className="md:w-1/2 flex flex-col gap-6">
            <h3 className="text-3xl font-semibold text-white/90">Endereço</h3>
            <p className="text-base md:text-lg text-gray-200/90 leading-relaxed">
              Entre em contato para agendamentos, dúvidas ou parcerias. Será um prazer conversar com você.
            </p>

            <div className="flex flex-col gap-3 text-gray-200/90">


              <p>
                <span className="font-semibold text-white/90">Endereço:<br></br></span>
                R. Cassimiro Pizzoni - Vila Isabel, Criciúma - SC, 88817-540
              </p>
            </div>
            <p>
              <span className="font-semibold text-white/90">Telefone:<br /></span>
              (48) 99922-6486
            </p>

            <a
              href="https://www.google.com/search?sca_esv=ac344efa8a269a48&rlz=1C1CHBF_enBR1154BR1154&sxsrf=AE3TifPYiiVxMujQTD0J9fzjyNhSRdCUOQ:1763677352010&q=Luana+feliciano+psic%C3%B3loga+rio+maina&sa=X&ved=2ahUKEwj7psKQ4oGRAxXuDbkGHS6eL-EQ7xYoAHoECCQQAQ&biw=841&bih=730&dpr=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#8C5F44] px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-green-600 hover:text-white transition-all duration-300 w-max"            >

              <MapPinned size={18} />
              Acessar endereço
            </a>
          </div>


          <div className="md:w-1/2">
            <iframe
              title="Localização Luana Feliciano"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3538.354235490316!2d-49.380100124606946!3d-28.653698468743763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95217e7e6d6f6bc3%3A0x6cc64df4e2e3a3cf!2sR.%20Cassimiro%20Pizzoni%20-%20Vila%20Isabel%2C%20Crici%C3%BAma%20-%20SC%2C%2088817-540!5e0!3m2!1spt-BR!2sbr!4v1732132312341!5m2!1spt-BR!2sbr"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "0.5rem" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>


      <section
        id="feedbacks"
        className="px-6 py-16 text-center backdrop-blur-sm bg-[#8C5F44]"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-8">
          Feedbacks dos pacientes
        </h3>

        <div className="max-w-3xl mx-auto">
          <Slider {...sliderSettings}>
            {feedbacks.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`Feedback ${idx + 1}`}
                  className="
              mx-auto 
              rounded-lg 
              shadow-lg 
              transition-transform 
              duration-500
              max-w-[85%]  
              h-auto
            "
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>





      <footer className="text-center text-sm text-gray-100/80 py-5 border-t border-white/10 bg-[#8C5F44]">
        © {new Date().getFullYear()} Luana Feliciano • Todos os direitos reservados
      </footer>
    </div>
  );
}
