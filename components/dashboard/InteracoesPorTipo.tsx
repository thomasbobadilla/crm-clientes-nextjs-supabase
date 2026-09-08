type IndicadorTipo = {
  tipo: string;
  quantidade: number;
};

type Props = {
  dados: IndicadorTipo[];
};

export default function InteracoesPorTipo({ dados }: Props) {
  const maiorQuantidade = Math.max(
    ...dados.map((item) => item.quantidade),
    1
  );

  const total = dados.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  return (
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Atividade comercial
        </p>

        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Interações por tipo
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribuição dos contatos registrados no CRM.
        </p>
      </div>

      <div className="space-y-5">
        {dados.map((item) => {
          const percentual =
            (item.quantidade / maiorQuantidade) * 100;

          return (
            <div key={item.tipo}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {item.tipo}
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {item.quantidade}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-500"
                  style={{
                    width:
                      item.quantidade === 0
                        ? "0%"
                        : `${percentual}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">
          Total de interações:{" "}
          <span className="font-semibold text-gray-900">
            {total}
          </span>
        </p>
      </div>
    </section>
  );
}