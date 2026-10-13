# DivideAqui: Sistema de Gerenciamento de Contas Compartilhadas (contexto consolidado do TCC)

> Documento consolidado a partir do PDF do TCC 2026. Serve como contexto para uma IA entender o projeto sem precisar ler o PDF. Valores, nomes e porcentagens seguem o documento original.

## 1. Identificação

- **Projeto:** DivideAqui, aplicação web de gestão de despesas compartilhadas
- **Tipo:** Projeto Final (TCC 2026) do Curso Técnico de Informática para Internet
- **Instituição:** Escola Técnica Estadual de Volta Redonda (FAETEC), Volta Redonda, 2026
- **Equipe:** Elis Brum, Enzo Vimercati, Frederico Abrantes, Marcos Mendes e Tainá Martins
- **Orientadora:** Profa. MSc. Luciane Carvalho Jasmin de Deus
- **Coorientador:** Prof. Henrique Barbosa de Souza Júnior
- **Banca:** Prof. Anderson Evandro Simeão Da Silva
- **Palavras-chave:** Divisão, Economia, Compartilhamento
- **Site (deploy):** https://divide-aqui.vercel.app/
- **Status informado no resumo:** 40% das funcionalidades desenvolvidas e validadas (cadastro e autenticação, criação e gerenciamento de grupos, cálculo automático dos valores individuais)

## 2. Resumo

O projeto surgiu da necessidade de uma aplicação web para gerenciar despesas compartilhadas, tornando o entretenimento mais acessível e econômico. Problemas principais identificados: o constrangimento de cobrar pessoas conhecidas e a dificuldade de definir valores justos para cada membro. O objetivo é reduzir custos e centralizar a gestão de despesas por meio de grupos para viagens, streaming, despesas domésticas e categorias personalizadas. Metodologia híbrida: UML + metodologias ágeis (Scrum), com Design Thinking.

## 3. Justificativa, problema e hipótese

- **Justificativa:** as soluções atuais para organizar despesas são em grande parte ineficazes: desordem, dificuldade de achar pessoas para dividir contas e constrangimento nas cobranças. Apesar do avanço tecnológico e dos celulares, o gerenciamento financeiro continua pouco acessível.
- **Problema:** as soluções atuais não são completas nem acessíveis. O Excel, por exemplo, é completo, mas exige conhecimento técnico (criar tabelas e funções manualmente) e é pago.
- **Hipótese:** uma aplicação web focada em pagamentos, com busca de pessoas para dividir planos de streaming, pagamento integrado, grupos públicos e privados e organização por abas personalizadas (ex.: "Aluguel", "Conta de Luz").

## 4. Objetivos

**Geral:** desenvolver uma solução para dividir despesas em grupo, reduzindo custos individuais e ampliando o acesso ao entretenimento de forma econômica.

**Específicos:**
- Promover economia financeira
- Reduzir os altos custos
- Ampliar o acesso ao entretenimento
- Mitigar conflitos interpessoais
- Unir indivíduos com interesses semelhantes
- Centralizar despesas em um só sistema

## 5. Metodologias

Abordagem híbrida (organização técnica + foco no usuário).

- **UML:** linguagem padrão para especificar, visualizar e documentar software (Guedes, 2018; Larman, 2000). Usa o **Diagrama de Caso de Uso** para representar funcionalidades a partir da interação entre atores e sistema (Bittner; Spence, 2003).
- **MER (Modelo de Entidade e Relacionamento):** modela entidades, atributos e relacionamentos (Dantas, 2016). Entidades podem ser fortes ou fracas.
- **Design Thinking** (Bonini; Sbragia, 2011), centrado no ser humano. Etapas: Empatia (compreender o usuário), Definição (definir o problema), Ideação (gerar soluções), Prototipagem (materializar ideias em baixa fidelidade), Teste (validar com usuários reais e iterar). Também descrito em três fases: inspiração, ideação e implementação.
- **Metodologia Ágil / Scrum:** projeto dividido em sprints, daily stand-up, revisão de sucessos e falhas a cada ciclo.

## 6. Cronograma (TCC 2026, trecho)

Escala: Abr a Dez. Verde = finalizado, azul = programado.

