type ClienteRanking = {
  id: number;
  nome: string;
  quantidade: number;
};

type Props = {
  clientes: ClienteRanking[];
  onAbrirCliente: (clienteId: number) => void;
};

export default function RankingClientes({
  clientes,
  onAbrirCliente,
}: Props) {
  return (
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Relacionamento
        </p>

        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Clientes com mais interações
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Ranking dos clientes com maior volume de interações registradas.
        </p>
      </div>

      {clientes.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhuma interação registrada.
        </p>
      ) : (
        <div className="space-y-3">
          {clientes.map((cliente, indice) => (
            <div
              key={cliente.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                  {indice + 1}
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {cliente.nome}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {cliente.quantidade} interação(ões)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAbrirCliente(cliente.id)
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Ver histórico
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}