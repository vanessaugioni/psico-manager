<div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 h-[80vh] overflow-y-auto">

  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Consultas</h2>

    <span className="px-3 py-1 rounded-lg text-sm font-medium 
                     border border-[#e5d8cf] text-[#9F6C4D] bg-[#f7ebe4] shadow-sm">
      Total: <strong>{consultasFiltradas.length}</strong>
    </span>
  </div>

  {consultasFiltradas.length === 0 ? (
    <p className="text-gray-500 text-sm">Nenhuma consulta encontrada.</p>
  ) : (
    <ul className="space-y-3">
      {consultasFiltradas.map((c) => (
        <li
          key={c.id}
          onClick={() => navigate(`/consultas/edit/${c.id}`)}
          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-100 
                     cursor-pointer transition shadow-sm"
        >
          <p className="font-medium text-gray-800 truncate">
            {getPacienteNome(c.id_paciente)}
          </p>

          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span>📅 {c.data_consulta}</span>
            <span className="hidden sm:inline">—</span>
            <span>⏰ {c.hora_consulta}</span>
          </p>
        </li>
      ))}
    </ul>
  )}
</div>
