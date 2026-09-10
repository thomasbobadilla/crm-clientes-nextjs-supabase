"use client";

import { useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import FormCliente from "@/components/clientes/FormCliente";
import FormEditarCliente from "@/components/clientes/FormEditarCliente";
import ListaClientes from "@/components/clientes/ListaClientes";

import ResumoClientes from "@/components/dashboard/ResumoClientes";
import AcompanhamentosDashboard from "@/components/dashboard/AcompanhamentosDashboard";
import IndicadoresComerciais from "@/components/dashboard/IndicadoresComerciais";
import InteracoesPorTipo from "@/components/dashboard/InteracoesPorTipo";
import GraficoInteracoes7Dias from "@/components/dashboard/GraficoInteracoes7Dias";

import HeaderCRM from "@/components/layout/HeaderCRM";
import InteracoesCliente from "@/components/clientes/InteracoesCliente";
import FooterCRM from "@/components/layout/FooterCRM";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const [totalInteracoes, setTotalInteracoes] = useState(0);

  const [
    acompanhamentosConcluidos,
    setAcompanhamentosConcluidos,
  ] = useState(0);

  const [
    interacoesUltimos7Dias,
    setInteracoesUltimos7Dias,
  ] = useState(0);

  const [
    interacoesPorDia,
    setInteracoesPorDia,
  ] = useState<
    { data: string; quantidade: number }[]
  >([]);

  const [interacoesPorTipo, setInteracoesPorTipo] =
    useState([
      { tipo: "Ligação", quantidade: 0 },
      { tipo: "E-mail", quantidade: 0 },
      { tipo: "Reunião", quantidade: 0 },
      { tipo: "WhatsApp", quantidade: 0 },
      { tipo: "Proposta", quantidade: 0 },
      { tipo: "Outro", quantidade: 0 },
    ]);

  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);

  const [clienteHistorico, setClienteHistorico] =
    useState<Cliente | null>(null);

  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState("Todos");

  const [ordenacao, setOrdenacao] =
    useState("recentes");

  const [paginaAtual, setPaginaAtual] =
    useState(1);

  const clientesPorPagina = 10;

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
      .eq("concluido", false)
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

    setAcompanhamentos(
      acompanhamentosNormalizados
    );
  }

  async function carregarIndicadoresComerciais() {
    const supabase = createClient();

    const seteDiasAtras = new Date();

    seteDiasAtras.setDate(
      seteDiasAtras.getDate() - 7
    );

    const [
      totalResponse,
      concluidosResponse,
      recentesResponse,
    ] = await Promise.all([
      supabase
        .from("interacoes")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("interacoes")
        .select("*", {
          count: "exact",
          head: true,
        })
        .not("proximo_contato", "is", null)
        .eq("concluido", true),

      supabase
        .from("interacoes")
        .select("*", {
          count: "exact",
          head: true,
        })
        .gte(
          "data_interacao",
          seteDiasAtras.toISOString()
        ),
    ]);

    if (totalResponse.error) {
      console.error(
        "Erro ao carregar total de interações:",
        totalResponse.error
      );
    }

    if (concluidosResponse.error) {
      console.error(
        "Erro ao carregar acompanhamentos concluídos:",
        concluidosResponse.error
      );
    }

    if (recentesResponse.error) {
      console.error(
        "Erro ao carregar interações recentes:",
        recentesResponse.error
      );
    }

    setTotalInteracoes(
      totalResponse.count ?? 0
    );

    setAcompanhamentosConcluidos(
      concluidosResponse.count ?? 0
    );

    setInteracoesUltimos7Dias(
      recentesResponse.count ?? 0
    );
  }

  async function carregarInteracoesPorTipo() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("interacoes")
      .select("tipo");

    if (error) {
      console.error(
        "Erro ao carregar interações por tipo:",
        error
      );
      return;
    }

    const tipos = [
      "Ligação",
      "E-mail",
      "Reunião",
      "WhatsApp",
      "Proposta",
      "Outro",
    ];

    const resultado = tipos.map((tipo) => ({
      tipo,
      quantidade:
        data?.filter(
          (interacao) =>
            interacao.tipo === tipo
        ).length ?? 0,
    }));

    setInteracoesPorTipo(resultado);
  }

  async function carregarInteracoesPorDia() {
    const supabase = createClient();

    const hoje = new Date();

    const inicio = new Date();

    inicio.setHours(0, 0, 0, 0);
    inicio.setDate(inicio.getDate() - 6);

    const { data, error } = await supabase
      .from("interacoes")
      .select("data_interacao")
      .gte(
        "data_interacao",
        inicio.toISOString()
      );

    if (error) {
      console.error(
        "Erro ao carregar interações por dia:",
        error
      );
      return;
    }

    const dias = Array.from(
      { length: 7 },
      (_, indice) => {
        const dia = new Date(hoje);

        dia.setHours(0, 0, 0, 0);

        dia.setDate(
          hoje.getDate() - (6 - indice)
        );

        return dia;
      }
    );

    const resultado = dias.map((dia) => {
      const quantidade =
        data?.filter((interacao) => {
          const dataInteracao = new Date(
            interacao.data_interacao
          );

          return (
            dataInteracao.getDate() ===
              dia.getDate() &&
            dataInteracao.getMonth() ===
              dia.getMonth() &&
            dataInteracao.getFullYear() ===
              dia.getFullYear()
          );
        }).length ?? 0;

      return {
        data: dia.toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
          }
        ),
        quantidade,
      };
    });

    setInteracoesPorDia(resultado);
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

    await Promise.all([
      carregarClientes(),
      carregarAcompanhamentos(),
      carregarIndicadoresComerciais(),
    ]);
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

  function abrirHistoricoPorId(
    clienteId: number
  ) {
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

  function exportarClientesCSV() {
    if (clientesOrdenados.length === 0) {
      window.alert(
        "Não há clientes para exportar com os filtros atuais."
      );
      return;
    }

    const cabecalho = [
      "ID",
      "Nome",
      "E-mail",
      "Telefone",
      "Empresa",
      "Cargo",
      "Cidade",
      "Estado",
      "Status",
      "Observações",
    ];

    function escaparCSV(
      valor: string | number | null
    ) {
      const texto =
        valor === null || valor === undefined
          ? ""
          : String(valor);

      return `"${texto.replace(/"/g, '""')}"`;
    }

    const linhas = clientesOrdenados.map(
      (cliente) => [
        cliente.id,
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.empresa,
        cliente.cargo,
        cliente.cidade,
        cliente.estado,
        cliente.status,
        cliente.observacoes,
      ]
    );

    const conteudoCSV = [
      cabecalho.map(escaparCSV).join(";"),
      ...linhas.map((linha) =>
        linha.map(escaparCSV).join(";")
      ),
    ].join("\r\n");

    const blob = new Blob(
      ["\uFEFF" + conteudoCSV],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const dataAtual = new Date()
      .toISOString()
      .slice(0, 10);

    link.href = url;
    link.download = `clientes-crm-${dataAtual}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function exportarClientesExcel() {
    if (clientesOrdenados.length === 0) {
      window.alert(
        "Não há clientes para exportar com os filtros atuais."
      );
      return;
    }

    const dadosExcel = clientesOrdenados.map(
      (cliente) => ({
        ID: cliente.id,
        Nome: cliente.nome,
        "E-mail": cliente.email ?? "",
        Telefone: cliente.telefone ?? "",
        Empresa: cliente.empresa ?? "",
        Cargo: cliente.cargo ?? "",
        Cidade: cliente.cidade ?? "",
        Estado: cliente.estado ?? "",
        Status: cliente.status ?? "",
        Observações: cliente.observacoes ?? "",
      })
    );

    const planilha =
      XLSX.utils.json_to_sheet(dadosExcel);

    planilha["!autofilter"] = {
      ref: planilha["!ref"] ?? "A1:J1",
    };

    planilha["!cols"] = [
      { wch: 8 },
      { wch: 28 },
      { wch: 32 },
      { wch: 20 },
      { wch: 28 },
      { wch: 22 },
      { wch: 22 },
      { wch: 10 },
      { wch: 14 },
      { wch: 45 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      planilha,
      "Clientes"
    );

    const dataAtual = new Date()
      .toISOString()
      .slice(0, 10);

    XLSX.writeFile(
      workbook,
      `clientes-crm-${dataAtual}.xlsx`
    );
  }

  function exportarClientesPDF() {
  if (clientesOrdenados.length === 0) {
    window.alert(
      "Não há clientes para exportar com os filtros atuais."
    );
    return;
  }

  const documento = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const dataGeracao = new Date().toLocaleString(
    "pt-BR"
  );

  documento.setFontSize(18);
  documento.text("CRM de Clientes", 14, 16);

  documento.setFontSize(11);
  documento.text(
    "Relatório de clientes",
    14,
    23
  );

  documento.setFontSize(9);
  documento.text(
    `Gerado em: ${dataGeracao}`,
    14,
    30
  );

  documento.text(
    `Total de clientes: ${clientesOrdenados.length}`,
    14,
    35
  );

  documento.text(
    `Filtro de status: ${
      filtroStatus === "Todos"
        ? "Todos"
        : filtroStatus
    }`,
    14,
    40
  );

  const dadosTabela = clientesOrdenados.map(
    (cliente) => [
      cliente.id,
      cliente.nome,
      cliente.email ?? "",
      cliente.telefone ?? "",
      cliente.empresa ?? "",
      cliente.cidade ?? "",
      cliente.estado ?? "",
      cliente.status ?? "",
    ]
  );

  autoTable(documento, {
    startY: 47,

    head: [
      [
        "ID",
        "Nome",
        "E-mail",
        "Telefone",
        "Empresa",
        "Cidade",
        "UF",
        "Status",
      ],
    ],

    body: dadosTabela,

    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
    },

    headStyles: {
      fontStyle: "bold",
    },

    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 38 },
      2: { cellWidth: 48 },
      3: { cellWidth: 32 },
      4: { cellWidth: 42 },
      5: { cellWidth: 35 },
      6: { cellWidth: 12 },
      7: { cellWidth: 24 },
    },

    margin: {
      left: 14,
      right: 14,
    },
  });

  const quantidadePaginas =
    documento.getNumberOfPages();

  for (
    let pagina = 1;
    pagina <= quantidadePaginas;
    pagina++
  ) {
    documento.setPage(pagina);

    documento.setFontSize(8);

    documento.text(
      `CRM de Clientes · v2.0.0 · Página ${pagina} de ${quantidadePaginas}`,
      148,
      202,
      {
        align: "center",
      }
    );
  }

  const dataArquivo = new Date()
    .toISOString()
    .slice(0, 10);

  documento.save(
    `clientes-crm-${dataArquivo}.pdf`
  );
}

  useEffect(() => {
    carregarClientes();
    carregarAcompanhamentos();
    carregarIndicadoresComerciais();
    carregarInteracoesPorTipo();
    carregarInteracoesPorDia();
  }, []);

  const clientesFiltrados =
    clientes.filter((cliente) => {
      const termo =
        busca.toLowerCase().trim();

      const correspondeBusca =
        cliente.nome
          .toLowerCase()
          .includes(termo) ||
        (cliente.email
          ?.toLowerCase()
          .includes(termo) ??
          false) ||
        (cliente.empresa
          ?.toLowerCase()
          .includes(termo) ??
          false);

      const correspondeStatus =
        filtroStatus === "Todos" ||
        cliente.status === filtroStatus;

      return (
        correspondeBusca &&
        correspondeStatus
      );
    });

  const clientesOrdenados = [
    ...clientesFiltrados,
  ].sort((a, b) => {
    switch (ordenacao) {
      case "antigos":
        return a.id - b.id;

      case "nome-az":
        return a.nome.localeCompare(
          b.nome,
          "pt-BR"
        );

      case "nome-za":
        return b.nome.localeCompare(
          a.nome,
          "pt-BR"
        );

      case "empresa-az":
        return (a.empresa ?? "").localeCompare(
          b.empresa ?? "",
          "pt-BR"
        );

      case "recentes":
      default:
        return b.id - a.id;
    }
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      clientesOrdenados.length /
        clientesPorPagina
    )
  );

  const indiceInicial =
    (paginaAtual - 1) *
    clientesPorPagina;

  const indiceFinal =
    indiceInicial + clientesPorPagina;

  const clientesPaginados =
    clientesOrdenados.slice(
      indiceInicial,
      indiceFinal
    );

  const primeiroClienteExibido =
    clientesOrdenados.length === 0
      ? 0
      : indiceInicial + 1;

  const ultimoClienteExibido = Math.min(
    indiceFinal,
    clientesOrdenados.length
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <HeaderCRM />

        <ResumoClientes
          clientes={clientes}
        />

        <IndicadoresComerciais
          totalInteracoes={
            totalInteracoes
          }
          acompanhamentosPendentes={
            acompanhamentos.length
          }
          acompanhamentosConcluidos={
            acompanhamentosConcluidos
          }
          interacoesUltimos7Dias={
            interacoesUltimos7Dias
          }
        />

        <InteracoesPorTipo
          dados={interacoesPorTipo}
        />

        <GraficoInteracoes7Dias
          dados={interacoesPorDia}
        />

        <AcompanhamentosDashboard
          acompanhamentos={
            acompanhamentos
          }
          onAbrirCliente={
            abrirHistoricoPorId
          }
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
            onClienteCriado={
              carregarClientes
            }
          />
        )}
      </div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <h2 className="text-xl font-semibold">
    Clientes cadastrados
  </h2>

  <div className="flex flex-wrap gap-2">
    <button
      type="button"
      onClick={exportarClientesCSV}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
    >
      Exportar CSV
    </button>

    <button
      type="button"
      onClick={exportarClientesExcel}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
    >
      Exportar Excel
    </button>

    <button
      type="button"
      onClick={exportarClientesPDF}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
    >
      Exportar PDF
    </button>

  </div>
</div>

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Buscar clientes
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Pesquise por nome, e-mail
                    ou empresa.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Digite nome, e-mail ou empresa..."
                    value={busca}
                    onChange={(e) => {
                      setBusca(
                        e.target.value
                      );
                      setPaginaAtual(1);
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                  />

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                          onClick={() => {
                            setFiltroStatus(
                              status
                            );
                            setPaginaAtual(
                              1
                            );
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            filtroStatus ===
                            status
                              ? "bg-gray-900 text-white shadow-sm"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <label
                        htmlFor="ordenacao-clientes"
                        className="text-sm font-medium text-gray-600"
                      >
                        Ordenar por:
                      </label>

                      <select
                        id="ordenacao-clientes"
                        value={ordenacao}
                        onChange={(e) => {
                          setOrdenacao(
                            e.target.value
                          );
                          setPaginaAtual(1);
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                      >
                        <option value="recentes">
                          Mais recentes
                        </option>

                        <option value="antigos">
                          Mais antigos
                        </option>

                        <option value="nome-az">
                          Nome A–Z
                        </option>

                        <option value="nome-za">
                          Nome Z–A
                        </option>

                        <option value="empresa-az">
                          Empresa A–Z
                        </option>
                      </select>
                    </div>
                  </div>

                  {(busca ||
                    filtroStatus !==
                      "Todos") && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-500">
                        {
                          clientesFiltrados.length
                        }{" "}
                        cliente(s)
                        encontrado(s)
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setBusca("");
                          setFiltroStatus(
                            "Todos"
                          );
                          setPaginaAtual(1);
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
                      setClienteHistorico(
                        null
                      )
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
                    await Promise.all([
                      carregarAcompanhamentos(),
                      carregarIndicadoresComerciais(),
                      carregarInteracoesPorTipo(),
                      carregarInteracoesPorDia(),
                    ]);
                  }}
                />
              </div>
            )}

            <ListaClientes
              clientes={
                clientesPaginados
              }
              onEditar={
                setClienteEditando
              }
              onExcluir={
                excluirCliente
              }
              onAbrirHistorico={
                abrirHistorico
              }
            />

            {clientesOrdenados.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">
                    Exibindo{" "}
                    <span className="font-medium text-gray-700">
                      {primeiroClienteExibido}–
                      {ultimoClienteExibido}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium text-gray-700">
                      {
                        clientesOrdenados.length
                      }
                    </span>{" "}
                    cliente(s)
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setPaginaAtual(
                          (pagina) =>
                            Math.max(
                              1,
                              pagina - 1
                            )
                        )
                      }
                      disabled={
                        paginaAtual === 1
                      }
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Anterior
                    </button>

                    <span className="text-center text-sm text-gray-500">
                      Página{" "}
                      <span className="font-semibold text-gray-900">
                        {paginaAtual}
                      </span>{" "}
                      de{" "}
                      <span className="font-semibold text-gray-900">
                        {totalPaginas}
                      </span>
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setPaginaAtual(
                          (pagina) =>
                            Math.min(
                              totalPaginas,
                              pagina + 1
                            )
                        )
                      }
                      disabled={
                        paginaAtual ===
                        totalPaginas
                      }
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            )}

          <FooterCRM />
        </div>
      </main>
      );
}
