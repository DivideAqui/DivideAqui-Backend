import express from "express";


const routes = express.Router();

routes.get('/',(req,res)=>{
    return res.send('Olá rota raiz do backend-divideaqui');
});


export default routes;