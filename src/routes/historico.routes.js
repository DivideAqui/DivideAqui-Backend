const express = require("express");
const router = express.Router();

const { historicoUsuario } = require("../controllers/historico.controller");
const autenticar = require("../middlewares/autenticar");

router.get("/", autenticar, historicoUsuario);

module.exports = router;