| # | Atividade | Responsável(is) | Período (meses finalizados) |
|---|-----------|-----------------|------------------------------|
| 1 | Montar pesquisa com usuário | (não informado) | Abr |
| 2 | Criar identidade visual | Tainá | Mai |
| 3 | Protótipo Home | Enzo, Marcos e Tainá | Mai |
| 4 | Criar GitHub | Frederico | Mai |
| 5 | Criar Caso de Uso | Tainá | Mai |
| 6 | Documentação Backend | Marcos e Tainá | Mai a Jun |
| 7 | MER | Elis | Mai a Out |
| 8 | Programar Home | Enzo, Fred, Marcos e Tainá | Jun a Set |
| 9 | Protótipo Tela de Cadastro e Login | Tainá | Jun |
| 10 | Frontend Cadastro | Tainá | Jun a Set |
| 11 | Frontend Login | Enzo | Jun a Set |
| 12 | Componente Login e Cadastro | Marcos | Jul |
| 13 | Protótipo Divisões e Histórico | Tainá | Jun a Jul |
| 14 | Frontend Divisões | Enzo | Jun a Set |
| 14 | Backend Usuário | Marcos | Jun a Out |
| 14 | Integração Login com Google | Enzo | Jun |
| 14 | Backend Grupo | Enzo | Set |
| 14 | Banco de Dados | Tainá | Set |
| 14 | Hospedagem BD no Neon | Tainá | Set |

(A leitura das colunas de meses vem de uma imagem, então os períodos são aproximados.)

## 7. Sites semelhantes (comparativo)

Concorrentes analisados: Splitwise, GGMAX, Juntos, GoSplit, BlaBlaCar.

| Funcionalidade | DivideAqui | Splitwise | GGMAX |
|---|---|---|---|
| Validar documentos | Sim | Não | Sim |
| Selecionar categoria | Sim | Não | Sim |
| Registrar despesas | Sim | Sim | Não |
| Criar divisão | Sim | Sim | Não |
| Pagamento via PIX/cartão | Sim | Não | Sim |

| Funcionalidade | DivideAqui | Juntos | GoSplit |
|---|---|---|---|
| Validar documentos | Sim | Sim | Não |
| Selecionar categoria | Sim | Sim | Sim |
| Registrar despesas | Sim | Sim | Sim |
| Criar divisão | Sim | Sim | Sim |
| Pagamento via PIX/cartão | Sim | Sim | Sim |

| Funcionalidade | DivideAqui | BlaBlaCar |
|---|---|---|
| Validar documentos | Sim | Não |
| Selecionar categoria | Sim | Sim |
| Registrar despesas | Sim | Não |
| Criar divisão | Sim | Sim |
| Pagamento via PIX/cartão | Sim | Não |

(O PDF extrai algumas tabelas de forma ambígua; as marcações acima são a melhor leitura possível.)

## 8. Alternativas de implementação e orçamento

| Funcionalidade | Básica | Intermediária | Avançada |
|---|---|---|---|
| Cadastro e autenticação de usuários | Sim | Sim | Sim |
| Criação de grupos para dividir despesas | Sim | Sim | Sim |
| Registrar despesas e selecionar categoria | Não | Sim | Sim |
| Pagamento via PIX/cartão | Não | Não | Sim |
| **Prazo (semanas)** | 4 | 8 | 12 |
| **Investimento** | R$ 3.200,00 | R$ 6.400,00 | R$ 9.600,00 |

**Memória de cálculo:** desenvolvedor júnior a R$ 20/h, 40 h semanais, 1 desenvolvedor. Cálculo: semanas × 40 × 20 (4×40×20 = 3.200; 8×40×20 = 6.400; 12×40×20 = 9.600). O salário de referência é a média de Programador Júnior no Brasil segundo o Indeed (2026), R$ 3.169,00, arredondado para R$ 3.200,00. A jornada de 40 h segue a CLT (Art. 58).

**Alternativa escolhida:** **Avançada**, decidida em conjunto com o cliente. Justificativa: atende a todos os requisitos funcionais, o prazo de 12 semanas é compatível com o cronograma da equipe e o maior investimento (R$ 9.600) é justificado pelo valor agregado.

## 9. Requisitos de plataforma

**Hardware mínimo:** instância compartilhada 512 MB RAM e 1 vCPU; 5 GB SSD; hospedagem PaaS (Vercel ou Render); subdomínio gratuito.

