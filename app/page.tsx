"use client";

import { useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import FormCliente from "@/components/clientes/FormCliente";
import FormEditarCliente from "@/components/clientes/FormEditarCliente";
import ListaClientes from "@/components/clientes/ListaClientes";
import ResumoClientes from "@/components/dashboard/ResumoClientes";
import AcompanhamentosDashboard from "@/components/dashboard/AcompanhamentosDashboard";
import HeaderCRM from "@/components/layout/HeaderCRM";
import InteracoesCliente from "@/components/clientes/InteracoesCliente";

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

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [acompanhamentos, setAcompanhamentos] =
    useState<Acompanhamento[]>([]);

  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);

  const [clienteHistorico, setClienteHistorico] =
    useState<Cliente | null>(null);

  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState("Todos");

  const historicoRef =
    useRef<HTMLDivElement | null>(null);

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

  async function carregarAcompanhamentos() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("interacoes")
      .select(`
        id,
        cliente_id,
        tipo,
        descricao,
        proximo_contato,
        clientes (
          id,
          nome
        )
      `)
      .not("proximo_contato", "is", null)
      .order("proximo_contato", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erro ao carregar acompanhamentos:",
        error
      );

      return;
    }

    const acompanhamentosNormalizados =
      (data ?? []).map((item) => ({
        ...item,
        clientes: Array.isArray(item.clientes)
          ? item.clientes[0] ?? null
          : item.clientes ?? null,
      })) as Acompanhamento[];

    setAcompanhamentos(acompanhamentosNormalizados);
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

      setErro(
        `Erro ao excluir cliente: ${error.message}`
      );

      return;
    }

    setErro("");

    if (clienteHistorico?.id === id) {
      setClienteHistorico(null);
    }

    await carregarClientes();
    await carregarAcompanhamentos();
  }

  function abrirHistorico(cliente: Cliente) {
    setClienteHistorico(cliente);

    setTimeout(() => {
      historicoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function abrirHistoricoPorId(clienteId: number) {
    const cliente = clientes.find(
      (item) => item.id === clienteId
    );

    if (!cliente) {
      setErro(
        "Não foi possível localizar o cliente."
      );

      return;
    }

    abrirHistorico(cliente);
  }

  useEffect(() => {
    carregarClientes();
    carregarAcompanhamentos();
  }, []);

  const clientesFiltrados = clientes.filter(
    (cliente) => {
      const termo = busca.toLowerCase().trim();

      const correspondeBusca =
        cliente.nome
          .toLowerCase()
          .includes(termo) ||
        cliente.email
          ?.toLowerCase()
          .includes(termo) ||
        cliente.empresa
          ?.toLowerCase()
          .includes(termo);

      const correspondeStatus =
        filtroStatus === "Todos" ||
        cliente.status === filtroStatus;

      return (
        correspondeBusca &&
        correspondeStatus
      );
    }
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <HeaderCRM />

        <ResumoClientes clientes={clientes} />

        <AcompanhamentosDashboard
          acompanhamentos={acompanhamentos}
          onAbrirCliente={abrirHistoricoPorId}
        />

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
            onCancelar={() =>
              setClienteEditando(null)
            }
          />
        ) : (
          <FormCliente
            onClienteCriado={carregarClientes}
          />
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">
              Clientes cadastrados
            </h2>

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Buscar clientes
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Pesquise por nome, e-mail ou
                    empresa.
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Digite nome, e-mail ou empresa..."
                      value={busca}
                      onChange={(e) =>
                        setBusca(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Todos",
                      "Ativo",
                      "Prospect",
                      "Inativo",
                    ].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setFiltroStatus(status)
                        }
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          filtroStatus === status
                            ? "bg-gray-900 text-white shadow-sm"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {(busca ||
                  filtroStatus !== "Todos") && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500">
                      {clientesFiltrados.length}{" "}
                      cliente(s) encontrado(s)
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setBusca("");
                        setFiltroStatus("Todos");
                      }}
                      className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
                    >
                      Limpar filtros
                    </button>
                  </div>
                )}
              </div>
            </div>

            {clienteHistorico && (
              <div
                ref={historicoRef}
                className="mt-6 scroll-mt-6"
              >
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setClienteHistorico(null)
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Fechar histórico
                  </button>
                </div>

                <InteracoesCliente
                  clienteId={
                    clienteHistorico.id
                  }
                  clienteNome={
                    clienteHistorico.nome
                  }
                  onInteracoesAlteradas={async () => {
                  await carregarAcompanhamentos();
  }}
                />
              </div>
            )}

            <ListaClientes
              clientes={clientesFiltrados}
              onEditar={setClienteEditando}
              onExcluir={excluirCliente}
              onAbrirHistorico={abrirHistorico}
            />
          </div>
        </div>
      </div>
    </main>
  );
}