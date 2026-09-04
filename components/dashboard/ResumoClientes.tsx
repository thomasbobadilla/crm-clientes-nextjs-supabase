type Cliente = {
  id: number;
  status: string | null;
};

type Props = {
  clientes: Cliente[];
};

export default function ResumoClientes({ clientes }: Props) {
  const total = clientes.length;

  const ativos = clientes.filter(
    (cliente) => cliente.status === "Ativo"
  ).length;

  const prospects = clientes.filter(
    (cliente) => cliente.status === "Prospect"
  ).length;

  const inativos = clientes.filter(
    (cliente) => cliente.status === "Inativo"
  ).length;

  const cards = [
    {
      titulo: "Total de clientes",
      valor: total,
      classe: "border-gray-200",
    },
    {
      titulo: "Clientes ativos",
      valor: ativos,
      classe: "border-green-200",
    },
    {
      titulo: "Prospects",
      valor: prospects,
      classe: "border-blue-200",
    },
    {
      titulo: "Clientes inativos",
      valor: inativos,
      classe: "border-gray-300",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.titulo}
          className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${card.classe}`}
        >
          <p className="text-sm font-medium text-gray-500">
            {card.titulo}
          </p>

          <p className="mt-3 text-3xl font-bold text-gray-900">
            {card.valor}
          </p>
        </div>
      ))}
    </div>
  );
}