**Hardware recomendado:** servidor dedicado ou VPS com no mínimo 2 GB RAM e 2 vCPUs; 20 GB SSD; infraestrutura IaaS escalável (AWS, Google Cloud ou DigitalOcean); domínio próprio (ex.: www.divideaqui.com.br).

**Software:**
- Mobile: Android 10+ e iOS 15+
- Desktop: Windows 10/11, macOS Monterey ou Linux moderno
- Navegadores: Chrome 110+ (recomendado), Firefox atualizado, Edge (Chromium), Safari
- JavaScript habilitado e HTTPS (SSL/TLS) para proteger login e pagamentos

## 10. Tecnologias de desenvolvimento

- **HTML5:** estrutura das páginas
- **CSS3:** estilização e responsividade
- **TypeScript:** tipagem estática sobre JavaScript
- **React:** componentes reutilizáveis
- **Vite:** ferramenta de desenvolvimento e empacotamento
- **React Icons:** biblioteca de ícones

Infraestrutura citada no cronograma: banco de dados hospedado no **Neon**; deploy do front na **Vercel**; login com **Google** integrado; protótipos no **Canva** e **Figma**; diagramas no **Lucidchart** e **BRModelo**.

## 11. Atores e casos de uso

**Atores:** Usuário (generalizado em Participante e Líder) e Administrador. Relações `<<include>>` no diagrama: Cadastrar usuário inclui Efetuar login; Criar divisão inclui Efetuar login; Criar divisão inclui Registrar despesas. O Administrador se liga a Cadastrar usuário e Efetuar login. O Líder se liga a Criar divisão e Gerenciar participantes. O Participante se liga a Solicitar participação na divisão.

### CSU01 – Cadastrar usuário
Ator principal: Usuário. Secundário: Administrador. O sistema deve: solicitar os dados do cadastro; verificar se e-mail ou nome de usuário já existe (se sim, direcionar ao Login); validar as informações (se inválidas, pedir correção); confirmar o cadastro; permitir ao usuário alterar os dados digitados.

### CSU02 – Efetuar login
Ator principal: Usuário. Secundário: Administrador. O sistema deve: solicitar e-mail e senha; validar; verificar se a senha corresponde ao usuário; informar erro e pedir nova tentativa se inválido; conceder acesso e direcionar à área restrita se válido; permitir logout.

### CSU03 – Criar divisão
Ator principal: Líder. O sistema deve: solicitar dados obrigatórios (nome, categoria etc.); criar o grupo público ou privado; permitir adicionar participantes; definir o criador como líder; exibir confirmação; permitir alterar informações do grupo e remover participantes; permitir excluir o grupo quando não houver pendências financeiras.

### CSU04 – Registrar despesas
Ator principal: Usuário. O sistema deve: permitir selecionar o grupo; informar erro se os dados forem inválidos; calcular automaticamente o valor devido por participante; registrar a despesa no grupo; atualizar saldos e valores pendentes; notificar os participantes; exibir confirmação; registrar no histórico.

### CSU05 – Gerenciar participantes
Ator principal: Líder. O sistema deve: solicitar nome ou e-mail do participante; se não cadastrado, informar a necessidade de cadastro prévio ou enviar convite; verificar se já pertence ao grupo (se sim, cancelar a operação); adicionar ao grupo; atualizar a lista; notificar o participante; registrar a operação; exibir confirmação.

### CSU06 – Efetuar pagamento
Ator principal: Usuário. O sistema deve: mostrar despesas pendentes; permitir selecionar a despesa; exibir valor devido e detalhes; registrar a solicitação de pagamento; confirmar; atualizar saldo devedor e registros financeiros da divisão; notificar os participantes sobre a quitação; registrar no histórico; permitir consultar pagamentos realizados.

### CSU07 – Avaliar usuário
Ator principal: Usuário. O sistema deve: permitir selecionar um participante; verificar participação conjunta em divisão concluída; permitir atribuir nota e comentário opcional; registrar a avaliação; atualizar a reputação do avaliado; notificar o avaliado; permitir ver as avaliações recebidas; exibir confirmação.

