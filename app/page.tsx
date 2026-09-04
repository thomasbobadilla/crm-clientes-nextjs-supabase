"use client";

import FormEditarCliente from "@/components/clientes/FormEditarCliente";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import FormCliente from "@/components/clientes/FormCliente";

type Cliente = {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  cargo: string | null;
  cidade: string | null;
  estado: string | null;
  status: string | null;
  observacoes: string | null;
};

export default function Home() {
  async function excluirCliente(id: number) {
  const confirmar = window.confirm(
    "Tem certeza que deseja excluir este cliente?"
  );

  if (!confirmar) return;

  const supabase = createClient();

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir cliente:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    setErro(`Erro ao excluir cliente: ${error.message}`);
    return;
  }

  carregarClientes();
}
  const [clienteEditando, setClienteEditando] =
  useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erro, setErro] = useState("");

  async function carregarClientes() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setErro(error.message);
      return;
    }

    setClientes(data ?? []);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">
          CRM de Clientes
        </h1>

        <p className="mb-8 text-gray-600">
          Next.js + Supabase
        </p>

        {clienteEditando ? (
  <FormEditarCliente
    cliente={clienteEditando}
    onAtualizado={() => {
      setClienteEditando(null);
      carregarClientes();
    }}
    onCancelar={() => setClienteEditando(null)}
  />
) : (
  <FormCliente onClienteCriado={carregarClientes} />
)}

        {erro && (
          <div className="mb-6 rounded bg-red-100 p-4 text-red-700">
            Erro ao acessar o Supabase: {erro}
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Clientes cadastrados
          </h2>

{clientes.length === 0 ? (
  <p className="text-gray-500">
    Nenhum cliente cadastrado.
  </p>
) : (
  <div className="space-y-3">
    {clientes.map((cliente) => (
      <div
        key={cliente.id}
        className="rounded border p-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold">
              {cliente.nome}
            </p>

            <p className="text-sm text-gray-600">
              {cliente.email || "E-mail não informado"}
            </p>

            <p className="text-sm text-gray-600">
              {cliente.telefone || "Telefone não informado"}
            </p>

            <p className="text-sm text-gray-600">
              {cliente.empresa || "Empresa não informada"}
            </p>

            {cliente.cidade && (
              <p className="text-sm text-gray-600">
                {cliente.cidade}
                {cliente.estado ? ` - ${cliente.estado}` : ""}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="rounded bg-gray-100 px-3 py-1 text-sm">
              {cliente.status}
            </span>

            <button
              type="button"
              onClick={() => setClienteEditando(cliente)}
              className="rounded border border-gray-300 px-3 py-1 text-sm"
            >
              Editar
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => excluirCliente(cliente.id)}
          className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
        >
          Excluir
        </button>
      </div>
    ))}
  </div>
)}
        </div>
      </div>
    </main>
  );
}