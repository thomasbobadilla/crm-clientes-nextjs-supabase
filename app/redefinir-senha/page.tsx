"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function RedefinirSenhaPage() {
  const router = useRouter();

  const [novaSenha, setNovaSenha] =
    useState("");

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState("");

  const [erro, setErro] =
    useState("");

  const [mensagem, setMensagem] =
    useState("");

  const [validando, setValidando] =
    useState(true);

  const [sessaoValida, setSessaoValida] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  useEffect(() => {
    async function verificarSessao() {
      const supabase =
        createClient();

      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser();

      if (error || !user) {
        setErro(
          "A sessão de recuperação é inválida ou expirou. Solicite um novo link."
        );

        setSessaoValida(false);
        setValidando(false);

        return;
      }

      setSessaoValida(true);
      setValidando(false);
    }

    verificarSessao();
  }, []);

  async function redefinirSenha(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    if (novaSenha.length < 8) {
      setErro(
        "A nova senha deve possuir pelo menos 8 caracteres."
      );
      return;
    }

    if (
      novaSenha !== confirmarSenha
    ) {
      setErro(
        "As senhas informadas não são iguais."
      );
      return;
    }

    setSalvando(true);

    const supabase =
      createClient();

    const { error } =
      await supabase.auth.updateUser({
        password: novaSenha,
      });

    if (error) {
      console.error(
        "Erro ao redefinir senha:",
        error
      );

      setErro(
        "Não foi possível redefinir a senha."
      );

      setSalvando(false);
      return;
    }

    setMensagem(
      "Senha redefinida com sucesso."
    );

    setNovaSenha("");
    setConfirmarSenha("");

    await supabase.auth.signOut();

    setSalvando(false);

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1500);
  }

  if (validando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-xl font-semibold text-gray-900">
            Validando recuperação...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Aguarde enquanto verificamos sua sessão.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Redefinir senha
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Defina a nova senha de acesso ao CRM.
        </p>

        {erro && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {mensagem}
          </div>
        )}

        {sessaoValida ? (
          <form
            onSubmit={
              redefinirSenha
            }
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="nova-senha"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nova senha
              </label>

              <input
                id="nova-senha"
                type="password"
                required
                minLength={8}
                value={novaSenha}
                onChange={(e) =>
                  setNovaSenha(
                    e.target.value
                  )
                }
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmar-senha"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirmar nova senha
              </label>

              <input
                id="confirmar-senha"
                type="password"
                required
                minLength={8}
                value={
                  confirmarSenha
                }
                onChange={(e) =>
                  setConfirmarSenha(
                    e.target.value
                  )
                }
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={salvando}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando
                ? "Salvando..."
                : "Redefinir senha"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() =>
              router.push(
                "/recuperar-senha"
              )
            }
            className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
          >
            Solicitar novo link
          </button>
        )}

        <button
          type="button"
          onClick={() =>
            router.push("/login")
          }
          className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Voltar para o login
        </button>
      </div>
    </main>
  );
}