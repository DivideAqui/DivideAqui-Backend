const prisma = require("../libs/prisma.js");

async function criarAvaliacao(req, res) {
const nota = req.body.ava_nota;
const descricao = req.body.ava_descricao ?? null;
const avaliado = Number(req.body.ava_avaliado);
const avaliador = Number(req.usuario?.id);

if (nota < 1 || nota > 5 || !Number.isInteger(nota)) {
  return res.status(400).json({
    erro: "A nota deve ser um número inteiro entre 1 e 5."
  });
}

if (descricao !== null && (typeof descricao !== "string" || descricao.length > 200)) {
  return res.status(400).json({
    erro: "A descrição deve ter no máximo 200 caracteres."
});
}

if (!Number.isInteger(avaliado) || avaliado < 1 ||
!Number.isInteger(avaliador) || avaliador < 1) {
  return res.status(400).json({
    erro: "Avaliador e usuário avaliado são obrigatórios."
});
}

if (avaliado === avaliador) {
  return res.status(400).json({
    erro: "Não é permitido avaliar a si mesmo."
});
}

try {
/* Verifica se os dois usuários existem.*/
const [usuarioExistente, avaliadorExistente] = await Promise.all([
  prisma.usuario.findUnique({
  where: {usu_id: avaliado},
  select: {usu_id: true}
}),

    prisma.usuario.findUnique({
      where: {usu_id: avaliador},
      select: {usu_id: true}
    })
  ]);

if (!usuarioExistente || !avaliadorExistente) {
  return res.status(400).json({
    erro: "Avaliador ou usuário avaliado não encontrado."
  });
}

/* Verifica se o avaliador e o avaliado já participaram de pelo menos um grupo em comum.*/
const grupoEmComum = await prisma.participar.findFirst({
    where: { usu_id: avaliador,
      gru_id: {
        in: ( await prisma.participar.findMany({
            where: {usu_id: avaliado},
            select: {gru_id: true}
          })
        ).map(
          (participacao) => participacao.gru_id
        )
      }
    },

    select: {gru_id: true}
  });

/* Se não existe nenhum grupo em comum, a avaliação não pode ser criada.*/
if (!grupoEmComum) {
  return res.status(403).json({
    erro: "Você só pode avaliar um usuário com quem já participou de algum grupo."
  });
}

/* Verifica se o avaliador já avaliou esse usuário anteriormente.*/
const avaliacaoExistente = await prisma.avaliacao.findFirst({
    where: {ava_avaliador: avaliador,ava_avaliado: avaliado
  },
    select: {ava_id: true}
  });

if (avaliacaoExistente) {
  return res.status(409).json({
    erro: "Você já avaliou este usuário."
  });
}

/* Cria a avaliação */
const avaliacao = await prisma.avaliacao.create({
    data: {
      ava_nota: nota,
      ava_descricao: descricao,
      ava_avaliado: avaliado,
      ava_avaliador: avaliador
    }
  });

return res.status(201).json(avaliacao);
} catch (error) {
console.error(error);

return res.status(500).json({
  erro: "Não foi possível criar a avaliação."
});

}
}

async function buscarMediaAvaliacao(req, res) {
  const usuario = Number(req.params.user_id);

if (!Number.isInteger(usuario) || usuario < 1) {
return res.status(400).json({
  erro: "ID de usuário inválido."
});
}

try {
const resultado = await prisma.avaliacao.aggregate({
where: {ava_avaliado: usuario},
    _avg: {ava_nota: true},
    _count: {ava_id: true}
  });

const media = resultado._avg.ava_nota !== null
    ? Math.round(resultado._avg.ava_nota) : 0;

return res.status(200).json({
  ava_avaliado: usuario,
  media,
  quantidade: resultado._count.ava_id,
  mensagem: resultado._count.ava_id > 0? null : "Sem avaliações"
});

} catch (error) {
console.error(error);
return res.status(500).json({
  erro:"Não foi possível consultar as avaliações."
});

}
}

async function buscarAvaliacoesRecebidas(req,res) {
  const usuario = Number(req.params.user_id);

if (!Number.isInteger(usuario) || usuario < 1) {
return res.status(400).json({
  erro: "ID de usuário inválido."
});
}

try {const avaliacoes =await prisma.avaliacao.findMany({ where: {ava_avaliado: usuario},

    select: {
      ava_id: true,
      ava_nota: true,
      ava_descricao: true,
      ava_avaliador: true,

      usuario_avaliacao_ava_avaliadorTousuario:
        {
          select: {
            usu_id: true,
            usu_nome: true,
            usu_foto: true
          }
        }
    },

    orderBy: {ava_id: "desc"}
  });

return res.status(200).json({
  ava_avaliado: usuario,
  quantidade: avaliacoes.length,
  avaliacoes
});
} catch (error) {
console.error(error);
return res.status(500).json({
  erro:"Não foi possível consultar as avaliações recebidas."
});

}
}

async function deletarAvaliacao(req, res) {
  const id = Number(req.params.id);
  const usuarioId = Number(req.usuario?.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
    erro: "ID de avaliação inválido."
  });
  }

  if (!Number.isInteger(usuarioId) || usuarioId < 1) {
    return res.status(401).json({
    erro: "Usuário não autenticado."});
  }

  try {
  const avaliacao = await prisma.avaliacao.findUnique({
  where: {ava_id: id},
      select: {ava_avaliador: true}
    });

  if (!avaliacao) {
    return res.status(404).json({
      erro: "Avaliação não encontrada."});
  }

  if (Number(avaliacao.ava_avaliador) !== usuarioId) {
    return res.status(403).json({
      erro:"Somente o avaliador pode excluir esta avaliação."});
  }

  await prisma.avaliacao.delete({
    where: {ava_id: id}
  });

  return res.status(200).json({
    mensagem:"Avaliação excluída com sucesso."
  });
  } catch (error) {
  console.error(error);

  return res.status(500).json({
    erro:"Não foi possível excluir a avaliação."});

  }
  }

module.exports = { criarAvaliacao,buscarMediaAvaliacao,buscarAvaliacoesRecebidas,deletarAvaliacao };