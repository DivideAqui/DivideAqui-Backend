const prisma = require("../libs/prisma.js");
const { Prisma } = require("@prisma/client");

function formatResult(result) {
  return JSON.parse(
    JSON.stringify(result, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

async function anexarDetalhesLegados(grupos, cliente = prisma) {
  if (grupos.length === 0) return grupos;

  const ids = grupos.map((grupo) => grupo.gru_id);
  const [viagens, domesticos] = await Promise.all([
    cliente.$queryRaw`SELECT "gru_id", "via_partida", "via_destino", "via_data_inicio", "via_data_fim" FROM "viagem" WHERE "gru_id" IN (${Prisma.join(ids)})`,
    cliente.$queryRaw`SELECT "gru_id", "dom_endereco", "dom_aluguel", "dom_luz", "dom_agua", "dom_internet" FROM "domestico" WHERE "gru_id" IN (${Prisma.join(ids)})`,
  ]);
  const viagensPorGrupo = new Map(viagens.map((viagem) => [viagem.gru_id, viagem]));
  const domesticosPorGrupo = new Map(domesticos.map((domestico) => [domestico.gru_id, domestico]));

  return grupos.map((grupo) => ({
    ...grupo,
    viagem: viagensPorGrupo.get(grupo.gru_id) ?? null,
    domestico: domesticosPorGrupo.get(grupo.gru_id) ?? null,
  }));
}

async function criarGrupo(req, res) {
  try {
    const campos = ["gru_num_part", "cat_id", "gru_nome", "gru_descricao", "gru_visibilidade", "gru_cor", "gru_icone", "men_id", "gru_num_vagas"];
    const dados = Object.fromEntries(campos.filter((campo) => req.body[campo] !== undefined).map((campo) => [campo, req.body[campo]]));
    if (dados.gru_num_part === undefined || dados.cat_id === undefined) {
      return res.status(400).json({ erro: "Parâmetros obrigatórios ausentes." });
    }

    const categoriaExistente = await prisma.categoria.findUnique({ where: { cat_id: dados.cat_id } });
    if (!categoriaExistente) {
      return res.status(400).json({ erro: "Categoria não encontrada." });
    }
    if (dados.men_id !== undefined) {
      const mensalidadeExistente = await prisma.mensalidade.findUnique({ where: { men_id: dados.men_id } });
      if (!mensalidadeExistente) return res.status(400).json({ erro: "Mensalidade não encontrada." });
    }

    const detalhes = req.body.detalhes ?? {};
    const novo = await prisma.$transaction(async (tx) => {
      const grupo = await tx.grupo.create({ data: dados });

      if (dados.cat_id === 1) {
        if (detalhes.str_valor === undefined || Number.isNaN(Number(detalhes.str_valor))) {
          const erro = new Error("O valor do streaming é obrigatório.");
          erro.statusCode = 400;
          throw erro;
        }
        await tx.stream.create({
          data: {
            cat_id: grupo.cat_id,
            gru_id: grupo.gru_id,
            str_valor: Number(detalhes.str_valor),
          },
        });
      }

      if (dados.cat_id === 2) {
        const camposDomesticos = ["dom_aluguel", "dom_luz", "dom_agua", "dom_internet"];
        if (camposDomesticos.some((campo) => detalhes[campo] === undefined || Number.isNaN(Number(detalhes[campo])))) {
          const erro = new Error("Os valores domésticos são obrigatórios.");
          erro.statusCode = 400;
          throw erro;
        }
        await tx.$executeRaw`INSERT INTO "domestico" ("cat_id", "gru_id", "dom_aluguel", "dom_luz", "dom_agua", "dom_internet", "dom_endereco") VALUES (${grupo.cat_id}, ${grupo.gru_id}, ${Number(detalhes.dom_aluguel)}, ${Number(detalhes.dom_luz)}, ${Number(detalhes.dom_agua)}, ${Number(detalhes.dom_internet)}, ${detalhes.dom_endereco || null})`;
      }

      if (dados.cat_id === 3) {
        const camposViagem = ["via_partida", "via_destino", "via_data_inicio", "via_data_fim"];
        if (camposViagem.some((campo) => !detalhes[campo])) {
          const erro = new Error("Os dados da viagem são obrigatórios.");
          erro.statusCode = 400;
          throw erro;
        }
        await tx.$executeRaw`INSERT INTO "viagem" ("cat_id", "gru_id", "via_partida", "via_destino", "via_data_inicio", "via_data_fim") VALUES (${grupo.cat_id}, ${grupo.gru_id}, ${detalhes.via_partida}, ${detalhes.via_destino}, ${detalhes.via_data_inicio}::date, ${detalhes.via_data_fim}::date)`;
      }

      return grupo;
    });
    return res.status(201).json(formatResult(novo));
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ erro: error.statusCode ? error.message : "Erro interno.", detalhes: error.message });
  }
}

async function listarGrupos(req, res) {
  try {
    const grupos = await prisma.grupo.findMany({
      include: {
        mensalidade: true,
        categoria: true,
        stream: true,
        _count: { select: { participacoes: true } },
      },
      orderBy: { gru_id: "asc" },
    });
    return res.status(200).json(formatResult(await anexarDetalhesLegados(grupos)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const grupo = await prisma.grupo.findUnique({
      where: { gru_id: parseInt(id) },
      include: { categoria: true, mensalidade: true, stream: true, _count: { select: { participacoes: true } } },
    });
    if (!grupo) return res.status(404).json({ erro: "Grupo não encontrado." });
    return res.status(200).json(formatResult((await anexarDetalhesLegados([grupo]))[0]));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function buscarPorCategoriaNome(req, res) {
  try {
    const { nome } = req.query;
    if (!nome) return res.status(400).json({ erro: "Parametro 'nome' é obrigatório." });
    const grupos = await prisma.grupo.findMany({
      where: { categoria: { cat_nome: { contains: nome, mode: "insensitive" } } },
      include: { categoria: true, mensalidade: true, _count: { select: { participacoes: true } } },
    });
    return res.status(200).json(formatResult(await anexarDetalhesLegados(grupos)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function buscarPorQuantidade(req, res) {
  try {
    const { num } = req.params;
    const parsed = parseInt(num);
    if (Number.isNaN(parsed)) return res.status(400).json({ erro: "Número inválido." });
    const grupos = await prisma.grupo.findMany({
      where: { gru_num_part: parsed },
      include: { categoria: true, mensalidade: true, _count: { select: { participacoes: true } } },
    });
    return res.status(200).json(formatResult(await anexarDetalhesLegados(grupos)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function procurarPorNomeGeral(req, res) {
  try {
    const { nome } = req.query;
    if (!nome) return res.status(400).json({ erro: "Parametro 'nome' é obrigatório." });
    const grupos = await prisma.grupo.findMany({
      where: {
        OR: [
          { categoria: { cat_nome: { contains: nome, mode: "insensitive" } } },
        ],
      },
      include: { categoria: true, mensalidade: true, _count: { select: { participacoes: true } } },
    });
    return res.status(200).json(formatResult(await anexarDetalhesLegados(grupos)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function atualizarGrupo(req, res) {
  try {
    const { id } = req.params;
    const campos = ["gru_num_part", "cat_id", "gru_nome", "gru_descricao", "gru_visibilidade", "gru_cor", "gru_icone", "men_id", "gru_num_vagas"];
    const dados = Object.fromEntries(campos.filter((campo) => req.body[campo] !== undefined).map((campo) => [campo, req.body[campo]]));
    if (dados.cat_id) {
      const cat = await prisma.categoria.findUnique({ where: { cat_id: dados.cat_id } });
      if (!cat) return res.status(400).json({ erro: "Categoria informada não existe." });
    }
    if (dados.men_id) {
      const mensalidade = await prisma.mensalidade.findUnique({ where: { men_id: dados.men_id } });
      if (!mensalidade) return res.status(400).json({ erro: "Mensalidade informada não existe." });
    }
    const atualizado = await prisma.grupo.update({ where: { gru_id: parseInt(id) }, data: dados });
    return res.status(200).json(formatResult(atualizado));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function deletarGrupo(req, res) {
  try {
    const { id } = req.params;
    await prisma.grupo.delete({ where: { gru_id: parseInt(id) } });
    return res.status(200).json({ mensagem: "Grupo deletado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

module.exports = {
  criarGrupo,
  listarGrupos,
  buscarPorId,
  buscarPorCategoriaNome,
  buscarPorQuantidade,
  procurarPorNomeGeral,
  atualizarGrupo,
  deletarGrupo,
};
