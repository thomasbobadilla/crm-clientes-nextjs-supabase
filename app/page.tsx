"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Cliente = {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  status: string | null;
};

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
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
                  <p className="font-semibold">{cliente.nome}</p>

                  <p className="text-sm text-gray-600">
                    {cliente.email || "E-mail não informado"}
                  </p>

                  <p className="text-sm text-gray-600">
                    {cliente.empresa || "Empresa não informada"}
                  </p>

                  <p className="mt-1 text-sm">
                    Status: {cliente.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}