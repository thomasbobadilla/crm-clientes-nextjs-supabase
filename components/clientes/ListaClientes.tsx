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
  onAbrirHistorico: (cliente: Cliente) => void;
};

function classeStatus(status: string | null) {
  switch (status) {
    case "Ativo":
      return "bg-green-100 text-green-700 ring-1 ring-green-200";
    case "Prospect":
      return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
    case "Inativo":
      return "bg-gray-200 text-gray-700 ring-1 ring-gray-300";
    default:
      return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  }
}

export default function ListaClientes({
  clientes,
  onEditar,
  onExcluir,
  onAbrirHistorico,
}: Props) {
  if (clientes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <p className="text-sm font-medium text-gray-600">
          Nenhum cliente encontrado.
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Ajuste os filtros ou cadastre um novo cliente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clientes.map((cliente) => (
        <article
          key={cliente.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">
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

              <div className="mb-4">
                {(cliente.cargo || cliente.empresa) && (
                  <p className="text-sm font-medium text-gray-700">
                    {cliente.cargo || "Cargo não informado"}
                    {cliente.empresa
                      ? ` • ${cliente.empresa}`
                      : ""}
                  </p>
                )}
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    E-mail
                  </p>

                  <p className="break-all text-gray-700">
                    {cliente.email || "Não informado"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Telefone
                  </p>

                  <p className="text-gray-700">
                    {cliente.telefone || "Não informado"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Localização
                  </p>

                  <p className="text-gray-700">
                    {cliente.cidade
                      ? `${cliente.cidade}${
                          cliente.estado
                            ? ` - ${cliente.estado}`
                            : ""
                        }`
                      : "Não informada"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Empresa
                  </p>

                  <p className="text-gray-700">
                    {cliente.empresa || "Não informada"}
                  </p>
                </div>
              </div>

              {cliente.observacoes && (
                <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Observações
                  </p>

                  <p className="text-sm leading-relaxed text-gray-600">
                    {cliente.observacoes}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <button
              type="button"
              onClick={() => onAbrirHistorico(cliente)}
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 sm:w-auto"
              >
                Histórico
              </button>

              <button
              type="button"
              onClick={() => onEditar(cliente)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => onExcluir(cliente.id)}
              className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:w-auto"
            >
              Excluir
            </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}