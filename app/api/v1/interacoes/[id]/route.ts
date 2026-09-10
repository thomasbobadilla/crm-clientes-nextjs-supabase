import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ContextoRota = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: ContextoRota
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      tipo,
      descricao,
      data_interacao,
      proximo_contato,
      concluido,
    } = body;

    const tiposPermitidos = [
      "Ligação",
      "E-mail",
      "Reunião",
      "WhatsApp",
      "Proposta",
      "Outro",
    ];

    if (
      typeof tipo !== "string" ||
      !tiposPermitidos.includes(tipo)
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Tipo de interação inválido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof descricao !== "string" ||
      !descricao.trim()
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "A descrição é obrigatória.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof data_interacao !== "string" ||
      !data_interacao.trim()
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "A data da interação é obrigatória.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("interacoes")
      .update({
        tipo,
        descricao: descricao.trim(),
        data_interacao,
        proximo_contato:
          typeof proximo_contato === "string" &&
          proximo_contato.trim()
            ? proximo_contato
            : null,
        concluido:
          typeof concluido === "boolean"
            ? concluido
            : false,
        concluido_em:
          concluido === true
            ? new Date().toISOString()
            : null,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      console.error(
        "Erro API - atualizar interação:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Interação não encontrada ou não foi possível atualizar.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        mensagem:
          "Interação atualizada com sucesso.",
        dados: data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro API - atualizar interação:",
      error
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro: "JSON inválido.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: ContextoRota
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("interacoes")
      .delete()
      .eq("id", id)
      .select("id, cliente_id, tipo, descricao")
      .single();

    if (error || !data) {
      console.error(
        "Erro API - excluir interação:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Interação não encontrada ou não foi possível excluir.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        mensagem:
          "Interação excluída com sucesso.",
        dados: data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro API - excluir interação:",
      error
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro:
          "Não foi possível processar a exclusão.",
      },
      {
        status: 400,
      }
    );
  }
}