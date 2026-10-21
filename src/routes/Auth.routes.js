const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const {
  criarNotificacaoBoasVindas,
  criarNotificacaoPerfilIncompleto,
} = require("../services/notificacao.service.js");

const router = express.Router();
const prisma = new PrismaClient();

function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.usu_id.toString(),
      email: usuario.usu_email,
      name: usuario.usu_nome,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

router.post("/auth/google", async (req, res) => {
  try {
    const accessToken = req.body?.accessToken;
    const idToken = req.body?.idToken ?? req.body?.credential;

    if (!accessToken && !idToken) {
      return res.status(400).json({ error: "accessToken ou idToken obrigatório" });
    }

    let email;
    let nome;
    let foto;

    if (accessToken) {
      const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!r.ok) {
        return res.status(401).json({ error: "Token do Google inválido" });
      }
      const p = await r.json();
      if (!p.email || !p.email_verified) {
        return res.status(401).json({ error: "E-mail não verificado" });
      }
      email = p.email;
      nome = p.name;
      foto = p.picture;
    } else {
      const r = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
      );
      if (!r.ok) {
        return res.status(401).json({ error: "ID token do Google inválido" });
      }
      const p = await r.json();
      if (!p.email || !p.email_verified) {
        return res.status(401).json({ error: "E-mail não verificado" });
      }
      email = p.email;
      nome = p.name;
      foto = p.picture;
    }

    const u = await prisma.usuario.upsert({
      where: { usu_email: email },
      update: { usu_foto: foto },
      create: {
        usu_nome: (nome || "Usuário").slice(0, 50),
        usu_email: email,
        usu_foto: foto,
      },
    });

    await Promise.all([
      criarNotificacaoBoasVindas(u.usu_id).catch(() => null),
      criarNotificacaoPerfilIncompleto(u).catch(() => null),
    ]).catch(() => null);

    return res.json({
      id: String(u.usu_id),
      nome: u.usu_nome,
      email: u.usu_email,
      foto: u.usu_foto,
      cadastroCompleto: !!(u.usu_cpf && u.usu_data_nasc),
      token: gerarToken(u),
    });
  } catch (err) {
    console.error("ERRO AO SALVAR USUÁRIO:", err);
    return res.status(500).json({ error: "Erro ao salvar usuário" });
  }
});

module.exports = router;