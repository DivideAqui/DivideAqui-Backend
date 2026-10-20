// CONTROLLER TEMPORÁRIO

const prisma = require("../libs/prisma.js");

// Formata datas no padrão brasileiro
function formatarData(data) {
  if (!data) return "00/00/0000";

  const dataObj = new Date(data);

  if (isNaN(dataObj.getTime())) {
    return "00/00/0000";
  }

  const dia = String(dataObj.getUTCDate()).padStart(2, "0");
  const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0");
  const ano = dataObj.getUTCFullYear();

  return `${dia}/${mes}/${ano}`;
}

// Formata valores monetários
function formatarValor(valor) {
  if (valor === null || valor === undefined) {
    return "R$ 0,00";
  }

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Busca o histórico financeiro do usuário logado
async function historicoUsuario(req, res) {
  try {
    const usu_id = BigInt(req.usuario.id);

    // Busca as divisões das quais o usuário participa
    const participacoes = await prisma.participar.findMany({
      where: {
        usu_id: usu_id,
      },
      include: {
        grupo: {
          include: {
            mensalidade: true,
            stream: true,
            item: true,
          },
        },
      },
    });

    // Monta os dados que serão enviados ao frontend
    const historico = participacoes.map((participacao) => {
      const grupo = participacao.grupo;
      const mensalidade = grupo.mensalidade;

      const dataVencimento = mensalidade?.men_data_ven;

      // Verifica o status da mensalidade
      let status = mensalidade?.men_status_pag;

      if (status) {
        status = String(status).toLowerCase().trim();

        if (status === "pago") {
          status = "Pago";
        } else if (status === "atrasado") {
          status = "Atrasado";
        } else {
          status = "Pendente";
        }
      } else if (dataVencimento) {
        const vencimento = new Date(dataVencimento);
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);
        vencimento.setHours(0, 0, 0, 0);

        status = vencimento < hoje ? "Atrasado" : "Pendente";
      } else {
        status = "Pendente";
      }

      // Obtém o valor da mensalidade ou da divisão
      const valor =
        mensalidade?.men_valor ??
        grupo.stream?.str_valor ??
        grupo.item?.reduce(
          (total, item) => total + Number(item.ite_valor || 0),
          0
        ) ??
        0;

      return {
        grupo: grupo.gru_nome,
        pagamento: formatarValor(valor),
        dataPagamento: "00/00/0000",
        vencimento: formatarData(dataVencimento),
        status: status,
      };
    });

    return res.status(200).json({
      mensagem:
        historico.length === 0
          ? "Você ainda não participou de nenhuma divisão."
          : "Histórico carregado com sucesso.",
      historico,
    });
  } catch (erro) {
    console.error("Erro ao buscar histórico:", erro);

    return res.status(500).json({
      mensagem: "Erro ao carregar o histórico financeiro.",
    });
  }
}

module.exports = {
  historicoUsuario,
};
