"use client";

import BotaoSair from "@/components/auth/BotaoSair";

export default function HeaderCRM() {
  return (
    <header className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-gray-500">
            Gestão de relacionamento
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            CRM de Clientes
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Gerencie clientes, prospects e informações comerciais.
          </p>
        </div>

        <BotaoSair />
      </div>
    </header>
  );
}