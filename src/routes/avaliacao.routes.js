const express = require("express");
const router = express.Router();
const path = require("path");
const autenticar = require('../middlewares/autenticar');

const {
  criarAvaliacao,
  buscarMediaAvaliacao,
  buscarAvaliacoesRecebidas,
  deletarAvaliacao
} = require("../controllers/avaliacao.controller.js");


router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// CRUD
router.post("/avaliacoes", autenticar, criarAvaliacao);
router.get("/avaliacoes/:user_id/media", autenticar, buscarMediaAvaliacao);
router.get("/avaliacoes/:user_id", autenticar, buscarAvaliacoesRecebidas);
router.delete("/avaliacoes/:id", autenticar, deletarAvaliacao);


module.exports = router;