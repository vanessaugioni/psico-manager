import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PacienteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);

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

  const [openSections, setOpenSections] = useState({
    additional: false,
    medicalHistory: false,
    contact: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleSection = (section) => {
    setOpenSections({ ...openSections, [section]: !openSections[section] });
  };


  const generoOptions = [
    { id: 1, name: "Masculino" },
    { id: 2, name: "Feminino" },
    { id: 3, name: "Outro" },
  ];
  const estadoCivilOptions = [
    { id: 1, name: "Solteiro(a)" },
    { id: 2, name: "Casado(a)" },
    { id: 3, name: "Divorciado(a)" },
    { id: 4, name: "Viúvo(a)" },
  ];
  const religiaoOptions = [
    { id: 1, name: "Católica" },
    { id: 2, name: "Evangélica" },
    { id: 3, name: "Espírita" },
    { id: 4, name: "Outras" },
  ];
  const escolaridadeOptions = [
    { id: 1, name: "Fundamental" },
    { id: 2, name: "Médio" },
    { id: 3, name: "Superior" },
    { id: 4, name: "Pós-graduação" },
  ];
  const orientacaoOptions = [
    { id: 1, name: "Heterossexual" },
    { id: 2, name: "Homossexual" },
    { id: 3, name: "Bissexual" },
    { id: 4, name: "Outro" },
  ];
  const paisOptions = [
    { id: 1, name: "Brasil" },
    { id: 2, name: "Argentina" },
    { id: 3, name: "Estados Unidos" },
  ];

  const calcularIdade = (data) => {
    if (!data) return null;
    const hoje = new Date();
    const nasc = new Date(data);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  };

  const fetchPaciente = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id_paciente", id)
      .single();

    if (error || !data) {
      toast.error("Paciente não encontrado.");
      navigate("/pacientes");
      return;
    }

    setFullName(data.nome || "");
    setSocialName(data.nome_social || "");
    setCpf(data.cpf || "");
    setBirthDate(data.data_nascimento || "");
    setAge(calcularIdade(data.data_nascimento));

    const genero = generoOptions.find((g) => g.id === data.genero_id);
    setGender(genero ? genero.name : "");

    const orientacao = orientacaoOptions.find((o) => o.id === data.orientacao_id);
    setSexualOrientation(orientacao ? orientacao.name : "");

    const estadoCivil = estadoCivilOptions.find((e) => e.id === data.estado_civil_id);
    setMaritalStatus(estadoCivil ? estadoCivil.name : "");

    const religiao = religiaoOptions.find((r) => r.id === data.religiao_id);
    setReligion(religiao ? religiao.name : "");

    const escolaridade = escolaridadeOptions.find((e) => e.id === data.escolaridade_id);
    setEducation(escolaridade ? escolaridade.name : "");

    const pais = paisOptions.find((p) => p.id === data.pais_id);
    setCountry(pais ? pais.name : "");

    setProfession(data.profissao || "");
    setFamilyComposition(data.composicao_familiar || "");
    setMedication(data.medicacao || "");

    setObservation(data.observacao || "");
    setAddress(data.endereco || "");
    setNumber(data.numero || "");
    setPhone(data.contato || "");
    setEmergencyContact(data.contato_emergencia || "");
    setEmail(data.email || "");
    setPhoto(data.foto || null);

    const obs = data.observacao || "";
    const doencasMatch = obs.match(/^Doenças:\s*(.*)\n?/);
    setDiseases(doencasMatch ? doencasMatch[1] : "");
    setObservation(obs.replace(/^Doenças:.*\n?/, ""));


    setLoading(false);
  };

  useEffect(() => {
    fetchPaciente();
  }, [id]);

  const uploadPhoto = async (file) => {
    if (!file) return null;
    const filePath = `fotos/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error || !data) {
      console.error("Erro no upload:", error);
      return null;
    }

    const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(filePath);

    return publicData?.publicUrl || null;
  };


  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    return () => {
      if (photo instanceof File) URL.revokeObjectURL(photo);
    };
  }, [photo]);



  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const cleanCPF = (cpf) => (cpf ? cpf.replace(/\D/g, "") : "");

    if (!fullName.trim()) newErrors.fullName = "Nome obrigatório.";
    if (!cpf.trim() || cpf.includes("_")) newErrors.cpf = "CPF obrigatório.";
    if (!birthDate.trim()) newErrors.birthDate = "Data de nascimento obrigatória.";
    if (!phone.trim()) newErrors.phone = "Celular obrigatório.";

    if (email && !isValidEmail(email)) {
      toast.error("Digite um email válido.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    setErrors({});

    const genero_id = generoOptions.find((g) => g.name === gender)?.id || null;
    const estado_civil_id = estadoCivilOptions.find((e) => e.name === maritalStatus)?.id || null;
    const religiao_id = religiaoOptions.find((r) => r.name === religion)?.id || null;
    const escolaridade_id = escolaridadeOptions.find((e) => e.name === education)?.id || null;
    const orientacao_id = orientacaoOptions.find((o) => o.name === sexualOrientation)?.id || null;
    const pais_id = paisOptions.find((p) => p.name === country)?.id || null;

    let photoUrl = photo;
    if (photo instanceof File) {
      photoUrl = await uploadPhoto(photo);
    }

    const { data, error } = await supabase
      .from("pacientes")
      .update({
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
        doencas: diseases,
        observacao: observation,
        foto: photoUrl,
      })
      .eq("id_paciente", id);

    if (error) {
      console.log(error);
      toast.error("Erro ao atualizar paciente. Verifique os dados.");
      return;
    }

    toast.success("Paciente atualizado com sucesso!");
    setTimeout(() => navigate("/pacientes"), 1500);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("pacientes").delete().eq("id_paciente", id);
    if (error) toast.error("Exclusão bloqueada: o paciente possui consultas e registros vinculados.");
    else {
      toast.success("Paciente excluído com sucesso!");
      setTimeout(() => navigate("/pacientes"), 1500);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]);
  };

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D] transition text-gray-700 text-sm sm:text-base bg-white placeholder-gray-400";
  const textareaClass = `${inputClass} resize-none h-24`;
  const sectionClass =
    "bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4";

  if (loading) return <div>Carregando paciente...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <ToastContainer position="top-right" autoClose={3000} />
      <aside className="flex-shrink-0 w-20 sm:w-64 h-screen sticky top-0">
        <Sidebar />
      </aside>
      <main className="flex-1 p-4 sm:p-8 flex flex-col">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Editar Paciente
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Atualize os dados do paciente para editar o cadastro.
          </p>
        </header>

        <div className="flex gap-3 mb-6 justify-end">

          {/* CANCELAR */}
          <button
            type="button"
            onClick={() => navigate("/pacientes")}
            className="
      h-10 px-5
      flex items-center justify-center gap-2
      text-[#4A3F39]
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

          {/* SALVAR */}
          <button
            type="submit"
            onClick={handleUpdate}
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

          {/* DELETAR */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="
      h-10 px-4
      flex items-center justify-center
      bg-red-500 text-white
      rounded-lg
      shadow-md
      
      transition-all duration-300
      hover:bg-red-600
      hover:shadow-lg
      active:scale-[0.97]
    "
          >
            <Trash2 size={18} />
          </button>

        </div>



        <form className="w-full flex flex-col gap-6">
          <div className={sectionClass}>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Dados Pessoais
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
              <div className="flex-shrink-0 flex flex-col items-center justify-start mt-1">
                {photo ? (
                  <img
                    src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                    alt="Preview"
                    className="h-28 w-28 object-cover rounded-full mb-2"
                  />
                ) : (
                  <div className="h-28 w-28 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-400 text-sm">
                    Foto
                  </div>
                )}
                <label
                  htmlFor="photoUpload"
                  className="cursor-pointer text-sm text-[#9F6C4D] hover:underline"
                >
                  {photo ? "Alterar foto" : "Anexar foto"}
                </label>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>


              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Nome Completo: *
                  </label>

                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${inputClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`}
                  /></div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Nome Social:
                  </label>
                  <input

                    value={socialName}
                    onChange={(e) => setSocialName(e.target.value)}
                    className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`} /></div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    CPF:
                  </label>
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
                    onAccept={(value) => setCpf(value)}
                  /></div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Data Nascimento:
                  </label>
                  <input
                    className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${inputClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`} type="date"
                    value={birthDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBirthDate(value);
                      setAge(calcularIdade(value));
                    }}
                    max={new Date().toISOString().split("T")[0]}
                  /></div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Idade:
                  </label>
                  <input
                    className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm transition-all duration-200 bg-gray-100
