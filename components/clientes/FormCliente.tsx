"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  onClienteCriado: () => void;
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

export default function FormCliente({ onClienteCriado }: Props) {
  const supabase = createClient();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [observacoes, setObservacoes] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvarCliente(e: React.FormEvent) {
    e.preventDefault();

    setMensagem("");
    setSalvando(true);

    const { error } = await supabase.from("clientes").insert({
      nome,
      email: email || null,
      telefone: telefone || null,
      empresa: empresa || null,
      cargo: cargo || null,
      cidade: cidade || null,
      estado: estado || null,
      status,
      observacoes: observacoes || null,
    });

    if (error) {
      console.error("Erro Supabase:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setMensagem(
        `Erro ao cadastrar cliente: ${error.message || "erro desconhecido"}`
      );

      setSalvando(false);
      return;
    }

    setNome("");
    setEmail("");
    setTelefone("");
    setEmpresa("");
    setCargo("");
    setCidade("");
    setEstado("");
    setStatus("Ativo");
    setObservacoes("");

    setMensagem("Cliente cadastrado com sucesso.");
    setSalvando(false);

    onClienteCriado();
  }

  return (
    <form
      onSubmit={salvarCliente}
      className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Cadastro
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">
          Novo cliente
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Preencha os dados abaixo para adicionar um novo cliente ao CRM.
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
              placeholder="Nome completo"
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
              placeholder="cliente@empresa.com"
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
              placeholder="Nome da empresa"
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
              placeholder="Cargo ou função"
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
              placeholder="Cidade"
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
          placeholder="Informações adicionais sobre o cliente..."
          className={`${inputClass} resize-y`}
        />
      </section>

      {mensagem && (
        <div
          className={`mt-5 rounded-lg px-4 py-3 text-sm ${
            mensagem.startsWith("Erro")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {mensagem}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}