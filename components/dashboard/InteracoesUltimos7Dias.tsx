type DadoDia = {
  data: string;
  quantidade: number;
};

type Props = {
  dados: DadoDia[];
};

export default function InteracoesUltimos7Dias({
  dados,
}: Props) {
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
          Atividade recente
        </p>

        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Interações nos últimos 7 dias
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Evolução diária da atividade comercial registrada no CRM.
        </p>
      </div>

      <div className="grid grid-cols-7 items-end gap-3">
        {dados.map((item) => {
          const altura =
            item.quantidade === 0
              ? 4
              : Math.max(
                  12,
                  (item.quantidade / maiorQuantidade) *
                    120
                );

          return (
            <div
              key={item.data}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs font-semibold text-gray-700">
                {item.quantidade}
              </span>

              <div className="flex h-32 w-full items-end justify-center rounded-lg bg-gray-50 px-2">
                <div
                  className="w-full rounded-t-md bg-gray-900 transition-all duration-500"
                  style={{
                    height: `${altura}px`,
                  }}
                />
              </div>

              <span className="text-center text-xs text-gray-500">
                {item.data}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">
          Total no período:{" "}
          <span className="font-semibold text-gray-900">
            {total}
          </span>
        </p>
      </div>
    </section>
  );
}