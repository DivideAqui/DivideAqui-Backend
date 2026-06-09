// import export

import express from "express";
import routes from "./src/routes/routes.js";

const app = express();
app.use(express.json()); 
app.use(express.static('assets'));
app.use(express.static('src'));
app.use(express.static('public'));
app.use(routes);

app.listen(3344, () => { console.log('Servidor ON - Porta 3344'); });
