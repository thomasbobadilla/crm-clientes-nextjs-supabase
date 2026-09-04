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
    },
    {
      titulo: "Clientes ativos",
      valor: ativos,
    },
    {
      titulo: "Prospects",
      valor: prospects,
    },
    {
      titulo: "Clientes inativos",
      valor: inativos,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.titulo}
          className="rounded-lg bg-white p-5 shadow"
        >
          <p className="text-sm text-gray-500">
            {card.titulo}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {card.valor}
          </p>
        </div>
      ))}
    </div>
  );
}