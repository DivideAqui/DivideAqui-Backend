const prisma = require("../libs/prisma.js");

/**
 * Tipos de notificação e seus metadados visuais.
 * O backend envia apenas a "chave" (not_notificacao_tipo / icone / cor);
 * o frontend mapeia essa chave para o ícone e o estilo final.
 * Para adicionar um novo tipo: registre aqui + mapeie em
 * `src/components/notificacoes.tipos.ts` no frontend.
 */
const TIPOS_NOTIFICACAO = {
  WELCOME: {
    titulo: "Bem-vindo ao DivideAqui",
    icone: "welcome",
    cor: "#B8FB3C",
  },
  PROFILE_SUGGESTION: {
    titulo: "Complete seu perfil",
    icone: "profile",
    cor: "#053CC8",
  },
  DIVISAO_CRIADA: {
    titulo: "Divisão criada",
    icone: "created",
    cor: "#79C734",
  },
};

/**
 * Cria uma notificação. É o ponto de entrada único para disparar notificações
 * de qualquer parte do backend.
 *
 * @param {object} dados
 * @param {string|number|bigint} dados.usu_id  Usuário destinatário.
 * @param {string} dados.tipo                 Chave em TIPOS_NOTIFICACAO.
 * @param {string} [dados.titulo]             Sobrescreve o título padrão do tipo.
 * @param {string} dados.mensagem             Texto exibido (sem os destaques).
 * @param {string[]} [dados.destaques]        Trechos do texto a exibir em negrito.
 * @param {number} [dados.gru_id]             Divisão relacionada (opcional).
 * @param {object} [dados.client]             Cliente Prisma (para usar dentro de transação).
 * @returns {Promise<object|null>} A notificação criada, ou null se inválida.
 */
async function criarNotificacao({
  usu_id,
  tipo,
  titulo,
  mensagem,
  destaques,
  gru_id,
  client = prisma,
}) {
  const usuarioId = BigInt(usu_id);
  const preset = TIPOS_NOTIFICACAO[tipo];

  if (!preset) {
    console.warn(`[notificacao.service] Tipo desconhecido: "${tipo}" — notificação ignorada.`);
    return null;
  }

  const dados = {
    not_user_id: usuarioId,
    not_notificacao_tipo: tipo,
    not_notificacao_titulo: (titulo ?? preset.titulo).slice(0, 255),
    not_notificacao_mensagem: mensagem ?? preset.titulo,
    not_notificacao_destaques: destaques?.length ? destaques : null,
    not_notificacao_icone: preset.icone,
    not_notificacao_cor: preset.cor,
    not_gru_id: gru_id ?? null,
  };

  return client.notificacao.create({ data: dados });
}

/**
 * Dispara a notificação de boas-vindas no login — apenas uma vez por dia.
 * Verifica se já existe uma WELCOME criada a partir do início do dia de hoje.
 */
async function criarNotificacaoBoasVindas(usu_id, client = prisma) {
  const inicioDeHoje = new Date();
  inicioDeHoje.setHours(0, 0, 0, 0);

  const jaCriadaHoje = await client.notificacao.findFirst({
    where: {
      not_user_id: BigInt(usu_id),
      not_notificacao_tipo: "WELCOME",
      not_notificacao_data: { gte: inicioDeHoje },
    },
    select: { not_notificacao_id: true },
  });

  if (jaCriadaHoje) {
    return null;
  }

  return criarNotificacao({
    usu_id,
    tipo: "WELCOME",
    mensagem: "Que bom ter você de volta! Seu espaço para dividir contas está pronto.",
    client,
  });
}

/**
 * Dispara a notificação sugerindo completar o perfil — apenas se:
 *  1) o perfil estiver de fato incompleto (falta cpf, data de nascimento ou telefone);
 *  2) ainda não existir uma PROFILE_SUGGESTION não lida para este usuário.
 */
async function criarNotificacaoPerfilIncompleto(usuario, client = prisma) {
  const { usu_id, usu_cpf, usu_data_nasc, usu_telefone } = usuario;
  const perfilCompleto = !!(usu_cpf && usu_data_nasc && usu_telefone);

  if (perfilCompleto) {
    return null;
  }

  const jaSugerida = await client.notificacao.findFirst({
    where: {
      not_user_id: BigInt(usu_id),
      not_notificacao_tipo: "PROFILE_SUGGESTION",
      not_notificacao_lida: false,
    },
    select: { not_notificacao_id: true },
  });

  if (jaSugerida) {
    return null;
  }

  return criarNotificacao({
    usu_id,
    tipo: "PROFILE_SUGGESTION",
    mensagem:
      "Complete seu perfil para ter uma experiência melhor ao dividir contas com seus amigos.",
    client,
  });
}

module.exports = {
  TIPOS_NOTIFICACAO,
  criarNotificacao,
  criarNotificacaoBoasVindas,
  criarNotificacaoPerfilIncompleto,
};