const express = require("express");
const cors = require("cors");
const routes = require("./routes/usuario.routes");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json()); // ← faltava os ()
app.use("/", routes); // ← faltava registrar as rotas

module.exports = app;
