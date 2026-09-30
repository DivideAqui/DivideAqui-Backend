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
  const viagens = await cliente.$queryRaw`SELECT "gru_id", "via_partida", "via_destino", "via_data_inicio", "via_data_fim" FROM "viagem" WHERE "gru_id" IN (${Prisma.join(ids)})`;
  const viagensPorGrupo = new Map(viagens.map((viagem) => [viagem.gru_id, viagem]));

  return grupos.map((grupo) => ({
    ...grupo,
    viagem: viagensPorGrupo.get(grupo.gru_id) ?? null,
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
    const creatorId = req.body.gru_criador_id === undefined ? null : Number(req.body.gru_criador_id);
    const creatorName = typeof req.body.gru_criador_nome === "string"
      ? req.body.gru_criador_nome.trim().slice(0, 50)
      : "";
    if (creatorId !== null && (!Number.isInteger(creatorId) || creatorId < 1)) {
      return res.status(400).json({ erro: "ID do criador inválido." });
    }
    if (creatorId !== null) {
      const creatorExists = await prisma.usuario.findUnique({ where: { usu_id: creatorId }, select: { usu_id: true } });
      if (!creatorExists) return res.status(400).json({ erro: "Usuário criador não encontrado." });
    }

    const itensRecebidos = req.body.itens ?? [];
    if (!Array.isArray(itensRecebidos)) {
      return res.status(400).json({ erro: "A lista de despesas deve ser um array." });
    }
    const itens = [];
    for (const [indice, item] of itensRecebidos.entries()) {
      const nome = typeof item?.ite_nome === "string" ? item.ite_nome.trim() : "";
      const valor = Number(item?.ite_valor);
      const participantesRecebidos = item?.usu_ids;
      if (participantesRecebidos !== undefined && !Array.isArray(participantesRecebidos)) {
        return res.status(400).json({ erro: `Os participantes da despesa ${indice + 1} são inválidos.` });
      }
      const participantes = participantesRecebidos === undefined
        ? (creatorId === null ? [] : [creatorId])
        : [...new Set(participantesRecebidos.map(Number))];

      if (!nome || nome.length > 100 || !Number.isFinite(valor) || valor < 0) {
        return res.status(400).json({ erro: `A despesa ${indice + 1} precisa de nome e valor válido.` });
      }
      if (participantes.some((id) => !Number.isInteger(id) || id < 1)) {
        return res.status(400).json({ erro: `Os participantes da despesa ${indice + 1} são inválidos.` });
      }
      itens.push({ nome, valor, participantes });
    }

    dados.gru_criador_id = creatorId;
    dados.gru_criador_nome = creatorName || null;
    dados.gru_num_vagas = Math.max(0, Number(dados.gru_num_part) - 1);

    if (dados.cat_id === 1 && detalhes.str_telas !== null && detalhes.str_telas !== undefined) {
      const limiteTelas = Number(detalhes.str_telas);
      if (!Number.isInteger(limiteTelas) || limiteTelas < 1 || Number(dados.gru_num_part) > limiteTelas) {
        return res.status(400).json({ erro: "O número de participantes excede o limite de telas do plano." });
      }
    }

    const novo = await prisma.$transaction(async (tx) => {
      const grupo = await tx.grupo.create({ data: dados });

      if (creatorId !== null) {
        await tx.participar.create({ data: { usu_id: creatorId, gru_id: grupo.gru_id } });
      }

      for (const item of itens) {
        if (item.participantes.length > 0) {
          const participacoes = await tx.participar.findMany({
            where: { gru_id: grupo.gru_id, usu_id: { in: item.participantes } },
            select: { usu_id: true },
          });
          if (participacoes.length !== item.participantes.length) {
            const erro = new Error("Cada participante da despesa precisa pertencer ao grupo.");
            erro.statusCode = 400;
            throw erro;
          }
        }

        const novoItem = await tx.item.create({
          data: {
            ite_nome: item.nome,
            ite_valor: item.valor,
            gru_id: grupo.gru_id,
          },
        });
        if (item.participantes.length > 0) {
          await tx.item_usuario.createMany({
            data: item.participantes.map((usu_id) => ({ ite_id: novoItem.ite_id, usu_id })),
            skipDuplicates: true,
          });
        }
      }

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
            str_plano: typeof detalhes.str_plano === "string" ? detalhes.str_plano.slice(0, 100) : null,
            str_telas: detalhes.str_telas == null ? null : Number(detalhes.str_telas),
            str_valor: Number(detalhes.str_valor),
          },
        });
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
        criador: { select: { usu_id: true, usu_nome: true } },
        item: { select: { ite_valor: true } },
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
     include: {
    categoria: true,
    mensalidade: true,
    stream: true,
    criador: { select: { usu_id: true, usu_nome: true } },
    item: { select: { ite_valor: true } },
    participacoes: {
      include: {
        usuario: { select: { usu_id: true, usu_nome: true } },
      },
    },
    _count: { select: { participacoes: true } },
  },
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
      include: { categoria: true, mensalidade: true, criador: { select: { usu_id: true, usu_nome: true } }, item: { select: { ite_valor: true } }, _count: { select: { participacoes: true } } },
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
      include: { categoria: true, mensalidade: true, criador: { select: { usu_id: true, usu_nome: true } }, item: { select: { ite_valor: true } }, _count: { select: { participacoes: true } } },
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
      include: { categoria: true, mensalidade: true, criador: { select: { usu_id: true, usu_nome: true } }, item: { select: { ite_valor: true } }, _count: { select: { participacoes: true } } },
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