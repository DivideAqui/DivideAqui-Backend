const prisma = require("../libs/prisma.js");

function formatResult(result) {
  return JSON.parse(
    JSON.stringify(result, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

/**
 * Resolve o ID do usuário autenticado a partir do payload do JWT.
 * @returns {bigint|null} O ID, ou null se ausente/inválido.
 */
function usuarioAutenticado(req) {
  const raw = req.usuario?.id ?? req.usuario?.sub;
  if (!raw || !/^\d+$/.test(String(raw))) {
    return null;
  }
  return BigInt(raw);
}

/**
 * GET /notificacoes
 * Lista as notificações do usuário autenticado, paginada e da mais
 * recente para a mais antiga.
 * Query: ?page=1&limit=20
 */
async function listarMinhasNotificacoes(req, res) {
  try {
    const usu_id = usuarioAutenticado(req);
    if (usu_id === null) {
      return res.status(401).json({ erro: "ID do usuário autenticado inválido." });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [notificacoes, total] = await Promise.all([
      prisma.notificacao.findMany({
        where: { not_user_id: usu_id },
        orderBy: { not_notificacao_data: "desc" },
        skip,
        take: limit,
      }),
      prisma.notificacao.count({ where: { not_user_id: usu_id } }),
    ]);

    return res.status(200).json({
      notificacoes: formatResult(notificacoes),
      paginacao: {
        page,
        limit,
        total,
        totalPaginas: Math.max(1, Math.ceil(total / limit)),
        temMais: skip + notificacoes.length < total,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: "Erro interno ao buscar suas notificações.",
      detalhes: error.message,
    });
  }
}

/**
 * GET /notificacoes/nao-lidas
 * Retorna a contagem de notificações não lidas do usuário autenticado.
 */
async function contarNaoLidas(req, res) {
  try {
    const usu_id = usuarioAutenticado(req);
    if (usu_id === null) {
      return res.status(401).json({ erro: "ID do usuário autenticado inválido." });
    }

    const count = await prisma.notificacao.count({
      where: { not_user_id: usu_id, not_notificacao_lida: false },
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: "Erro interno ao contar notificações não lidas.",
      detalhes: error.message,
    });
  }
}

/**
 * PATCH /notificacoes/:id/lida
 * Marca uma notificação específica como lida.
 * Só o dono da notificação pode marcá-la.
 */
async function marcarComoLida(req, res) {
  try {
    const { id } = req.params;
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({ erro: "ID da notificação inválido ou ausente." });
    }

    const usu_id = usuarioAutenticado(req);
    if (usu_id === null) {
      return res.status(401).json({ erro: "ID do usuário autenticado inválido." });
    }

    const notificacao = await prisma.notificacao.findUnique({
      where: { not_notificacao_id: parseInt(id) },
    });

    if (!notificacao) {
      return res.status(404).json({ erro: "Notificação não encontrada." });
    }

    if (notificacao.not_user_id !== usu_id) {
      return res.status(403).json({ erro: "Você não tem acesso a esta notificação." });
    }

    const atualizada = await prisma.notificacao.update({
      where: { not_notificacao_id: parseInt(id) },
      data: { not_notificacao_lida: true },
    });

    return res.status(200).json(formatResult(atualizada));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: "Erro interno ao marcar a notificação como lida.",
      detalhes: error.message,
    });
  }
}

/**
 * PATCH /notificacoes/marcar-todas
 * Marca todas as notificações do usuário autenticado como lidas.
 */
async function marcarTodasComoLidas(req, res) {
  try {
    const usu_id = usuarioAutenticado(req);
    if (usu_id === null) {
      return res.status(401).json({ erro: "ID do usuário autenticado inválido." });
    }

    const resultado = await prisma.notificacao.updateMany({
      where: { not_user_id: usu_id, not_notificacao_lida: false },
      data: { not_notificacao_lida: true },
    });

    return res.status(200).json({
      mensagem: "Notificações marcadas como lidas.",
      atualizadas: resultado.count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: "Erro interno ao marcar as notificações como lidas.",
      detalhes: error.message,
    });
  }
}

module.exports = {
  listarMinhasNotificacoes,
  contarNaoLidas,
  marcarComoLida,
  marcarTodasComoLidas,
};