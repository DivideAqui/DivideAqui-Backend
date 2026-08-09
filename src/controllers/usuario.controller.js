const bcrypt = require("bcrypt");
const prisma = require("../libs/prisma.js");
const jwt = require("jsonwebtoken");

function converterDataBR(dataBR) {
  if (!dataBR || !dataBR.includes("/")) {
    throw new Error("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
  }
  const [dia, mes, ano] = dataBR.split("/");
  return new Date(`${ano}-${mes}-${dia}`);
}

async function criarUsuarios(req, res) {
  try {
    const { name, email, cpf, password, telefone, data_nasc, avali } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);

    const data = {
      usu_nome: name,
      usu_email: email,
      usu_senha: hashpassword,
      usu_cpf: cpf,
      usu_telefone: telefone,
      usu_data_nasc: converterDataBR(data_nasc),
      usu_avaliacao: avali,
    };

    const emailExistente = await prisma.usuario.findUnique({
      where: { usu_email: email },
    });

    if (emailExistente) {
      return res.status(400).send({ erro: "Email já cadastrado!" });
    }
    const cpfExistente = await prisma.usuario.findUnique({
      where: { usu_cpf: cpf },
    });

    if (cpfExistente) {
      return res.status(400).send({ erro: "CPF já cadastrado!" });
    }
    const novoUsuario = await prisma.usuario.create({ data });

    const respostaFormatada = {
      usu_id: novoUsuario.usu_id.toString(),
      usu_nome: novoUsuario.usu_nome,
      usu_email: novoUsuario.usu_email,
      usu_cpf: novoUsuario.usu_cpf,
      usu_telefone: novoUsuario.usu_telefone,
      usu_data_nasc: novoUsuario.usu_data_nasc,
      usu_avaliacao: novoUsuario.usu_avaliacao,
    };

    const token = jwt.sign(
      {
        id: novoUsuario.usu_id.toString(),
        email: novoUsuario.usu_email,
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
    where: { usu_id: user_id },
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
      usu_id: "asc",
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
  if (email) condicoes.push({ usu_email: email });
  if (cpf) condicoes.push({ usu_cpf: cpf });

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
  const senhaValida = await bcrypt.compare(password, userExistente.usu_senha);

  if (!senhaValida) {
    return res.status(401).json({
      erro: "Não conseguimos encontrar sua conta com esses dados. Verifique as informações e tente de novo.",
    });
  }
  const token = jwt.sign(
    {
      id: userExistente.usu_id.toString(),
      email: userExistente.usu_email,
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
