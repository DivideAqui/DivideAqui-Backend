const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

// Middleware de autenticação
const autenticar = require("../middlewares/autenticar");

// POST /api/chat - Chat com a IA
router.post("/api/chat", autenticar, chatController.enviarMensagem);

module.exports = router;
