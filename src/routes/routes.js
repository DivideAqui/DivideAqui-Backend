import express from "express";
import UsuarioControllers from "../controller/usuarioControllers.js";

const routes = express.Router();

routes.get('/', (req, res) => {

  return res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Divideaqui - Interface do Backend</title>
      <link rel="stylesheet" href="/styles/documentation.css" />
    </head>
    <body>
      <main class="page">
        <section class="card1">
          <div class="hero">
            <img class="logo" src="/assets/iconeVerdeClaro.png">
            <div>
              <h1 class="title">Documentação do Backend</h1>
              <p class="subtitle">Organização de Rotas, Dados e Lógica do <b>DivideAqui</b>.</p>
            </div>
          </div>
        </section>

        <section class="card2">
          <p class="text-block">Abaixo estão as Rotas Públicas já configuradas no backend. O conteúdo desta página não inclui APIs fictícias, apenas a documentação das rotas reais.</p>
          <h2 class="section-title">Rotas Disponíveis</h2>
          <ul>
            <li><strong>GET /</strong> — Interface de apresentação do backend e documentação básica.</li>
            <li><strong>GET /cadastro</strong> — Interface de cadastro de usuários.</li>
            <li><strong>POST /usuarioCadastro</strong> — Criação de novo usuário.</li>
            <li><strong>GET /usuarios</strong> — Listagem de usuários.</li>
          </ul>
        </section>
      </main>

      <footer>Backend ativo.</footer>

    </body>

    </html>
  `);
});

routes.get('/cadastro',(req,res)=>{
   return res.send(`
     <!DOCTYPE html>
    <html lang="pt-BR">
     <head>
      <meta charset="UTF-8" />
      <title>Cadastro de Usuário</title>
    </head>
    <body>
      <h1>Cadastro</h1>
      <form id="form">
        <input type="text" id="nome" placeholder="Nome" /><br/><br/>
        <input type="email" id="email" placeholder="Email" /><br/><br/>
        <input type="password" id="senha" placeholder="Senha" /><br/><br/>
        <button type="submit">Cadastrar</button>
      </form>

      <script>
        document.getElementById('form').addEventListener('submit', async(e) =>{
            e.preventDefault();
               const res = await fetch('/UsuarioCadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: document.getElementById('nome').value,
              email: document.getElementById('email').value,
              senha: document.getElementById('senha').value,
            })
          });
          const data = await res.json();
          alert(JSON.stringify(data));
        });
      </script>
      </body>
    </html>
    `)
})

routes.post('/UsuarioCadastro', UsuarioControllers.criar);

routes.get('/usuarios', (req, res) =>{
    const lista = UsuarioControllers.listar();
    return res.json(lista);
});

export default routes;
