import express from "express";

const routes = express.Router();

routes.get('/', (req, res) => {
  return res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Divideaqui - Interface do Backend</title>
      <style>
        :root {
          --azul-escuro: #03045E;
          --azul-claro: #053CC8;
          --verde-claro: #B8FB3C;
          --verde-escuro: #79C734;
          --branco: #F5F5F0;
          --preto: #0C0C0C;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          min-height: 100vh;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: linear-gradient(180deg, var(--azul-escuro) 0%, var(--preto) 100%);
          color: var(--branco);
          line-height: 1.6;
        }

        .page {
          max-width: 1080px;
          margin: 0 auto;
          padding: 32px 24px 48px;
        }

        .card {
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
          padding: 32px;
          margin-bottom: 28px;
        }

        .hero {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .logo {
          width: 120px;
          height: auto;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .title {
          color: var(--verde-claro);
          font-size: clamp(2rem, 2.4vw, 3rem);
          margin: 0;
        }

        .subtitle {
          color: var(--branco);
          font-size: 1.1rem;
          margin-top: 8px;
        }

        .section-title {
          color: var(--azul-claro);
          font-size: 1.25rem;
          margin-bottom: 14px;
        }

        .text-block {
          margin-bottom: 18px;
          color: #e8e8e2;
        }

        ul {
          list-style: none;
          padding-left: 0;
        }

        li {
          margin-bottom: 14px;
          padding: 18px 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--verde-escuro);
          border-radius: 999px;
          color: var(--preto);
          font-weight: 700;
          margin-bottom: 20px;
        }

        footer {
          text-align: center;
          margin-top: 12px;
          color: rgba(245, 245, 240, 0.65);
          font-size: 0.95rem;
        }
      </style>
    </head>
    <body>
      <main class="page">
        <section class="card">
          <div class="hero">
            <img class="logo" src="/assets/logo1VerdeClaro.png" alt="Logo Divideaqui" />
            <div>
              <h1 class="title">Backend Divideaqui</h1>
              <p class="subtitle">Interface do backend que organiza rotas, dados e lógica do sistema de despesas compartilhadas.</p>
            </div>
          </div>

          <div>
            <h2 class="section-title">Resumo do backend</h2>
            <p class="text-block">Este backend atua como a camada responsável por receber requisições, processar informações de despesas e grupos, e devolver respostas para consumo do frontend ou de outros serviços. Ele garante que a lógica de negócio do projeto esteja centralizada no servidor, com controle de rotas, consistência de dados e retorno de status adequados.</p>
          </div>
        </section>

        <section class="card">
          <h2 class="section-title">Rotas disponíveis</h2>
          <p class="text-block">Abaixo estão as rotas públicas já configuradas no backend. O conteúdo desta página não inclui APIs fictícias, apenas a documentação das rotas reais.</p>
          <ul>
            <li><strong>GET /</strong> — Interface de apresentação do backend e documentação básica.</li>
          </ul>
        </section>
      </main>
      <footer>Backend ativo na porta 3344. Abra <strong>http://localhost:3344/</strong> para acessar a interface.</footer>
    </body>
    </html>
  `);
});

export default routes;