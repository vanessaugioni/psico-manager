import Sidebar from "../components/Sidebar";

export default function Pacientes() {
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Pacientes</h1>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Idade</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id} className="hover:bg-gray-100">
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.nome}</td>
                <td className="border p-2">{p.idade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