`} type="number"
                    value={age ?? ""}
                    placeholder="Idade"
                    disabled
                  /></div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Gênero:
                  </label>
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
                    <option value=""></option>
                    {generoOptions.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select></div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Orientação Sexual:
                  </label>
                  <select
                    className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `} value={sexualOrientation}
                    onChange={(e) => setSexualOrientation(e.target.value)}
                  >
                    <option value=""></option>
                    {orientacaoOptions.map((o) => (
                      <option key={o.id} value={o.name}>
                        {o.name}
                      </option>
                    ))}
                  </select></div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Estado Civil:
                  </label>
                  <select
                    className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `} value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                  >
                    <option value=""></option>
                    {estadoCivilOptions.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select></div>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <button
              type="button"
              onClick={() => toggleSection("additional")}
              className="w-full flex justify-between items-center mb-2 text-left text-gray-700 font-semibold"
            >
              Informações Adicionais
              {openSections.additional ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSections.additional && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Profissão:
                    </label>
                    <input
                      className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                    /></div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Religião:
                    </label>
                    <select
                      className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `} value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                    >
                      <option value=""></option>
                      {religiaoOptions.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select></div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Escolaridade:
                    </label>
                    <select
                      className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `} value={education}
                      onChange={(e) => setEducation(e.target.value)}
                    >
                      <option value=""></option>
                      {escolaridadeOptions.map((e) => (
                        <option key={e.id} value={e.name}>
                          {e.name}
                        </option>
                      ))}
                    </select></div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Composição Familiar:
                  </label>
                  <textarea
                    className={`
  ${inputClass}
  w-full pr-9  
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                    value={familyComposition}
                    onChange={(e) => setFamilyComposition(e.target.value)}
                  /></div>
              </div>
            )}
          </div>
          <div className={sectionClass}>
            <button
              type="button"
              onClick={() => toggleSection("medicalHistory")}
              className="w-full flex justify-between items-center mb-2 text-left text-gray-700 font-semibold"
            >
              Histórico Médico
              {openSections.medicalHistory ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSections.medicalHistory && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Medicação:
                    </label>
                    <input
                      className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                    /></div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Doenças:
                    </label>
                    <input
                      className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                      value={diseases}
                      onChange={(e) => setDiseases(e.target.value)}
                    /></div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Observação:
                  </label>
                  <textarea
                    className={`
  ${inputClass}
  w-full pr-9
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                  /></div>
              </div>
            )}
          </div>
          <div className={sectionClass}>
            <button
              type="button"
              onClick={() => toggleSection("contact")}
              className="w-full flex justify-between items-center mb-2 text-left text-gray-700 font-semibold"
            >
              Endereço e Contato
              {openSections.contact ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSections.contact && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Endereço (Rua, Av...):
                  </label>
                  <input
                    className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  /></div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    N°:
                  </label>
                  <input
                    className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  /></div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    País:
                  </label>
                  <select
                    className={`
    ${inputClass}
    w-full h-10 py-2
    border border-gray-200 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
    text-sm bg-white transition-all duration-200 appearance-none
  `} value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value=""></option>
                    {paisOptions.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select></div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Contato:
                  </label>
                  <IMaskInput
                    mask="+55 (00) 00000-0000"
                    value={phone}
                    className={`
  w-full pr-9 h-10
  border rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
  ${inputClass}
  ${errors.fullName ? "border-red-500" : "border-gray-200"}
`}
                    onAccept={(value) => setPhone(value)}
                  /></div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Contato de Emergência:
                  </label>
                  <input
                    className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                    mask="+55 (00) 00000-0000"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  /></div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    E-mail:
                  </label>
                  <input
                    className={`
  ${inputClass}
  w-full pr-9 h-10 
  border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-[#9F6C4D]/40
  text-sm bg-white transition-all duration-200
`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  /></div>
              </div>
            )}
          </div>
        </form>


        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="
      bg-white rounded-xl shadow-xl 
      w-[90%] max-w-[420px] 
      p-7
    ">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Confirmar Exclusão
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Tem certeza que deseja excluir este paciente?
                Esta ação não pode ser desfeita.
              </p>

              <div className="flex justify-end gap-3">

                {/* Botão Cancelar */}
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="
            h-10 px-5
            flex items-center justify-center
            bg-gray-200 text-[#4A3F39]
            rounded-lg 
            font-normal text-sm
            shadow-md

            transition-all duration-300
            hover:bg-gray-300
            hover:shadow-lg
            active:scale-[0.97]
          "
                >
                  Cancelar
                </button>

                {/* Botão Excluir */}
                <button
                  onClick={() => {
                    handleDelete();
                    setShowDeleteModal(false);
                  }}
                  className="
            h-10 px-5
            flex items-center justify-center
            bg-red-500 text-white
            rounded-lg 
            font-normal text-sm
            shadow-md

            transition-all duration-300
            hover:bg-red-600
            hover:shadow-lg
            active:scale-[0.97]
          "
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}