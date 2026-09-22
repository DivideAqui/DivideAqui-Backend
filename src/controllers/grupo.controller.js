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

    const novo = await prisma.grupo.create({ data: dados });
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
        categoria: true,
        mensalidade: true,
        participacoes: { include: { usuario: true } },
        _count: { select: { participacoes: true } },
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
      include: { categoria: true, mensalidade: true, participacoes: { include: { usuario: true } }, _count: { select: { participacoes: true } } },
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
      include: { categoria: true, mensalidade: true, participacoes: { include: { usuario: true } }, _count: { select: { participacoes: true } } },
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
      include: { categoria: true, mensalidade: true, participacoes: { include: { usuario: true } }, _count: { select: { participacoes: true } } },
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
        ],
      },
      include: { categoria: true, mensalidade: true, participacoes: { include: { usuario: true } }, _count: { select: { participacoes: true } } },
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
