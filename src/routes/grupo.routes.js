const express = require("express");
const router = express.Router();
const path = require("path");

const {
  criarGrupo,
  listarGrupos,
  buscarPorId,
  buscarPorCategoriaNome,
  buscarPorLiderNome,
  buscarPorQuantidade,
  procurarPorNomeGeral,
  atualizarGrupo,
  deletarGrupo,
} = require("../controllers/grupo.controller.js");


router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// CRUD
router.post("/grupos", criarGrupo);
router.get("/grupos", listarGrupos);
router.get("/grupos/:id", buscarPorId);
router.put("/grupos/:id", atualizarGrupo);
router.delete("/grupos/:id", deletarGrupo);

// Buscas específicas (usam LIKE )
router.get("/grupos/busca/categoria", buscarPorCategoriaNome); // ?nome=
router.get("/grupos/busca/lider", buscarPorLiderNome); // ?nome=
router.get("/grupos/busca/nome", procurarPorNomeGeral); // ?nome=  (procura em categoria e criador)
router.get("/grupos/busca/quantidade/:num", buscarPorQuantidade);

module.exports = router;
