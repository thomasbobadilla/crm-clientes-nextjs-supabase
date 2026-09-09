"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  clienteId: number;
  clienteNome: string;
  onInteracoesAlteradas?: () => void | Promise<void>;
};

type Interacao = {
  id: number;
  cliente_id: number;
  tipo: string;
  descricao: string;
  data_interacao: string;
  criado_em: string;
  proximo_contato: string | null;
  concluido: boolean;
  concluido_em: string | null;
};

const tiposInteracao = [
  "Ligação",
  "E-mail",
  "Reunião",
  "WhatsApp",
  "Proposta",
  "Outro",
];

function classeTipo(tipo: string) {
  switch (tipo) {
    case "Ligação":
      return "bg-blue-100 text-blue-700 ring-blue-200";

    case "E-mail":
      return "bg-purple-100 text-purple-700 ring-purple-200";

    case "Reunião":
      return "bg-green-100 text-green-700 ring-green-200";

    case "WhatsApp":
      return "bg-emerald-100 text-emerald-700 ring-emerald-200";

    case "Proposta":
      return "bg-amber-100 text-amber-700 ring-amber-200";

    default:
      return "bg-gray-100 text-gray-700 ring-gray-200";
  }
}

function obterDataHoraAtual() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

function converterParaDataHoraLocal(data: string) {
  const dataConvertida = new Date(data);

  const ano = dataConvertida.getFullYear();
  const mes = String(dataConvertida.getMonth() + 1).padStart(2, "0");
  const dia = String(dataConvertida.getDate()).padStart(2, "0");
  const hora = String(dataConvertida.getHours()).padStart(2, "0");
  const minuto = String(dataConvertida.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

export default function InteracoesCliente({
  clienteId,
  clienteNome,
  onInteracoesAlteradas,
}: Props) {
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);

  const [tipo, setTipo] = useState("Ligação");
  const [descricao, setDescricao] = useState("");

  const [dataInteracao, setDataInteracao] =
    useState(obterDataHoraAtual());

  const [agendarProximoContato, setAgendarProximoContato] =
    useState(false);

  const [proximoContato, setProximoContato] = useState("");

  const [interacaoEditando, setInteracaoEditando] =
    useState<Interacao | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarInteracoes() {
    setCarregando(true);
    setErro("");

    const supabase = createClient();

    const { data, error } = await supabase
      .from("interacoes")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("data_interacao", { ascending: false });

    if (error) {
      console.error("Erro ao carregar interações:", error);
      setErro("Não foi possível carregar o histórico.");
      setCarregando(false);
      return;
    }

    setInteracoes(data ?? []);
    setCarregando(false);
  }

  useEffect(() => {
    carregarInteracoes();
  }, [clienteId]);

  function limparFormulario() {
    setInteracaoEditando(null);
    setTipo("Ligação");
    setDescricao("");
    setDataInteracao(obterDataHoraAtual());
    setAgendarProximoContato(false);
    setProximoContato("");
    setErro("");
  }

  async function salvarInteracao(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!descricao.trim()) {
      setErro("Informe uma descrição para a interação.");
      return;
    }

    if (!dataInteracao) {
      setErro("Informe a data e hora da interação.");
      return;
    }

    if (agendarProximoContato && !proximoContato) {
      setErro("Informe a data e hora do próximo contato.");
      return;
    }

    setSalvando(true);
    setErro("");

    const supabase = createClient();

    const dataInteracaoISO =
      new Date(dataInteracao).toISOString();

    const proximoContatoISO =
      agendarProximoContato && proximoContato
        ? new Date(proximoContato).toISOString()
        : null;

    const dadosInteracao = {
      tipo,
      descricao: descricao.trim(),
      data_interacao: dataInteracaoISO,
      proximo_contato: proximoContatoISO,
    };

    if (interacaoEditando) {
      const { error } = await supabase
        .from("interacoes")
        .update(dadosInteracao)
        .eq("id", interacaoEditando.id);

      if (error) {
        console.error(
          "Erro ao atualizar interação:",
          error
        );

        setErro(
          "Não foi possível atualizar a interação."
        );

        setSalvando(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("interacoes")
        .insert({
          cliente_id: clienteId,
          ...dadosInteracao,
        });

      if (error) {
        console.error(
          "Erro ao cadastrar interação:",
          error
        );

        setErro(
          "Não foi possível registrar a interação."
        );

        setSalvando(false);
        return;
      }
    }

    limparFormulario();
    setSalvando(false);

    await carregarInteracoes();
    await onInteracoesAlteradas?.();
  }

  function editarInteracao(interacao: Interacao) {
    setInteracaoEditando(interacao);

    setTipo(interacao.tipo);
    setDescricao(interacao.descricao);

    setDataInteracao(
      converterParaDataHoraLocal(
        interacao.data_interacao
      )
    );

    if (interacao.proximo_contato) {
      setAgendarProximoContato(true);

      setProximoContato(
        converterParaDataHoraLocal(
          interacao.proximo_contato
        )
      );
    } else {
      setAgendarProximoContato(false);
      setProximoContato("");
    }

    setErro("");
  }

  function cancelarEdicao() {
    limparFormulario();
  }

  async function excluirInteracao(id: number) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta interação?"
    );

    if (!confirmar) return;

    setErro("");

    const supabase = createClient();

    const { error } = await supabase
      .from("interacoes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Erro ao excluir interação:",
        error
      );

      setErro(
        "Não foi possível excluir a interação."
      );

      return;
    }

    if (interacaoEditando?.id === id) {
      limparFormulario();
    }

    await carregarInteracoes();
    await onInteracoesAlteradas?.();
  }

  async function concluirAcompanhamento(id: number) {
    const confirmar = window.confirm(
      "Confirma que este acompanhamento foi concluído?"
    );

    if (!confirmar) return;

    setErro("");

    const supabase = createClient();

    const { error } = await supabase
      .from("interacoes")
      .update({
        concluido: true,
        concluido_em: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Erro ao concluir acompanhamento:",
        error
      );

      setErro(
        "Não foi possível concluir o acompanhamento."
      );

      return;
    }

    await carregarInteracoes();
    await onInteracoesAlteradas?.();
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Histórico
        </p>

        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Interações com {clienteNome}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Registre contatos e acompanhe o relacionamento com este cliente.
        </p>
      </div>

      <form
              onSubmit={salvarInteracao}
              className="mx-auto w-full max-w-xl"
>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            {interacaoEditando
              ? "Editar interação"
              : "Nova interação"}
          </h3>
        </div>

        <div className="mx-auto w-full max-w-full rounded-xl bg-gray-50 p-4 sm:p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tipo
            </label>

            <select
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value)
              }
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
            >
              {tiposInteracao.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Data e hora
            </label>

            <input
              type="datetime-local"
              value={dataInteracao}
              onChange={(e) =>
                setDataInteracao(e.target.value)
              }
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Descrição
            </label>

            <input
              type="text"
              value={descricao}
              onChange={(e) =>
                setDescricao(e.target.value)
              }
              placeholder="Ex.: Cliente solicitou uma nova proposta comercial"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
            />
          </div>
        </div>

        <div className="mt-5 border-t border-gray-200 pt-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={agendarProximoContato}
              onChange={(e) => {
                const marcado =
                  e.target.checked;

                setAgendarProximoContato(
                  marcado
                );

                if (!marcado) {
                  setProximoContato("");
                }
              }}
              className="h-4 w-4 rounded border-gray-300"
            />

            <span className="text-sm font-medium text-gray-700">
              Agendar próximo contato
            </span>
          </label>

          {agendarProximoContato && (
            <div className="mt-4 max-w-sm">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Data e hora do próximo contato
              </label>

              <input
                type="datetime-local"
                value={proximoContato}
                onChange={(e) =>
                  setProximoContato(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {interacaoEditando && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
          >
            {salvando
              ? "Salvando..."
              : interacaoEditando
              ? "Salvar alterações"
              : "Registrar interação"}
          </button>
        </div>
      </form>

      {erro && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {carregando ? (
        <p className="text-sm text-gray-500">
          Carregando histórico...
        </p>
      ) : interacoes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-500">
            Nenhuma interação registrada para este cliente.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute bottom-3 left-[7px] top-3 w-px bg-gray-200" />

          <div className="space-y-6">
            {interacoes.map((interacao) => {
              const contatoAtrasado =
                Boolean(
                  interacao.proximo_contato
                ) &&
                !interacao.concluido &&
                new Date(
                  interacao.proximo_contato!
                ) < new Date();

              return (
                <div
                  key={interacao.id}
                  className="relative pl-8"
                >
                  <div className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-4 border-white bg-gray-900 ring-1 ring-gray-300" />

                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${classeTipo(
                            interacao.tipo
                          )}`}
                        >
                          {interacao.tipo}
                        </span>

                        <span className="text-xs text-gray-400">
                          {new Date(
                            interacao.data_interacao
                          ).toLocaleString(
                            "pt-BR",
                            {
                              dateStyle:
                                "short",
                              timeStyle:
                                "short",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            editarInteracao(
                              interacao
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            excluirInteracao(
                              interacao.id
                            )
                          }
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-700">
                      {interacao.descricao}
                    </p>

                    {interacao.proximo_contato && (
                      <div className="mt-4">
                        {interacao.concluido ? (
                          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                            <span className="font-semibold">
                              Acompanhamento concluído
                            </span>

                            {interacao.concluido_em && (
                              <>
                                {" em "}
                                {new Date(
                                  interacao.concluido_em
                                ).toLocaleString(
                                  "pt-BR",
                                  {
                                    dateStyle:
                                      "short",
                                    timeStyle:
                                      "short",
                                  }
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <>
                            <div
                              className={`rounded-lg border px-3 py-2.5 text-sm ${
                                contatoAtrasado
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                              }`}
                            >
                              <span className="font-semibold">
                                {contatoAtrasado
                                  ? "Acompanhamento atrasado:"
                                  : "Próximo contato:"}
                              </span>{" "}

                              {new Date(
                                interacao.proximo_contato
                              ).toLocaleString(
                                "pt-BR",
                                {
                                  dateStyle:
                                    "short",
                                  timeStyle:
                                    "short",
                                }
                              )}
                            </div>

                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  concluirAcompanhamento(
                                    interacao.id
                                  )
                                }
                                className="rounded-lg border border-green-300 bg-white px-4 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                              >
                                Concluir acompanhamento
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}