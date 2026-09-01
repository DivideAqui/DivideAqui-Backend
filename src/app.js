const express = require("express");
const cors = require("cors");
const routes = require("./routes/usuario.routes");
const grupoRoutes = require("./routes/grupo.routes");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json()); 
app.use("/", routes); 
app.use("/", grupoRoutes);

module.exports = app;
