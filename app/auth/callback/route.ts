import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } =
    new URL(request.url);

  const code = searchParams.get("code");

  const next =
    searchParams.get("next") ??
    "/redefinir-senha";

  if (code) {
    const supabase =
      await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    if (!error) {
      return NextResponse.redirect(
        `${origin}${next}`
      );
    }

    console.error(
      "Erro ao trocar código por sessão:",
      error
    );
  }

  return NextResponse.redirect(
    `${origin}/recuperar-senha?erro=link-invalido`
  );
}