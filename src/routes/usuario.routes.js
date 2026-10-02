const express = require("express");
const router = express.Router();
const path = require("path");
const autenticar = require('../middlewares/autenticar');
const { criarAvaliacao, buscarMediaAvaliacao } = require("../controllers/avaliacao.controller.js");

const { criarUsuarios, procurarCliepeloid, procurarClirGeral, loginUsuario, atualizarUsu, compararSenha } = require("../controllers/usuario.controller.js");

//Post
router.post("/Cadastro", criarUsuarios);
router.post("/Login", loginUsuario);
router.post("/avaliacoes", autenticar, criarAvaliacao);
router.post("/senhaCompare/:id", compararSenha)

//Get
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});
router.get("/usuario/:user_id", procurarCliepeloid);
router.get("/usuario/:user_id/avaliacao", buscarMediaAvaliacao);
router.get("/usuarioid", procurarClirGeral);
router.get("/perfil", autenticar, (req, res)=>{
  res.json({ usuario: req.usuario });
})


//patch
router.patch("/usuarioatualizar/:id", atualizarUsu)
module.exports = router;
