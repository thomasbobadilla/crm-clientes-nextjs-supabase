"use client";

import { useEffect, useState } from "react";
import BotaoSair from "@/components/auth/BotaoSair";
import FormCliente from "@/components/clientes/FormCliente";
import FormEditarCliente from "@/components/clientes/FormEditarCliente";
import ListaClientes from "@/components/clientes/ListaClientes";
import ResumoClientes from "@/components/dashboard/ResumoClientes";
import { createClient } from "@/lib/supabase/client";

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
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);

  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  async function carregarClientes() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error("Erro ao carregar clientes:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setErro(error.message);
      return;
    }

    setErro("");
    setClientes(data ?? []);
  }

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

    setErro("");
    await carregarClientes();
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = busca.toLowerCase().trim();

    const correspondeBusca =
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email?.toLowerCase().includes(termo) ||
      cliente.empresa?.toLowerCase().includes(termo);

    const correspondeStatus =
      filtroStatus === "Todos" ||
      cliente.status === filtroStatus;

    return correspondeBusca && correspondeStatus;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between gap-4">
  <div>
    <h1 className="mb-2 text-3xl font-bold">
      CRM de Clientes
    </h1>

    <p className="text-gray-600">
      Next.js + Supabase
    </p>
  </div>

  <BotaoSair />
</header>

        <ResumoClientes clientes={clientes} />

        {erro && (
          <div className="mb-6 rounded bg-red-100 p-4 text-red-700">
            {erro}
          </div>
        )}

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

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">
              Clientes cadastrados
            </h2>

            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou empresa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm"
            />

            <div className="mb-6 flex flex-wrap gap-2">
              {["Todos", "Ativo", "Prospect", "Inativo"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFiltroStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filtroStatus === status
                      ? "bg-gray-900 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <ListaClientes
              clientes={clientesFiltrados}
              onEditar={setClienteEditando}
              onExcluir={excluirCliente}
            />
          </div>
        </div>
      </div>
    </main>
  );
}