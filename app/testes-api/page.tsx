"use client";

import { FormEvent, useState } from "react";

type ResultadoApi = {
  status: number;
  body: unknown;
};

export default function TestesApiPage() {
  // POST
  const [nome, setNome] = useState("Cliente API");
  const [email, setEmail] = useState("cliente.api@teste.com");
  const [telefone, setTelefone] = useState("(48) 99999-0000");
  const [empresa, setEmpresa] = useState("Empresa API");
  const [cargo, setCargo] = useState("Gerente");
  const [cidade, setCidade] = useState("Florianópolis");
  const [estado, setEstado] = useState("SC");
  const [status, setStatus] = useState("Prospect");
  const [observacoes, setObservacoes] =
    useState("Criado via API V3");

  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] =
    useState<ResultadoApi | null>(null);

  // PUT
  const [idAtualizacao, setIdAtualizacao] =
    useState("11");

  const [
    nomeAtualizacao,
    setNomeAtualizacao,
  ] = useState("Cliente API Atualizado");

  const [resultadoPut, setResultadoPut] =
    useState<ResultadoApi | null>(null);

  const [carregandoPut, setCarregandoPut] =
    useState(false);

  // DELETE
  const [idExclusao, setIdExclusao] =
    useState("11");

  const [resultadoDelete, setResultadoDelete] =
    useState<ResultadoApi | null>(null);

  const [
    carregandoDelete,
    setCarregandoDelete,
  ] = useState(false);

  async function lerResposta(
    response: Response
  ): Promise<unknown> {
    const texto = await response.text();

    if (!texto) {
      return null;
    }

    try {
      return JSON.parse(texto);
    } catch {
      return {
        respostaBruta: texto,
      };
    }
  }

  async function testarPost(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCarregando(true);
    setResultado(null);

    try {
      const response = await fetch(
        "/api/v1/clientes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            email,
            telefone,
            empresa,
            cargo,
            cidade,
            estado,
            status,
            observacoes,
          }),
        }
      );

      const body = await lerResposta(response);

      setResultado({
        status: response.status,
        body,
      });
    } catch (error) {
      setResultado({
        status: 0,
        body: {
          sucesso: false,
          erro:
            error instanceof Error
              ? error.message
              : "Erro desconhecido.",
        },
      });
    } finally {
      setCarregando(false);
    }
  }

  async function testarPut() {
    setCarregandoPut(true);
    setResultadoPut(null);

    try {
      const response = await fetch(
        `/api/v1/clientes/${idAtualizacao}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nomeAtualizacao,
            email: "cliente.api@teste.com",
            telefone: "(48) 99999-0000",
            empresa: "Empresa API Atualizada",
            cargo: "Gerente",
            cidade: "Florianópolis",
            estado: "SC",
            status: "Ativo",
            observacoes:
              "Atualizado via API V3",
          }),
        }
      );

      const body = await lerResposta(response);

      setResultadoPut({
        status: response.status,
        body,
      });
    } catch (error) {
      setResultadoPut({
        status: 0,
        body: {
          sucesso: false,
          erro:
            error instanceof Error
              ? error.message
              : "Erro desconhecido.",
        },
      });
    } finally {
      setCarregandoPut(false);
    }
  }

  async function testarDelete() {
    const confirmar = window.confirm(
      `Deseja realmente excluir o cliente ID ${idExclusao}?`
    );

    if (!confirmar) {
      return;
    }

    setCarregandoDelete(true);
    setResultadoDelete(null);

    try {
      const response = await fetch(
        `/api/v1/clientes/${idExclusao}`,
        {
          method: "DELETE",
        }
      );

      const body = await lerResposta(response);

      setResultadoDelete({
        status: response.status,
        body,
      });
    } catch (error) {
      setResultadoDelete({
        status: 0,
        body: {
          sucesso: false,
          erro:
            error instanceof Error
              ? error.message
              : "Erro desconhecido.",
        },
      });
    } finally {
      setCarregandoDelete(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            V3 · Desenvolvimento
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Testes da API
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Ambiente interno para testar as rotas da API do CRM.
          </p>
        </div>

        {/* POST */}
        <form
          onSubmit={testarPost}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-6 text-xl font-semibold">
            POST /api/v1/clientes
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              label="Nome"
              value={nome}
              onChange={setNome}
              required
            />

            <Campo
              label="E-mail"
              value={email}
              onChange={setEmail}
              type="email"
            />

            <Campo
              label="Telefone"
              value={telefone}
              onChange={setTelefone}
            />

            <Campo
              label="Empresa"
              value={empresa}
              onChange={setEmpresa}
            />

            <Campo
              label="Cargo"
              value={cargo}
              onChange={setCargo}
            />

            <Campo
              label="Cidade"
              value={cidade}
              onChange={setCidade}
            />

            <Campo
              label="Estado"
              value={estado}
              onChange={setEstado}
            />

            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="Ativo">
                  Ativo
                </option>

                <option value="Prospect">
                  Prospect
                </option>

                <option value="Inativo">
                  Inativo
                </option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">
              Observações
            </label>

            <textarea
              value={observacoes}
              onChange={(e) =>
                setObservacoes(e.target.value)
              }
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
          >
            {carregando
              ? "Enviando..."
              : "Testar POST"}
          </button>
        </form>

        {resultado && (
          <Resultado
            titulo="Resultado POST"
            resultado={resultado}
          />
        )}

        {/* PUT */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            PUT /api/v1/clientes/:id
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              label="ID do cliente"
              value={idAtualizacao}
              onChange={setIdAtualizacao}
            />

            <Campo
              label="Novo nome"
              value={nomeAtualizacao}
              onChange={setNomeAtualizacao}
            />
          </div>

          <button
            type="button"
            onClick={testarPut}
            disabled={carregandoPut}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
          >
            {carregandoPut
              ? "Atualizando..."
              : "Testar PUT"}
          </button>
        </section>

        {resultadoPut && (
          <Resultado
            titulo="Resultado PUT"
            resultado={resultadoPut}
          />
        )}

        {/* DELETE */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">
            DELETE /api/v1/clientes/:id
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Exclui definitivamente um cliente pelo ID.
          </p>

          <div className="max-w-xs">
            <Campo
              label="ID do cliente"
              value={idExclusao}
              onChange={setIdExclusao}
            />
          </div>

          <button
            type="button"
            onClick={testarDelete}
            disabled={carregandoDelete}
            className="mt-6 rounded-lg border border-red-300 bg-white px-5 py-2.5 font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {carregandoDelete
              ? "Excluindo..."
              : "Testar DELETE"}
          </button>
        </section>

        {resultadoDelete && (
          <Resultado
            titulo="Resultado DELETE"
            resultado={resultadoDelete}
          />
        )}
      </div>
    </main>
  );
}

type CampoProps = {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  type?: string;
  required?: boolean;
};

function Campo({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: CampoProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </div>
  );
}

type ResultadoProps = {
  titulo: string;
  resultado: ResultadoApi;
};

function Resultado({
  titulo,
  resultado,
}: ResultadoProps) {
  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">
        {titulo}
      </h2>

      <p className="mt-2 text-sm">
        HTTP Status:{" "}
        <strong>
          {resultado.status}
        </strong>
      </p>

      <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-white">
        {JSON.stringify(
          resultado.body,
          null,
          2
        )}
      </pre>
    </section>
  );
}