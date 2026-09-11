type Cliente = {
  id: number;
  status: string | null;
};

type Props = {
  clientes: Cliente[];
};

export default function ClientesPorStatus({
  clientes,
}: Props) {
  const total = clientes.length;

  const dados = [
    {
      status: "Ativo",
      quantidade: clientes.filter(
        (cliente) => cliente.status === "Ativo"
      ).length,
    },
    {
      status: "Prospect",
      quantidade: clientes.filter(
        (cliente) => cliente.status === "Prospect"
      ).length,
    },
    {
      status: "Inativo",
      quantidade: clientes.filter(
        (cliente) => cliente.status === "Inativo"
      ).length,
    },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Base de clientes
        </p>

        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Distribuição por status
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Visão proporcional da carteira atual de clientes.
        </p>
      </div>

      <div className="space-y-5">
        {dados.map((item) => {
          const percentual =
            total === 0
              ? 0
              : Math.round(
                  (item.quantidade / total) * 100
                );

          return (
            <div key={item.status}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {item.status}
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {item.quantidade} ({percentual}%)
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-500"
                  style={{
                    width: `${percentual}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">
          Total da carteira:{" "}
          <span className="font-semibold text-gray-900">
            {total}
          </span>
        </p>
      </div>
    </section>
  );
}