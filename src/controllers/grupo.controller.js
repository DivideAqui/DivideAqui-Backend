const prisma = require("../libs/prisma.js");

function formatResult(result) {
  return JSON.parse(
    JSON.stringify(result, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

async function criarGrupo(req, res) {
  try {
    const { gru_num_part, lid_id, cat_id } = req.body;
    if (!gru_num_part || !lid_id || !cat_id) {
      return res.status(400).json({ erro: "Parâmetros obrigatórios ausentes." });
    }

    const liderExistente = await prisma.lider.findUnique({ where: { lid_id } });
    if (!liderExistente) {
      return res.status(400).json({ erro: "Líder não encontrado." });
    }
    const categoriaExistente = await prisma.categoria.findUnique({ where: { cat_id } });
    if (!categoriaExistente) {
      return res.status(400).json({ erro: "Categoria não encontrada." });
    }

    const novo = await prisma.grupo.create({ data: { gru_num_part, lid_id, cat_id } });
    return res.status(201).json(formatResult(novo));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function listarGrupos(req, res) {
  try {
    const grupos = await prisma.grupo.findMany({
      include: {
        lider: { include: { usuario: true } },
        categoria: true,
        _count: { select: { participantes: true } },
      },
      orderBy: { gru_id: "asc" },
    });
    return res.status(200).json(formatResult(grupos));
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
      include: { lider: { include: { usuario: true } }, categoria: true, participantes: true, _count: { select: { participantes: true } } },
    });
    if (!grupo) return res.status(404).json({ erro: "Grupo não encontrado." });
    return res.status(200).json(formatResult(grupo));
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
      include: { lider: { include: { usuario: true } }, categoria: true, _count: { select: { participantes: true } } },
    });
    return res.status(200).json(formatResult(grupos));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function buscarPorLiderNome(req, res) {
  try {
    const { nome } = req.query;
    if (!nome) return res.status(400).json({ erro: "Parametro 'nome' é obrigatório." });
    const grupos = await prisma.grupo.findMany({
      where: { lider: { usuario: { usu_nome: { contains: nome, mode: "insensitive" } } } },
      include: { lider: { include: { usuario: true } }, categoria: true, _count: { select: { participantes: true } } },
    });
    return res.status(200).json(formatResult(grupos));
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
      include: { lider: { include: { usuario: true } }, categoria: true, _count: { select: { participantes: true } } },
    });
    return res.status(200).json(formatResult(grupos));
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
          { lider: { usuario: { usu_nome: { contains: nome, mode: "insensitive" } } } },
        ],
      },
      include: { lider: { include: { usuario: true } }, categoria: true, _count: { select: { participantes: true } } },
    });
    return res.status(200).json(formatResult(grupos));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function atualizarGrupo(req, res) {
  try {
    const { id } = req.params;
    const dados = req.body;
    if (dados.lid_id) {
      const lid = await prisma.lider.findUnique({ where: { lid_id: dados.lid_id } });
      if (!lid) return res.status(400).json({ erro: "Líder informado não existe." });
    }
    if (dados.cat_id) {
      const cat = await prisma.categoria.findUnique({ where: { cat_id: dados.cat_id } });
      if (!cat) return res.status(400).json({ erro: "Categoria informada não existe." });
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
  buscarPorLiderNome,
  buscarPorQuantidade,
  procurarPorNomeGeral,
  atualizarGrupo,
  deletarGrupo,
};