### CSU08 – Solicitar participação na divisão
Ator principal: Participante. O sistema deve: permitir solicitar participação ou entrar por convite ou código de acesso; verificar se o grupo existe e se o usuário já participa (se sim, cancelar); em grupo privado, exigir aprovação do líder; adicionar o usuário à lista após aprovação; atualizar a lista; notificar os membros; exibir confirmação; registrar a participação; permitir ver despesas e informações do grupo após a entrada.

## 12. Histórias do usuário

1. Como usuário, quero informar meus dados pessoais para **Cadastrar usuário**.
2. Como usuário, quero enviar meus documentos de identificação para **Validar documentos**.
3. Como usuário, preciso informar e-mail e senha para **Efetuar login**.
4. Como líder, quero informar categoria, descrição, limite de participantes e valor da divisão para **Criar divisão**.
5. Como usuário, quero informar meus gastos na divisão para **Registrar despesas**.
6. Como líder, quero adicionar e remover participantes e compartilhar um link público ou privado para **Gerenciar participantes**.
7. Como usuário, quero copiar o link de pagamento disponibilizado pelo sistema para **Efetuar pagamento**.
8. Como usuário, desejo atribuir uma avaliação (comentário personalizado e escala de 5 estrelas) a outro participante para **Avaliar usuário**.
9. Como participante, quero **Solicitar participação**.

## 13. Testes de aceitação

- Não cadastrar o usuário se faltar nome completo, CPF, e-mail ou senha.
- Em divisões privadas, o usuário só ingressa após autorização do líder.
- Na categoria Streaming, o líder deve informar obrigatoriamente o valor da assinatura; nas demais, é opcional.
- Não permitir ingresso em divisão sem vagas.
- Ao registrar pagamento, atualizar o status imediatamente e notificar os integrantes.
- Notificar os integrantes conforme o vencimento se aproxima, até o pagamento ser registrado.
- Ao atualizar dados cadastrais (nome de usuário, foto, descrição), salvar e exibir corretamente.
- Login só permitido se e-mail e senha corresponderem a um usuário do banco.
- "Recuperar senha" envia e-mail de recuperação, se o e-mail estiver cadastrado.
- Ao criar divisão, registrá-la e torná-la visível na lista do líder e do sistema.
- Ao sair de uma divisão, remover o usuário da lista e revogar o acesso às informações.
- Ao pesquisar divisões, exibir apenas as da categoria informada.

## 14. Acompanhamento das histórias (Scrum)

| História | Estimativa (pontos) | Total realizado | Desvio | Responsável |
|---|---|---|---|---|
| Cadastrar usuário | 1 | 1 | 0 | Marcos |
| Efetuar login | 1 | 1 | 0 | Marcos |
| Criar divisão | 2 | 2 | 0 | Enzo |
| Registrar despesas | 2 | 1 | -1 | Enzo |
| Gerenciar participantes | 1 | (não iniciado) | | Enzo |
| Efetuar pagamento | 2 | (não iniciado) | | Frederico |
| Avaliar usuário | 2 | 2 | 0 | Tainá |
| Solicitar participação | 1 | (não iniciado) | | Tainá |

## 15. Modelo de Entidade e Relacionamento (Figura 4, feita no BRModelo)

Leitura de uma imagem pequena, então atributos e cardinalidades podem ter imprecisões.

**Entidades:**
- **Usuário:** id, e-mail, senha, CPF, descrição, foto, telefone, data de nascimento
- **Grupo:** id, nome, número de participantes, número de vagas, descrição, visibilidade, valor/score, chave da categoria
- **Categoria**, com especializações: **Streaming** (valor, plano, gênero/tipo, data de vencimento), **Doméstico** (tipo de despesa e dados de consumo) e **Viagens** (partida, destino, data de início, data de fim)
- **Avaliação:** id, descrição, mínimo/máximo, avaliador, nota
- **Item**, relacionado a Usuário e Grupo (fotos/dados de veículo ou bem, conforme a figura)
- **Notificação:** id, tipo, data, usuário e grupo
- **Mensalidade:** id, data de lançamento, data de vencimento, valor, valor pago, status, data de pagamento

**Relacionamentos:** Usuário *Recebe* Avaliação; Usuário *Participa* de Grupo (agregação "Participar"); Usuário *Pertence*/relaciona-se a Item; Grupo *Tem* Categoria; Usuário *Notifica* / recebe Notificação; Grupo/Usuário *Recebe* Mensalidade.

