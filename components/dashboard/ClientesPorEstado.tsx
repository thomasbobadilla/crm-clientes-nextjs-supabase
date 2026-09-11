type Cliente = {
  id: number;
  estado: string | null;
};

type Props = {
  clientes: Cliente[];
};

export default function ClientesPorEstado({
  clientes,
}: Props) {
  const contagem = new Map<string, number>();

  clientes.forEach((cliente) => {
    const estado = cliente.estado?.trim().toUpperCase();

    if (!estado) {
      return;
    }

    contagem.set(
      estado,
      (contagem.get(estado) ?? 0) + 1
    );
  });

  const estados = Array.from(contagem.entries())
    .map(([estado, quantidade]) => ({
      estado,
      quantidade,
      percentual:
        clientes.length > 0
          ? Math.round(
              (quantidade / clientes.length) * 100
            )
          : 0,
    }))
    .sort(
      (a, b) =>
        b.quantidade - a.quantidade ||
        a.estado.localeCompare(b.estado)
    );

  return (
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Base de clientes
        </p>

        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Clientes por localização
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribuição da carteira de clientes por estado.
        </p>
      </div>

      {estados.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nenhum estado informado nos cadastros.
        </p>
      ) : (
        <div className="space-y-5">
          {estados.map((item) => (
            <div key={item.estado}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {item.estado}
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {item.quantidade}{" "}
                  {item.quantidade === 1
                    ? "cliente"
                    : "clientes"}{" "}
                  ({item.percentual}%)
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all"
                  style={{
                    width: `${item.percentual}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}