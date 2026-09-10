import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const busca = searchParams.get("busca")?.trim() ?? "";

    const paginaParam = Number(
      searchParams.get("pagina") ?? "1"
    );

    const limiteParam = Number(
      searchParams.get("limite") ?? "10"
    );

    const pagina =
      Number.isInteger(paginaParam) && paginaParam > 0
        ? paginaParam
        : 1;

    const limite =
      Number.isInteger(limiteParam) &&
      limiteParam > 0 &&
      limiteParam <= 100
        ? limiteParam
        : 10;

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

    let query = supabase
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
        `,
        {
          count: "exact",
        }
      );

    if (status) {
      query = query.eq("status", status);
    }

    if (busca) {
      query = query.or(
        `nome.ilike.%${busca}%,email.ilike.%${busca}%,empresa.ilike.%${busca}%`
      );
    }

    const inicio =
      (pagina - 1) * limite;

    const fim =
      inicio + limite - 1;

    const {
      data,
      error,
      count,
    } = await query
      .order("id", {
        ascending: false,
      })
      .range(inicio, fim);

    if (error) {
      console.error(
        "Erro API - listar clientes:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Não foi possível carregar os clientes.",
        },
        {
          status: 500,
        }
      );
    }

    const total =
      count ?? 0;

    const totalPaginas =
      Math.max(
        1,
        Math.ceil(total / limite)
      );

    return NextResponse.json(
      {
        sucesso: true,
        paginacao: {
          pagina,
          limite,
          total,
          totalPaginas,
        },
        filtros: {
          status: status ?? null,
          busca: busca || null,
        },
        dados: data ?? [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro API - parâmetros inválidos:",
      error
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Não foi possível processar a requisição.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
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
      .insert({
        nome: nome.trim(),
        email:
          typeof email === "string" && email.trim()
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

    if (error) {
      console.error(
        "Erro API - criar cliente:",
        error
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Não foi possível criar o cliente.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Cliente criado com sucesso.",
        dados: data,
      },
      {
        status: 201,
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