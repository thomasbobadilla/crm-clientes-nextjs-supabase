type Acompanhamento = {
  id: number;
  cliente_id: number;
  tipo: string;
  descricao: string;
  proximo_contato: string;
  clientes: {
    id: number;
    nome: string;
  } | null;
};

type Props = {
  acompanhamentos: Acompanhamento[];
  onAbrirCliente: (clienteId: number) => void;
};

export default function AcompanhamentosDashboard({
  acompanhamentos,
  onAbrirCliente,
}: Props) {
  const agora = new Date();

  const atrasados = acompanhamentos.filter(
    (item) => new Date(item.proximo_contato) < agora
  );

  const futuros = acompanhamentos.filter(
    (item) => new Date(item.proximo_contato) >= agora
  );

  return (
    <section className="mb-8">
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Próximos contatos
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {futuros.length}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Acompanhamentos atrasados
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {atrasados.length}
          </p>
        </div>
      </div>

      {acompanhamentos.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Acompanhamentos
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Próximos contatos e atividades que precisam de atenção.
            </p>
          </div>

          <div className="space-y-3">
            {acompanhamentos.map((item) => {
              const atrasado =
                new Date(item.proximo_contato) < agora;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 ${
                    atrasado
                      ? "border-red-200 bg-red-50"
                      : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {item.clientes?.nome ??
                            "Cliente não encontrado"}
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            atrasado
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {atrasado
                            ? "Atrasado"
                            : "Próximo"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-600">
                        {item.tipo} • {item.descricao}
                      </p>

                      <p
                        className={`mt-2 text-sm font-medium ${
                          atrasado
                            ? "text-red-700"
                            : "text-blue-700"
                        }`}
                      >
                        {new Date(
                          item.proximo_contato
                        ).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onAbrirCliente(item.cliente_id)
                      }
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Ver histórico
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}