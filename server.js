// import export

import express from "express";
import routes from "./routes.js";

const app = express();
app.use(routes)

app.listen('3344', ()=>{console.log('Servidor ON - Porta 3344')});
