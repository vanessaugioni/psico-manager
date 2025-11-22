import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
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

  const [photo, setPhoto] = useState(null);

  const [openSections, setOpenSections] = useState({
    additional: false,
    medicalHistory: false,
    contact: false,
  });


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
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade;
  };

  const uploadPhoto = async (file) => {
    console.warn("📸 Enviando arquivo:", file);

    if (!file) return null;

    const filePath = `fotos/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    console.warn("UPLOAD DATA:", data);
    console.warn("UPLOAD ERROR:", error);

    if (error || !data) {
      console.error("Erro no upload:", error?.message);
      return null;
    }
    const { data: publicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    console.warn("URL:", publicData?.publicUrl);

    return publicData?.publicUrl || null;
  };


  const cleanCPF = (cpf) => cpf.replace(/\D/g, "");

  const checkCpfExists = async (cpf) => {
    const clean = cleanCPF(cpf);

    const { data, error } = await supabase
      .from("pacientes")
      .select("id")
      .eq("cpf", clean)
      .maybeSingle();

    if (error) {
      console.error("Erro ao verificar CPF:", error);
      return false;
    }

    return !!data;
  };


  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSaveID = async (e) => {
    e.preventDefault();

    const newErrors = {};

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

    const cpfExists = await checkCpfExists(cpf);

    if (cpfExists) {
      toast.error("Este CPF já está cadastrado.");
      setErrors((prev) => ({ ...prev, cpf: true }));
      return;
    }

    const genero_id = generoOptions.find((g) => g.name === gender)?.id || null;
    const estado_civil_id = estadoCivilOptions.find((e) => e.name === maritalStatus)?.id || null;
    const religiao_id = religiaoOptions.find((r) => r.name === religion)?.id || null;
    const escolaridade_id = escolaridadeOptions.find((e) => e.name === education)?.id || null;
    const orientacao_id = orientacaoOptions.find((o) => o.name === sexualOrientation)?.id || null;
    const pais_id = paisOptions.find((p) => p.name === country)?.id || null;

    let photoUrl = null;
    if (photo) {
      photoUrl = await uploadPhoto(photo);
    }

    const { data, error } = await supabase.from("pacientes").insert([
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
        endereco: address ? `${address}, ${number}` : null,
        pais_id,
        telefone: phone,
        contato_emergencia: emergencyContact,
        email,
        medicacao: medication,
        observacao: `${diseases ? `Doenças: ${diseases}\n` : ""}${observation}`,
        foto: photoUrl,
      },
    ]);

    if (error) {
      console.log(error);
      toast.error("Erro ao salvar paciente. Verifique os dados.");
      return;
    }

    toast.success("Paciente salvo com sucesso!");
    setTimeout(() => navigate("/pacientes"), 1500);
  };


  const handleCancel = () => navigate("/pacientes");

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]);
  };

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9F6C4D] transition text-gray-700 text-sm sm:text-base bg-white placeholder-gray-400";

  const textareaClass = `${inputClass} resize-none h-24`;
  const sectionClass =
    "bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4";


  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <ToastContainer position="top-right" autoClose={3000} />
      <aside className="flex-shrink-0 w-20 sm:w-64 h-screen sticky top-0">
        <Sidebar />
      </aside>

      <main className="flex-1 p-4 sm:p-8 flex flex-col">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Cadastrar Paciente
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Preencha os dados do paciente para cadastrá-lo no sistema.
          </p>
        </header>

        <div className="flex justify-end gap-2 mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSaveID}
            className="px-4 py-2 rounded-md bg-[#9F6C4D] text-white hover:bg-[#8e5b41] transition"
          >
            Salvar
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
                    src={URL.createObjectURL(photo)}
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
                <input
                  placeholder="Nome Completo *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={`${inputClass} ${errors?.fullName ? "border-red-500" : ""}`}
                />
                <input
                  className={inputClass}
                  placeholder="Nome Social"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                />

                <IMaskInput
                  className={`${inputClass} ${errors?.cpf ? "border-red-500" : ""}`}
                  placeholder="CPF *"
                  mask="000.000.000-00"
                  value={cpf}
                  onAccept={(value) => setCpf(value)}
                  required
                />

                <input
                  className={`${inputClass} ${errors?.birthDate ? "border-red-500" : ""}`}
                  type="date"
                  placeholder="Data de Nascimento *"
                  value={birthDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBirthDate(value);

                    const idadeCalculada = calcularIdade(value);
                    setAge(idadeCalculada);
                  }}
                  max={new Date().toISOString().split("T")[0]} 
                  required
                />

                <input
                  className={`${inputClass} ${errors?.age ? "border-red-500" : ""} bg-gray-100 text-gray-500 cursor-not-allowed`}
                  type="number"
                  placeholder="Idade"
                  disabled
                  value={age ?? ""}
                />

                <select
                  className={`${inputClass} appearance-none bg-white`}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Selecione o Gênero </option>
                  {generoOptions.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <select
                  className={`${inputClass} appearance-none bg-white`}
                  value={sexualOrientation}
                  onChange={(e) => setSexualOrientation(e.target.value)}
                >
                  <option value="">Selecione a Orientação</option>
                  {orientacaoOptions.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
                <select
                  className={`${inputClass} appearance-none bg-white`}
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                >
                  <option value="">Selecione o Estado Civil</option>
                  {estadoCivilOptions.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
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
                  <input
                    className={inputClass}
                    placeholder="Profissão"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                  <select
                    className={`${inputClass} appearance-none bg-white`}
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                  >
                    <option value="">Selecione a Religião</option>
                    {religiaoOptions.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className={`${inputClass} appearance-none bg-white`}
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  >
                    <option value="">Selecione a Escolaridade</option>
                    {escolaridadeOptions.map((e) => (
                      <option key={e.id} value={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  className={textareaClass}
                  placeholder="Composição Familiar"
                  value={familyComposition}
                  onChange={(e) => setFamilyComposition(e.target.value)}
                />
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
                  <input
                    className={inputClass}
                    placeholder="Medicação"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="Doenças"
                    value={diseases}
                    onChange={(e) => setDiseases(e.target.value)}
                  />
                </div>
                <textarea
                  className={textareaClass}
                  placeholder="Observação"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
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
                <input
                  className={inputClass}
                  placeholder="Endereço (Rua, Bairro)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Número"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  type="number"
                />
                <select
                  className={`${inputClass} appearance-none`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Selecione o País</option>
                  {paisOptions.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <IMaskInput
                  className={`${inputClass} ${errors?.phone ? "border-red-500" : ""}`}
                  placeholder="Celular *"
                  mask="+55 (00) 00000-0000"
                  value={phone}
                  onAccept={(value) => setPhone(value)}
                  required
                />

                <IMaskInput
                  className={inputClass}
                  placeholder="Contato de Emergência"
                  mask="+55 (00) 00000-0000"
                  value={emergencyContact}
                  onAccept={(value) => setEmergencyContact(value)}
                />
                <input
                  className={inputClass}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
