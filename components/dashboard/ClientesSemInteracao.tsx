type ClienteSemInteracao = {
  id: number;
  nome: string;
  ultimaInteracao: string | null;
  diasSemInteracao: number | null;
};

type Props = {
  clientes: ClienteSemInteracao[];
  onAbrirCliente: (clienteId: number) => void;
};

export default function ClientesSemInteracao({
  clientes,
  onAbrirCliente,
}: Props) {
  if (clientes.length === 0) {
    return (
      <section className="mb-8 rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Clientes sem interação há 30 dias
        </p>

        <p className="mt-2 text-3xl font-bold text-green-700">
          0
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Nenhum cliente precisa de atenção por falta de interação.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="mb-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Clientes sem interação há 30 dias
        </p>

        <p className="mt-2 text-3xl font-bold text-amber-700">
          {clientes.length}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Clientes que precisam de atenção
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Clientes sem registro de interação nos últimos 30 dias.
          </p>
        </div>

        <div className="space-y-3">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="rounded-xl border border-amber-200 bg-amber-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {cliente.nome}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {cliente.ultimaInteracao
                      ? `Última interação há ${cliente.diasSemInteracao} dia(s)`
                      : "Nenhuma interação registrada"}
                  </p>

                  {cliente.ultimaInteracao && (
                    <p className="mt-2 text-sm font-medium text-amber-700">
                      {new Date(
                        cliente.ultimaInteracao
                      ).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}