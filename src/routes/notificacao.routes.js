const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/autenticar");
const {
  listarMinhasNotificacoes,
  contarNaoLidas,
  marcarComoLida,
  marcarTodasComoLidas,
} = require("../controllers/notificacao.controller.js");

router.get("/notificacoes", autenticar, listarMinhasNotificacoes);
router.get("/notificacoes/nao-lidas", autenticar, contarNaoLidas)
router.patch("/notificacoes/marcar-todas", autenticar, marcarTodasComoLidas);
router.patch("/notificacoes/:id/lida", autenticar, marcarComoLida);

module.exports = router;