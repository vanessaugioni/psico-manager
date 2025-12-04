import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../lib/supabaseClient";
import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function PacienteForm() {

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const [fullName, setFullName] = useState("");
  const [socialName, setSocialName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");

  const [profession, setProfession] = useState("");
  const [religion, setReligion] = useState("");
  const [education, setEducation] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");

  const [medication, setMedication] = useState("");
  const [diseases, setDiseases] = useState("");
  const [observation, setObservation] = useState("");

  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [email, setEmail] = useState("");

  const [generoOptions, setGeneroOptions] = useState([]);
  const [orientacaoOptions, setOrientacaoOptions] = useState([]);
  const [estadoCivilOptions, setEstadoCivilOptions] = useState([]);
  const [religiaoOptions, setReligiaoOptions] = useState([]);
  const [escolaridadeOptions, setEscolaridadeOptions] = useState([]);
  const [paisOptions, setPaisOptions] = useState([]);

  const [photo, setPhoto] = useState(null);



  useEffect(() => {
    const loadOptions = async () => {
      const [
        { data: generos },
        { data: orientacoes },
        { data: estadosCivis },
        { data: religioes },
        { data: escolaridades },
        { data: paises }
      ] = await Promise.all([
        supabase.from("generos").select("*"),
        supabase.from("orientacoes").select("*"),
        supabase.from("estados_civis").select("*"),
        supabase.from("religioes").select("*"),
        supabase.from("escolaridades").select("*"),
        supabase.from("paises").select("*"),
      ]);

      setGeneroOptions(generos || []);
      setOrientacaoOptions(orientacoes || []);
      setEstadoCivilOptions(estadosCivis || []);
      setReligiaoOptions(religioes || []);
      setEscolaridadeOptions(escolaridades || []);
      setPaisOptions(paises || []);
    };

    loadOptions();
  }, []);


  const calcularIdade = (data) => {
    if (!data) return null;
    const hoje = new Date();
    const nasc = new Date(data);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  };

  const cleanCPF = (cpf) => cpf.replace(/\D/g, "");

  const checkCpfExists = async (cpf) => {
    const clean = cleanCPF(cpf);
    const { data } = await supabase
      .from("pacientes")
      .select("id_paciente")
      .eq("cpf", clean)
      .maybeSingle();
    return !!data;
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const uploadPhoto = async (file) => {
    if (!file) return null;

    const filePath = `fotos/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error) return null;

    const { data: publicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return publicData?.publicUrl;
  };


  const handleSaveID = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = true;
    if (!cpf.trim() || cpf.includes("_")) newErrors.cpf = true;
    if (!birthDate.trim()) newErrors.birthDate = true;
    if (!phone.trim()) newErrors.phone = true;

    if (email && !isValidEmail(email)) {
      toast.error("Digite um email válido.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    const cpfExists = await checkCpfExists(cpf);
    if (cpfExists) {
      toast.error("Este CPF já está cadastrado.");
      return;
    }

    const genero_id = gender || null;
    const orientacao_id = sexualOrientation || null;
    const estado_civil_id = maritalStatus || null;
    const religiao_id = religion || null;
    const escolaridade_id = education || null;
    const pais_id = country || null;

    let photoUrl = null;
    if (photo) photoUrl = await uploadPhoto(photo);

    const { error } = await supabase.from("pacientes").insert([
      {
        nome: fullName,
        nome_social: socialName,
        cpf: cleanCPF(cpf),
        data_nascimento: birthDate,
        idade: age,
        genero_id,
        orientacao_id,
        estado_civil_id,
        profissao: profession,
        religiao_id,
        escolaridade_id,
        composicao_familiar: familyComposition,
        endereco: address,
        numero: number,
        pais_id,
        contato: phone,
        contato_emergencia: emergencyContact,
        email,
        medicacao: medication,
        observacao: observation,
        doencas: diseases,
        foto: photoUrl,
      },
    ]);

    if (error) {
      toast.error("Erro ao salvar paciente.");
      return;
    }

    toast.success("Paciente salvo!");
    setTimeout(() => navigate("/pacientes"), 1500);
  };



  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D] text-sm";

  const textareaClass = `${inputClass} h-24 resize-none`;

  const blockClass =
    "bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4";

  const sectionTitle =
    "text-lg font-semibold text-gray-800 mb-1";


  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <ToastContainer />


      <aside className="w-20 sm:w-64 h-screen sticky top-0">
        <Sidebar />
      </aside>

      <main className="flex-1 space-y-8 p-8">


        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Cadastrar Paciente</h1>
          <p className="text-gray-500 text-sm">
            Preencha os dados abaixo para registrar um novo paciente.
          </p>
        </div>

        <div className="flex gap-3 mb-6 justify-end">
          <button
            onClick={() => navigate("/pacientes")}
            className="
  h-10 px-5
  flex items-center justify-center gap-2 text-[#4A3F39]
  rounded-lg
  font-normal text-sm
  shadow-md

  transition-all duration-300
  hover:bg-gray-300
  hover:shadow-lg
  active:scale-[0.97]
  bg-gray-200

"
          >
            Cancelar
          </button>

          <button
            onClick={handleSaveID}
            className="
  h-10 px-5
  flex items-center justify-center gap-2
  bg-[#9F6C4D] text-white
  rounded-lg 
  font-normal text-sm
  shadow-md

  transition-all duration-300
  hover:bg-[#875B3F]
  hover:shadow-lg
  active:scale-[0.97]
"
          >
            Salvar
          </button>
        </div>




        <div className={blockClass}>
          <p className={sectionTitle}>Dados Pessoais</p>
          <hr className="border-gray-300" />

          <div className="flex gap-6 items-start">
            <div className="flex flex-col items-center">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  className="h-28 w-28 rounded-full object-cover mb-2"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  Foto
                </div>
              )}

              <label
                htmlFor="photoUpload"
                className="text-sm text-[#9F6C4D] cursor-pointer hover:underline"
              >
                {photo ? "Trocar foto" : "Adicionar foto"}
              </label>

              <input
                id="photoUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

              <input
                className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${inputClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`}
                placeholder="Nome Completo *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}

              />

              <input
                className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}

                placeholder="Nome Social"
                value={socialName}
                onChange={(e) => setSocialName(e.target.value)}
              />

              <IMaskInput
                className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${inputClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`}
                placeholder="CPF *"
                mask="000.000.000-00"
                value={cpf}
                onAccept={(v) => setCpf(v)}
              />

              <input
                type="date"
                className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${inputClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`} value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setAge(calcularIdade(e.target.value));
                }}
              />

              <input
                disabled
                className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm transition-all duration-200 bg-gray-100
