const express = require("express");
const router = express.Router();
const path = require("path");

const {
  criarGrupo,
  listarGrupos,
  buscarPorId,
  buscarPorCategoriaNome,
  buscarPorQuantidade,
  procurarPorNomeGeral,
  atualizarGrupo,
  deletarGrupo,
} = require("../controllers/grupo.controller.js");


router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

router.get("/grupos/busca/categoria", buscarPorCategoriaNome);
router.get("/grupos/busca/nome", procurarPorNomeGeral);
router.get("/grupos/busca/quantidade/:num", buscarPorQuantidade);

// CRUD
router.post("/grupos", criarGrupo);
router.get("/grupos", listarGrupos);
router.get("/grupos/:id", buscarPorId);
router.put("/grupos/:id", atualizarGrupo);
router.delete("/grupos/:id", deletarGrupo);


module.exports = router;
