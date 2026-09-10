import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ContextoRota = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: ContextoRota
) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clientes")
    .select(
      `
      id,
      nome,
      email,
      telefone,
      empresa,
      cargo,
      cidade,
      estado,
      status,
      observacoes
      `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Erro API - buscar cliente:", error);

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Cliente não encontrado.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      sucesso: true,
      dados: data,
    },
    {
      status: 200,
    }
  );
}

export async function PUT(
  request: Request,
  { params }: ContextoRota
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      nome,
      email,
      telefone,
      empresa,
      cargo,
      cidade,
      estado,
      status,
      observacoes,
    } = body;

    if (
      typeof nome !== "string" ||
      !nome.trim()
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "O campo nome é obrigatório.",
        },
        {
          status: 400,
        }
      );
    }

    const statusPermitidos = [
      "Ativo",
      "Prospect",
      "Inativo",
    ];

    if (
      status &&
      !statusPermitidos.includes(status)
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Status inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clientes")
      .update({
        nome: nome.trim(),
        email:
          typeof email === "string" &&
          email.trim()
            ? email.trim()
            : null,
        telefone:
          typeof telefone === "string" &&
          telefone.trim()
            ? telefone.trim()
            : null,
        empresa:
          typeof empresa === "string" &&
          empresa.trim()
            ? empresa.trim()
            : null,
        cargo:
          typeof cargo === "string" &&
          cargo.trim()
            ? cargo.trim()
            : null,
        cidade:
          typeof cidade === "string" &&
          cidade.trim()
            ? cidade.trim()
            : null,
        estado:
          typeof estado === "string" &&
          estado.trim()
            ? estado.trim()
            : null,
        status: status || "Ativo",
        observacoes:
          typeof observacoes === "string" &&
          observacoes.trim()
            ? observacoes.trim()
            : null,
      })
      .eq("id", id)
      .select(
        `
        id,
        nome,
        email,
        telefone,
        empresa,
        cargo,
        cidade,
        estado,
        status,
        observacoes
        `
      )
      .single();

    if (error || !data) {
      console.error(
        "Erro API - atualizar cliente:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Cliente não encontrado ou não foi possível atualizar.",
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
          "Cliente atualizado com sucesso.",
        dados: data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro API - payload inválido:",
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
      .from("clientes")
      .delete()
      .eq("id", id)
      .select("id, nome")
      .single();

    if (error || !data) {
      console.error(
        "Erro API - excluir cliente:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Cliente não encontrado ou não foi possível excluir.",
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
          "Cliente excluído com sucesso.",
        dados: data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro API - excluir cliente:",
      error
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro:
          "Não foi possível excluir o cliente.",
      },
      {
        status: 500,
      }
    );
  }
}