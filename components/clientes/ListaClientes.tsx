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

export default function ListaClientes({
  clientes,
  onEditar,
  onExcluir,
}: Props) {
  if (clientes.length === 0) {
    return (
      <p className="text-gray-500">
        Nenhum cliente cadastrado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {clientes.map((cliente) => (
        <div
          key={cliente.id}
          className="rounded border p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                {cliente.nome}
              </p>

              <p className="text-sm text-gray-600">
                {cliente.email || "E-mail não informado"}
              </p>

              <p className="text-sm text-gray-600">
                {cliente.telefone || "Telefone não informado"}
              </p>

              <p className="text-sm text-gray-600">
                {cliente.empresa || "Empresa não informada"}
              </p>

              {cliente.cidade && (
                <p className="text-sm text-gray-600">
                  {cliente.cidade}
                  {cliente.estado
                    ? ` - ${cliente.estado}`
                    : ""}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="rounded bg-gray-100 px-3 py-1 text-sm">
                {cliente.status}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEditar(cliente)}
                  className="rounded border border-gray-300 px-3 py-1 text-sm"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onExcluir(cliente.id)}
                  className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}