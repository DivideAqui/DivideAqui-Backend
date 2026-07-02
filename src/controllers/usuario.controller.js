const bcrypt = require("bcrypt");
const prisma = require("../libs/prisma.js");
const jwt = require("jsonwebtoken");

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
      user_id: novoUsuario.user_id.toString(),
      user_nome: novoUsuario.user_nome,
      user_email: novoUsuario.user_email,
      user_cpf: novoUsuario.user_cpf,
    };

    const token = jwt.sign(
      {
        id: novoUsuario.user_id.toString(),
        email: novoUsuario.user_email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
      usuario: respostaFormatada,
      token,
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
async function loginUsuario(req, res) {
  const { email, cpf, password } = req.body;

  if (!password || (!email && !cpf)) {
    return res.status(400).json({
      erro: "Para fazer o login, você deve fornecer a senha e ao menos o e-mail ou o CPF.",
    });
  }
  const condicoes = [];
  if (email) condicoes.push({ user_email: email });
  if (cpf) condicoes.push({ user_cpf: cpf });

  const userExistente = await prisma.usuario.findFirst({
    where: {
      OR: condicoes,
    },
  });
  if (!userExistente) {
    return res.status(401).json({
      erro: "Não conseguimos encontrar sua conta com esses dados. Verifique as informações e tente de novo.",
    });
  }
  const senhaValida = await bcrypt.compare(password, userExistente.user_senha);

  if (!senhaValida) {
    return res.status(401).json({
      erro: "Não conseguimos encontrar sua conta com esses dados. Verifique as informações e tente de novo.",
    });
  }
  const token = jwt.sign(
    {
      id: userExistente.user_id.toString(),
      email: userExistente.user_email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  return res.status(200).json({ token });
}
module.exports = {
  criarUsuarios,
  procurarCliepeloid,
  procurarClirGeral,
  loginUsuario,
};
