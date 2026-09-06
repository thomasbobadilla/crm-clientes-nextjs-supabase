"use client";

import { useState } from "react";
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

type Props = {
  cliente: Cliente;
  onAtualizado: () => void;
  onCancelar: () => void;
};

function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

const estadosBrasil = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100";

export default function FormEditarCliente({
  cliente,
  onAtualizado,
  onCancelar,
}: Props) {
  const supabase = createClient();

  const [nome, setNome] = useState(cliente.nome);
  const [email, setEmail] = useState(cliente.email ?? "");
  const [telefone, setTelefone] = useState(cliente.telefone ?? "");
  const [empresa, setEmpresa] = useState(cliente.empresa ?? "");
  const [cargo, setCargo] = useState(cliente.cargo ?? "");
  const [cidade, setCidade] = useState(cliente.cidade ?? "");
  const [estado, setEstado] = useState(cliente.estado ?? "");
  const [status, setStatus] = useState(cliente.status ?? "Ativo");
  const [observacoes, setObservacoes] = useState(
    cliente.observacoes ?? ""
  );

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function atualizarCliente(e: React.FormEvent) {
    e.preventDefault();

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("clientes")
      .update({
        nome,
        email: email || null,
        telefone: telefone || null,
        empresa: empresa || null,
        cargo: cargo || null,
        cidade: cidade || null,
        estado: estado || null,
        status,
        observacoes: observacoes || null,
      })
      .eq("id", cliente.id);

    if (error) {
      console.error("Erro Supabase:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setMensagem(
        `Erro ao atualizar cliente: ${error.message || "erro desconhecido"}`
      );

      setSalvando(false);
      return;
    }

    setSalvando(false);
    onAtualizado();
  }

  return (
    <form
      onSubmit={atualizarCliente}
      className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Edição
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">
          Editar cliente
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Atualize as informações do cliente selecionado.
        </p>
      </div>

      <section className="border-b border-gray-100 pb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Dados principais
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nome *
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="Ativo">Ativo</option>
              <option value="Prospect">Prospect</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 py-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Contato
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Telefone
            </label>

            <input
              type="tel"
              value={telefone}
              onChange={(e) =>
                setTelefone(formatarTelefone(e.target.value))
              }
              placeholder="(48) 99999-9999"
              maxLength={15}
              inputMode="numeric"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 py-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Empresa
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Empresa
            </label>

            <input
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Cargo
            </label>

            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 py-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Localização
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Cidade
            </label>

            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Estado
            </label>

            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione a UF</option>

              {estadosBrasil.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Observações
        </h3>

        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </section>

      {mensagem && (
        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {mensagem}
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={salvando}
          className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}