## 16. Front-end

### Mapa de navegação
- **Home Principal** leva a **Cadastro** e **Login**.
- **Login** leva à **Home Restrita**, que contém: **Divisões**, **Histórico do Usuário**, **Notificações**, **Meu Perfil**.
- **Divisões** se relaciona com **Grupos**, que contêm: **Chat**, **Histórico do Grupo**, **Perfil do Líder**, **Perfil do Participante**.

### Telas prototipadas
- **Homepage:** proposta do DivideAqui, acesso a login e cadastro, campo de pesquisa ("O que vamos dividir hoje?"), atalhos de categoria (Viagens, Streamer, Custos Domésticos), avaliações de usuários e seção "Veja como é fácil" (1. criar ou entrar em um grupo, 2. adicionar pessoas, 3. relaxar, o sistema cuida das cobranças). Slogan: "Simples, Rápido e Justo"; "+ Economia | - Estresse".
- **Cadastro e login:** acesso por e-mail e senha ou conta Google. Cadastro com nome completo, data de nascimento, CPF, telefone, e-mail e senha. Textos: "Pronto para Dividir sem Discussão? Então cria sua Conta aqui" e "Bora Economizar sem Perder o Streaming?". Opção "Lembrar minhas informações" e link "Esqueceu a senha?".
- **Divisões:** todos os grupos públicos e privados organizados por categoria (Streaming, Viagens, Custos Domésticos, Outros), com busca por nome. Cards mostram logo do serviço, cadeado (grupo privado), avatares, nome, valor (ex.: Prime Vídeo R$ 13,90, Spotify R$ 8,50) e vagas disponíveis.
- **Histórico / dashboard:** card "Você economizou R$ 10.000" (comparativo pagando sozinho × com DivideAqui), total de divisões (ex.: 18), atrasados, "Suas divisões" e **Resumo financeiro** com colunas Grupo, Total Gasto, Total Economizado, Pagamento, Vencimento e Status (Atrasado, Pendente, Pago).

### Tipografia
| Elemento | Fonte |
|---|---|
| Títulos principais | Poppins Bold |
| Subtítulos | Poppins SemiBold |
| Textos gerais | Montserrat Regular |
| Menus de navegação | Montserrat Medium |
| Botões | Montserrat SemiBold |
| Campos de formulário | Montserrat Regular |

### Cores
Identidade que transmite confiança, modernidade, clareza e praticidade: azul (segurança e tecnologia) combinado com verde (crescimento, equilíbrio, colaboração).

| Elemento | Cor | Código | Aplicação |
|---|---|---|---|
| Principal | Azul Escuro | #03045E | Cabeçalho, rodapé e áreas principais |
| Secundária | Azul Médio | #053CC8 | Botões secundários, links, ícones |
| Destaque | Verde Lima | #B8FB3C | Botões de ação, destaques, chamadas |
| Destaque | Verde Luminoso | #7EC93C | Fundo da tela de cadastro |
| Texto principal / fundo | Branco Acinzentado | #F5F5F0 | Fundo das páginas e cartões |
| Texto secundário | Preto | #0C0C0C | Textos e botão de login com Google |

### Imagens
Logotipos do DivideAqui (ícone de divisão em formato de "÷" estilizado), moeda, logos de streaming criados pela equipe (Prime Video, Spotify, Canva, Apple One, Deezer, Amazon Music), mockup de celulares, ilustração de usuário, linha indicando crescimento. Todas têm caráter ilustrativo.

### Estrutura HTML5
`header` (logo, menu principal, botão de cadastro), `nav` (links das áreas), `section` (banner, apresentação, depoimentos, como funciona), `footer` (institucional, redes sociais, links úteis, direitos autorais).

### Regras de ouro de Shneiderman aplicadas
- **Regra 1, Consistência:** botões, menus e cartões com mesmo padrão de cores, fontes e espaçamento.
- **Regra 3, Feedback informativo:** botões com estados visuais e mensagens de confirmação ou erro (ex.: modal "Campo obrigatório: Digite seu e-mail ou CPF").
- **Regra 5, Evite erros:** campos de formulário com identificação clara e organização lógica.
- **Regra 8, Reduzir carga de memória de curta duração:** despesas organizadas em categorias (Streaming, Viagens, Custos Domésticos e Outros).

