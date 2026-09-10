import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ContextoRota = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: ContextoRota
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("interacoes")
      .select("*")
      .eq("cliente_id", id)
      .order("data_interacao", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Erro API - listar interações do cliente:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Não foi possível carregar as interações do cliente.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        clienteId: Number(id),
        total: data?.length ?? 0,
        dados: data ?? [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro API - interações do cliente:",
      error
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro:
          "Não foi possível processar a requisição.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST(
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

    // Confirma se o cliente realmente existe
    const {
      data: cliente,
      error: erroCliente,
    } = await supabase
      .from("clientes")
      .select("id, nome")
      .eq("id", id)
      .single();

    if (erroCliente || !cliente) {
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

    const { data, error } = await supabase
      .from("interacoes")
      .insert({
        cliente_id: Number(id),
        tipo,
        descricao: descricao.trim(),
        data_interacao,
        proximo_contato:
          typeof proximo_contato === "string" &&
          proximo_contato.trim()
            ? proximo_contato
            : null,
        concluido: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Erro API - criar interação:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Não foi possível criar a interação.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        mensagem:
          "Interação criada com sucesso.",
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
        },
        dados: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro API - criar interação:",
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