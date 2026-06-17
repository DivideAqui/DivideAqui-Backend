const express = require("express");
const router = express.Router();
const autenticar = require('../middlewares/autenticar');

const { criarUsuarios, procurarCliepeloid, procurarClirGeral, loginUsuario } = require("../controllers/usuario.controller.js");

//Post
router.post("/Cadastro", criarUsuarios);
router.post("/Login", loginUsuario);

//Get
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
router.get("/usuario/:user_id", procurarCliepeloid);
router.get("/usuarioid", procurarClirGeral);
router.get("/perfil", autenticar, (req, res)=>{
  res.json({ usuario: req.usuario });
})
module.exports = router;
