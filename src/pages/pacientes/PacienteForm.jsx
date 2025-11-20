import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function PacienteForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    console.log({
      fullName,
      birthDate,
      age,
      gender,
      maritalStatus,
      address,
      phone,
      email,
      profession,
      education,
      photo,
    });
    navigate("/pacientes");
  };

  const handleCancel = () => {
    navigate("/pacientes");
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };


  const inputClass =
    "w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4D7CFC]/30 text-sm sm:text-base bg-white";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex-shrink-0 w-20 sm:w-64">
        <Sidebar />
      </aside>
      <main className="flex-1 p-4 sm:p-8 flex flex-col">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Cadastrar Paciente
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Preencha os dados do paciente para cadastrá-lo no sistema.
          </p>
        </header>
        <section className="flex-1 flex justify-center">
          <form
            onSubmit={handleSave}
            className="w-full max-w-full bg-white p-6 sm:p-8 rounded-lg shadow-md flex flex-col gap-6"
          >

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
                  className="cursor-pointer text-sm text-blue-600 hover:underline"
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

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label htmlFor="fullName" className="text-gray-600 text-sm font-medium mb-1">
                    Nome Completo
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="birthDate" className="text-gray-600 text-sm font-medium mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="age" className="text-gray-600 text-sm font-medium mb-1">
                    Idade
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Digite a idade"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="gender" className="text-gray-600 text-sm font-medium mb-1">
                    Gênero
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="maritalStatus" className="text-gray-600 text-sm font-medium mb-1">
                    Estado Civil
                  </label>
                  <select
                    id="maritalStatus"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>
              </div>
            </div>

        
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label htmlFor="address" className="text-gray-600 text-sm font-medium mb-1">
                  Endereço Completo
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                  required
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-gray-600 text-sm font-medium mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(XX) XXXXX-XXXX"
                  required
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-600 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@dominio.com"
                  required
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="profession" className="text-gray-600 text-sm font-medium mb-1">
                  Profissão / Ocupação
                </label>
                <input
                  id="profession"
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Digite a profissão"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="education" className="text-gray-600 text-sm font-medium mb-1">
                  Escolaridade
                </label>
                <input
                  id="education"
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Digite a escolaridade"
                  className={inputClass}
                />
              </div>
            </div>

          
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#4D7CFC] text-white hover:bg-[#3c6ae0] transition"
              >
                Salvar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
