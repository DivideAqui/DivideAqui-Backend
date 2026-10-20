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
    const { name, email, cpf, password, telefone, data_nasc } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);

    const data = {
      usu_nome: name,
      usu_email: email,
      usu_senha: hashpassword,
      usu_cpf: cpf,
      usu_telefone: telefone,
      usu_data_nasc: converterDataBR(data_nasc),
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
    };

    const token = jwt.sign(
      {
        id: novoUsuario.usu_id.toString(),
        email: novoUsuario.usu_email,
        name: novoUsuario.usu_nome
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

  const id = Number(user_id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: "ID de usuário inválido." });
  }

  const result = await prisma.usuario.findUnique({ where: { usu_id: id } });

  if (result) {
    const [avaliacao] = await prisma.avaliacao.groupBy({
      by: ["ava_avaliado"],
      where: { ava_avaliado: id },
      _avg: { ava_nota: true },
      _count: { ava_id: true },
    });

    return res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify({
            ...result,
            ava_media: avaliacao?._avg.ava_nota ?? null,
            ava_quantidade: avaliacao?._count.ava_id ?? 0,
            ava_mensagem: avaliacao ? null : "Sem avaliações",
          }, (key, value) =>
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
  const [usuarios, avaliacoes] = await Promise.all([
    prisma.usuario.findMany({ orderBy: { usu_id: "asc" } }),
    prisma.avaliacao.groupBy({
      by: ["ava_avaliado"],
      _avg: { ava_nota: true },
      _count: { ava_id: true },
    }),
  ]);

  const porUsuario = new Map(
    avaliacoes.map((avaliacao) => [avaliacao.ava_avaliado, avaliacao])
  );

  const result = usuarios.map((usuario) => {
    const avaliacao = porUsuario.get(usuario.usu_id);

    return {
      ...usuario,
      ava_media: avaliacao?._avg.ava_nota ?? null,
      ava_quantidade: avaliacao?._count.ava_id ?? 0,
      ava_mensagem: avaliacao ? null : "Sem avaliações",
    };
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


  if (cpf) {
    const limpo = String(cpf).replace(/\D/g, "");
    const formatado = limpo.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );

    condicoes.push(
      { usu_cpf: limpo },
      { usu_cpf: formatado }
    );
  }

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

  const senhaValida = await bcrypt.compare(
    password,
    userExistente.usu_senha
  );

  if (!senhaValida) {
    return res.status(401).json({
      erro: "Não conseguimos encontrar sua conta com esses dados. Verifique as informações e tente de novo.",
    });
  }

  const token = jwt.sign(
    {
      id: userExistente.usu_id.toString(),
      email: userExistente.usu_email,
      name: userExistente.usu_nome
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return res.status(200).json({ token });
}

async function atualizarUsu(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      password,
      telefone,
      avali,
      data_nasc,
      descri,
      foto,
    } = req.body || {};

    //Verifica se o usuário existe
    const usuarioId = Number(id);

    if (!Number.isInteger(usuarioId) || usuarioId < 1) {
      return res.status(400).json({
        error: "ID de usuário inválido",
      });
    }

    const existeUsu = await prisma.usuario.findUnique({
      where: { usu_id: usuarioId },
    });

    if (!existeUsu) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    // Data pra enviar pro back( falta a prr da descriççao cheio de odio)
    // Monta os campos que serão atualizados
    const data = {};

    if (name !== undefined) data.usu_nome = name;
    if (email !== undefined) data.usu_email = email;
    if (telefone !== undefined) data.usu_telefone = telefone;

    if (data_nasc !== undefined) {
      data.usu_data_nasc = data_nasc.includes("/")
    ? converterDataBR(data_nasc)
    : new Date(data_nasc);
}

    if (descri !== undefined) data.usu_descricao = descri;

    // hash de senha cheio de odio
    // Atualiza a senha com hash
    if (password) {
      data.usu_senha = await bcrypt.hash(password, 10);
    }

    // Adiciona a foto antes de verificar os campos
    if (foto !== undefined && foto !== null) {
      data.usu_foto = foto;
    }

    // Se nenhum campo foi enviado para atualizar
    // Verifica se algum campo foi enviado
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error: "Nenhum campo foi informado para atualizar",
      });
    }

    // Atualiza no banco de dados(vou pegar a prr da Data e jogar no back)
    // Salva as alterações no banco
    const atualizaBack = await prisma.usuario.update({
      where: { usu_id: usuarioId },
      data: data,
    });

    // Converte BigInt para string na resposta
    const resposta = JSON.parse(
      JSON.stringify(atualizaBack, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return res.status(200).json(resposta);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);

    return res.status(500).json({
      error: "Erro interno ao atualizar usuário",
    });
  }
}

async function compararSenha(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await prisma.usuario.findFirst({
      where: { usu_id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    const comparar = await bcrypt.compare(password, user.usu_senha);

    if (!comparar) {
      return res.status(401).json({
        erro: "Senha errada"
      });
    }

    return res.status(200).json({ comparar });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      erro: "Erro ao comparar senha"
    });
  }
}

module.exports = {
  criarUsuarios,
  procurarCliepeloid,
  procurarClirGeral,
  loginUsuario,
  atualizarUsu,
  compararSenha
};