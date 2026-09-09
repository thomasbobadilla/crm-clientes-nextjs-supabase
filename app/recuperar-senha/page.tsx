"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function RecuperarSenhaPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarRecuperacao(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");
    setMensagem("");
    setEnviando(true);

    const supabase = createClient();

    const redirectTo =
  `${window.location.origin}/auth/callback?next=/redefinir-senha`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
      }
    );

    if (error) {
      console.error(
        "Erro ao solicitar recuperação de senha:",
        error
      );

      if (
        error.message
          .toLowerCase()
          .includes("rate") ||
        error.message
          .toLowerCase()
          .includes("limit")
      ) {
        setErro(
          "Muitas solicitações de recuperação foram feitas em pouco tempo. Aguarde alguns minutos e tente novamente."
        );
      } else {
        setErro(
          "Não foi possível enviar o e-mail de recuperação. Tente novamente."
        );
      }

      setEnviando(false);
      return;
    }

    setMensagem(
      "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
    );

    setEnviando(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Recuperar senha
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Informe o e-mail utilizado para acessar o CRM.
        </p>

        <form
          onSubmit={enviarRecuperacao}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {erro && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          {mensagem && (
            <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando
              ? "Enviando..."
              : "Enviar instruções"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Voltar para o login
          </button>
        </form>
      </div>
    </main>
  );
}