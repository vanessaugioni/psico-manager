import { useState, useEffect } from "react";

export default function PacienteForm({ pacienteData, onSave, onCancel }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    if (pacienteData) {
      setFullName(pacienteData.fullName);
      setEmail(pacienteData.email);
      setPhone(pacienteData.phone);
      setBirthDate(pacienteData.birthDate);
    }
  }, [pacienteData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...pacienteData, fullName, email, phone, birthDate });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow mb-6 max-w-md"
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nome</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Telefone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nascimento</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