## 17. Anexo 1: pesquisa de campo (110 respostas, Google Forms)

**Faixa etária:** menor de 18 anos 31,8%; 18 a 24 anos 22,7%; 25 a 34 anos 19,1%; 35 a 44 anos cerca de 6% (rótulo não legível); 45 anos ou mais 20%.

**Frequência com que divide despesas:** diariamente 17,3%; frequentemente (todos os meses) 48,2%; raramente (algumas vezes por ano) 28,2%; nunca cerca de 6%.

**Com quem divide (múltipla escolha):** familiares 79 (71,8%); amigos 54 (49,1%); desconhecidos com interesses em comum 8 (7,3%); não costuma dividir 5 (4,5%); colegas de quarto/casa 2 (1,8%); outras respostas 1 cada (0,9%).

**Tipos de gasto que compartilha ou tem interesse:** assinaturas de streaming 63 (57,3%); viagens e passeios 63 (57,3%); contas domésticas 53 (48,2%); respostas isoladas (cartão de crédito, material de obra, jantares e saídas, alimentação) 0,9% cada.

**Ferramentas usadas hoje:** papel e caneta/bloco de notas 35,5%; apenas conversas por WhatsApp 33,6%; nenhuma ferramenta 20%; planilhas 9,1%; aplicativos específicos (Splitwise, Tricount etc.) cerca de 1 a 2%.

**Maior dificuldade ao dividir uma conta:** vergonha ou incômodo de cobrar 40%; esquecer quem já pagou e quem está devendo 29,1%; calcular o valor exato para cada pessoa 14,5%; encontrar pessoas interessadas em dividir 11,8%; demais respostas residuais.

**Já deixou de assinar streaming ou viajar por custo individual alto:** sim 86,4%; não 13,6%.

**Segurança em usar um site para encontrar desconhecidos e dividir assinatura (escala 1 a 5):** 1 = 23 (20,9%); 2 = 20 (18,2%); 3 = 33 (30%); 4 = 17 (15,5%); 5 = 17 (15,5%).

**Funcionalidade mais importante:** notificações automáticas de cobrança 48,2%; divisão por grupos 20%; histórico detalhado de gastos mensais 20%; mural para encontrar pessoas e dividir assinaturas 10%; outras residuais.

**Dispositivo principal de acesso:** smartphone 73,6%; ambos de forma equilibrada 22,7%; computador/notebook cerca de 3,6%.

**Insights que a pesquisa sustenta:** o constrangimento de cobrar é a maior dor, notificações automáticas são a funcionalidade prioritária, o uso é majoritariamente mobile (design mobile-first) e há desconfiança moderada em dividir com desconhecidos, o que justifica validação de documentos e sistema de avaliação.

## 18. Referências

- BONINI, L. A.; SBRAGIA, R. O modelo de design thinking como indutor da inovação nas empresas. *Revista de Gestão e Projetos (GeP)*, v. 2, n. 1, 2011.
- GUEDES, G. T. A. *UML 2: uma abordagem prática*. Novatec, 2018.
- LARMAN, C. *Utilizando UML e padrões*. Bookman, 2000.
- SHNEIDERMAN, B. *The Eight Golden Rules of Interface Design*. University of Maryland.
- INDEED. Média salarial de Programador Júnior no Brasil, 2026.
- MIRO. Metodologia Ágil: o que é, como implementar, exemplos e modelos.
- DANTAS, C. M.; CORDULA, F. R.; ARAÚJO, W. J. Análise da representação da informação em modelos entidade relacionamento com base em metadados. *Archeion Online*, v. 4, n. 1, 2016.
- BITTNER, K.; SPENCE, I. *Use Case Modeling*. Addison-Wesley, 2003.

## 19. Observações sobre o documento original

- Na tabela de memória de cálculo, "Horas trabalhadas semanalmente" da alternativa Básica aparece como 4 h, mas o cálculo usa 4 × 40 × 20 (provável erro de digitação; o correto seria 40 h).
- A seção de Regras de Ouro cita apenas as regras 1, 3, 5 e 8.
- O documento escreve "CCS3" em um ponto onde o correto é "CSS3".
- A tabela de acompanhamento das histórias e o cronograma vieram de imagens e podem ter leitura aproximada.
