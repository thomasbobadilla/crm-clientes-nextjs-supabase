"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  onClienteCriado: () => void;
};

export default function FormCliente({ onClienteCriado }: Props) {
  const supabase = createClient();

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
      className="mb-8 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="mb-6 text-xl font-semibold">
        Novo Cliente
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nome *
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            E-mail
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Telefone
          </label>

          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            placeholder="(48) 99999-9999"
            maxLength={15}
            inputMode="numeric"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Empresa
          </label>

          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Cargo
          </label>

          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Cidade
          </label>

          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
    Estado
  </label>

  <select
    value={estado}
    onChange={(e) => setEstado(e.target.value)}
    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
  >
    <option value="">Selecione a UF</option>

    {estadosBrasil.map((uf) => (
      <option key={uf} value={uf}>
        {uf}
      </option>
    ))}
  </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Prospect">Prospect</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium">
          Observações
        </label>

        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={4}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {mensagem && (
        <p className="mt-4 text-sm">
          {mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={salvando}
        className="mt-6 rounded bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {salvando ? "Salvando..." : "Salvar cliente"}
      </button>
    </form>
  );
}