const bcrypt = require("bcrypt");
const prisma = require("../libs/prisma.js");

async function criarUsuarios(req, res) {
  try {
    const { name, email, cpf, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);

    const data = {
      user_nome: name,
      user_email: email,
      user_senha: hashpassword,
      user_cpf: cpf,
    };

    const emailExistente = await prisma.usuario.findUnique({
      where: { user_email: email },
    });

    if (emailExistente) {
      return res.status(400).send({ erro: "Email já cadastrado!" });
    }
    const cpfExistente = await prisma.usuario.findUnique({
      where: { user_cpf: cpf },
    });

    if (cpfExistente) {
      return res.status(400).send({ erro: "CPF já cadastrado!" });
    }
    const novoUsuario = await prisma.usuario.create({ data });

    const respostaFormatada = {
      ...novoUsuario,
      user_id: novoUsuario.user_id.toString(),
    };

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
      usuario: respostaFormatada,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ erro: "Erro interno.", detalhes: error.message });
  }
}

async function procurarCliepeloid(req, res) {
  const { user_id } = req.params;

  const result = await prisma.usuario.findUnique({
    where: { user_id },
  });
  if (result) {
    return res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          ),
        ),
      );
  } else {
    return res
      .status(500)
      .send({ msg: "Tabela vazia, nenhum registro encontrado!!" });
  }
}
async function procurarClirGeral(req, res) {
  const result = await prisma.usuario.findMany({
    orderBy: {
      user_id: "asc",
    },
  });
  if (result) {
    return res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          ),
        ),
      );
  } else {
    return res.status(404).send({
      msg: "Tabela vazia, nenhum registro encontrado!",
    });
  }
}
module.exports = { criarUsuarios, procurarCliepeloid, procurarClirGeral };
