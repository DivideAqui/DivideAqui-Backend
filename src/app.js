BigInt.prototype.toJSON = function () {
  return this.toString();
};

const express = require("express");
const cors = require("cors");
const routes = require("./routes/usuario.routes");
const grupoRoutes = require("./routes/grupo.routes");
const avaliacaoRoutes = require("./routes/avaliacao.routes");
const chatRoutes = require("./routes/chat.routes");
const authRoutes = require("./routes/Auth.routes");
const historicoRoutes = require("./routes/historico.routes");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/", routes);
app.use("/", grupoRoutes);
app.use("/", avaliacaoRoutes);
app.use("/", chatRoutes);
app.use("/", authRoutes);
app.use("/historico", historicoRoutes);

module.exports = app;
