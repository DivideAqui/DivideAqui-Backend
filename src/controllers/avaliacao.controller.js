const prisma = require("../libs/prisma.js");

async function criarAvaliacao(req, res) {
  const nota = req.body.ava_nota;
  const descricao = req.body.ava_descricao ?? null;
  const avaliado = Number(req.body.ava_avaliado);
  const grupo = Number(req.body.ava_grupo);
  const avaliador = Number(req.usuario?.id);

  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return res.status(400).json({ erro: "A nota deve ser um número inteiro entre 1 e 5." });
  }
  if (descricao !== null && (typeof descricao !== "string" || descricao.length > 200)) {
    return res.status(400).json({ erro: "A descrição deve ter no máximo 200 caracteres." });
  }
  if (!Number.isInteger(avaliado) || avaliado < 1 || !Number.isInteger(grupo) || grupo < 1 || !Number.isInteger(avaliador) || avaliador < 1) {
    return res.status(400).json({ erro: "Avaliador, avaliado e grupo são obrigatórios." });
  }

  try {
    const [usuarioExistente, avaliadorExistente, grupoExistente] = await Promise.all([
      prisma.usuario.findUnique({ where: { usu_id: avaliado }, select: { usu_id: true } }),
      prisma.usuario.findUnique({ where: { usu_id: avaliador }, select: { usu_id: true } }),
      prisma.grupo.findUnique({ where: { gru_id: grupo }, select: { gru_id: true } }),
    ]);
    if (!usuarioExistente || !avaliadorExistente || !grupoExistente) {
      return res.status(400).json({ erro: "Avaliador, usuário avaliado ou grupo não encontrado." });
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        ava_nota: nota,
        ava_descricao: descricao,
        ava_avaliado: avaliado,
        ava_avaliador: avaliador,
        ava_grupo: grupo,
      },
    });
    return res.status(201).json(avaliacao);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível criar a avaliação." });
  }
}

async function buscarMediaAvaliacao(req, res) {
  const usuario = Number(req.params.user_id);
  if (!Number.isInteger(usuario) || usuario < 1) {
    return res.status(400).json({ erro: "ID de usuário inválido." });
  }

  try {
    const [resultado] = await prisma.avaliacao.groupBy({
      by: ["ava_avaliado"],
      where: { ava_avaliado: usuario },
      _avg: { ava_nota: true },
      _count: { ava_id: true },
    });
    return res.status(200).json({
      ava_avaliado: usuario,
      media: resultado?._avg.ava_nota ?? null,
      quantidade: resultado?._count.ava_id ?? 0,
      mensagem: resultado ? null : "Sem avaliações",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Não foi possível consultar as avaliações." });
  }
}

module.exports = { criarAvaliacao, buscarMediaAvaliacao };
