const express = require("express");
const router = express.Router();

const { criarUsuarios, procurarCliepeloid, procurarClirGeral } = require("../controllers/usuario.controller.js");

router.post("/usuariosCad", criarUsuarios);
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
router.get("/usuario/:user_id", procurarCliepeloid);
router.get("/usuarioid", procurarClirGeral);
module.exports = router;
