const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient(); 

router.post("/auth/google", async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "accessToken obrigatório" });
    }

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

    const u = await prisma.usuario.upsert({
      where: { usu_email: p.email },
      update: { usu_foto: p.picture },
      create: {
        usu_nome: (p.name || "Usuário").slice(0, 50),
        usu_email: p.email,
        usu_foto: p.picture,
      },
    });

    res.json({
      id: String(u.usu_id),
      nome: u.usu_nome,
      email: u.usu_email,
      foto: u.usu_foto,
      cadastroCompleto: !!(u.usu_cpf && u.usu_data_nasc),
    });
  } catch (err) {
    console.error("ERRO AO SALVAR USUÁRIO:", err);
    res.status(500).json({ error: "Erro ao salvar usuário" });
  }
});

module.exports = router;