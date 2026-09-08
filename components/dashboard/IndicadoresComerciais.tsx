type Props = {
  totalInteracoes: number;
  acompanhamentosPendentes: number;
  acompanhamentosConcluidos: number;
  interacoesUltimos7Dias: number;
};

export default function IndicadoresComerciais({
  totalInteracoes,
  acompanhamentosPendentes,
  acompanhamentosConcluidos,
  interacoesUltimos7Dias,
}: Props) {
  const indicadores = [
    {
      titulo: "Total de interações",
      valor: totalInteracoes,
      classe: "border-gray-200",
    },
    {
      titulo: "Acompanhamentos pendentes",
      valor: acompanhamentosPendentes,
      classe: "border-amber-200",
    },
    {
      titulo: "Acompanhamentos concluídos",
      valor: acompanhamentosConcluidos,
      classe: "border-green-200",
    },
    {
      titulo: "Interações nos últimos 7 dias",
      valor: interacoesUltimos7Dias,
      classe: "border-blue-200",
    },
  ];

  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Indicadores comerciais
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Visão geral da atividade e dos acompanhamentos do CRM.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((indicador) => (
          <div
            key={indicador.titulo}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${indicador.classe}`}
          >
            <p className="text-sm text-gray-500">
              {indicador.titulo}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {indicador.valor}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}