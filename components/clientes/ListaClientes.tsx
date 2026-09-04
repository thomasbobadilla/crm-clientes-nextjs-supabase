"use client";

type Cliente = {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  cargo: string | null;
  cidade: string | null;
  estado: string | null;
  status: string | null;
  observacoes: string | null;
};

type Props = {
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onExcluir: (id: number) => void;
};

function classeStatus(status: string | null) {
  switch (status) {
    case "Ativo":
      return "bg-green-100 text-green-700";
    case "Prospect":
      return "bg-blue-100 text-blue-700";
    case "Inativo":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function ListaClientes({
  clientes,
  onEditar,
  onExcluir,
}: Props) {
  if (clientes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">
          Nenhum cliente encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clientes.map((cliente) => (
        <div
          key={cliente.id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {cliente.nome}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${classeStatus(
                    cliente.status
                  )}`}
                >
                  {cliente.status || "Sem status"}
                </span>
              </div>

              {(cliente.cargo || cliente.empresa) && (
                <p className="mb-3 text-sm text-gray-600">
                  {cliente.cargo || "Cargo não informado"}
                  {cliente.empresa
                    ? ` • ${cliente.empresa}`
                    : ""}
                </p>
              )}

              <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <p>
                  <span className="font-medium text-gray-700">
                    E-mail:
                  </span>{" "}
                  {cliente.email || "Não informado"}
                </p>

                <p>
                  <span className="font-medium text-gray-700">
                    Telefone:
                  </span>{" "}
                  {cliente.telefone || "Não informado"}
                </p>

                <p>
                  <span className="font-medium text-gray-700">
                    Localização:
                  </span>{" "}
                  {cliente.cidade
                    ? `${cliente.cidade}${
                        cliente.estado
                          ? ` - ${cliente.estado}`
                          : ""
                      }`
                    : "Não informada"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 md:flex-col">
              <button
                type="button"
                onClick={() => onEditar(cliente)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onExcluir(cliente.id)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}