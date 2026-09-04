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
      className="mb-8 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="mb-6 text-xl font-semibold">
        Editar Cliente
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
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
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
          <input
            type="text"
            maxLength={2}
            value={estado}
            onChange={(e) => setEstado(e.target.value.toUpperCase())}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
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
        <p className="mt-4 text-sm text-red-600">
          {mensagem}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="rounded bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          className="rounded border border-gray-300 px-5 py-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}