`}
                value={age ?? ""}
                placeholder="Idade (automático)"
              />

              <select
                className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >


                <option value="">Selecione o Gênero</option>
                {generoOptions.map((g) => (
                  <option key={g.id_genero} value={g.id_genero}>
                    {g.descricao}
                  </option>
                ))}
              </select>

              <select
                className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}
                value={sexualOrientation}
                onChange={(e) => setSexualOrientation(e.target.value)}
              >
                <option value=""> Selecione a Orientação</option>
                {orientacaoOptions.map((o) => (
                  <option key={o.id_orientacao} value={o.id_orientacao}>
                    {o.descricao}
                  </option>
                ))}
              </select>

              <select
                className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <option value="">Selecione Estado Civil</option>
                {estadoCivilOptions.map((e) => (
                  <option key={e.id_estado_civil} value={e.id_estado_civil}>
                    {e.descricao}
                  </option>
                ))}
              </select>

            </div>
          </div>
        </div>


        <div className={blockClass}>
          <p className={sectionTitle}>Informações Adicionais</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <input
              className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
              placeholder="Profissão"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />

            <select
              className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
            >
              <option value="">Selecione Religião</option>
              {religiaoOptions.map((r) => (
                <option key={r.id_religiao} value={r.id_religiao}>
                  {r.descricao}
                </option>
              ))}
            </select>

            <select
              className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            >
              <option value="">Selecione Escolaridade</option>
              {escolaridadeOptions.map((e) => (
                <option key={e.id_escolaridade} value={e.id_escolaridade}>
                  {e.descricao}
                </option>
              ))}
            </select>

          </div>

          <textarea
            className={`
  ${inputClass}
  w-full pr-9
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
            placeholder="Composição Familiar"
            value={familyComposition}
            onChange={(e) => setFamilyComposition(e.target.value)}
          />
        </div>


        <div className={blockClass}>
          <p className={sectionTitle}>Histórico Médico</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
              placeholder="Medicação"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
            />

            <input
              className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
              placeholder="Doenças"
              value={diseases}
              onChange={(e) => setDiseases(e.target.value)}
            />

          </div>

          <textarea
            className={`
  ${inputClass}
  w-full pr-9 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
            placeholder="Observações"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
          />
        </div>


        <div className={blockClass}>
          <p className={sectionTitle}>Endereço e Contato</p>
          <hr className="border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <input
              className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
              placeholder="Endereço"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
              placeholder="Número"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <select
              className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Selecione o País</option>
              {paisOptions.map((p) => (
                <option key={p.id_pais} value={p.id_pais}>
                  {p.nome}
                </option>
              ))}
            </select>

            <IMaskInput
              className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${inputClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`}
              placeholder="Celular *"
              mask="+55 (00) 00000-0000"
              value={phone}
              onAccept={(v) => setPhone(v)}
            />

            <IMaskInput
              className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
              placeholder="Contato de Emergência"
              mask="+55 (00) 00000-0000"
              value={emergencyContact}
              onAccept={(v) => setEmergencyContact(v)}
            />

            <input
              className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />

          </div>
        </div>

      </main>
    </div>
  );
}
