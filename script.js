// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Dados simulados de alunos e responsáveis
const alunos = [
  { id: 1, nome: "João", notas: [9, 8, 7], horarios: ["Matemática", "História", "Física"] },
  { id: 2, nome: "Maria", notas: [10, 9, 8], horarios: ["Português", "Biologia", "Química"] },
];

const responsaveis = [
  { id: 1, nome: "Paulo", alunoId: 1 },
  { id: 2, nome: "Ana", alunoId: 2 },
];

// Endpoints da API
app.get("/aluno/:id", (req, res) => {
  const aluno = alunos.find(a => a.id == req.params.id);
  if (aluno) {
    res.json({ nome: aluno.nome, notas: aluno.notas, horarios: aluno.horarios });
  } else {
    res.status(404).send("Aluno não encontrado");
  }
});

app.get("/responsavel/:id", (req, res) => {
  const responsavel = responsaveis.find(r => r.id == req.params.id);
  if (responsavel) {
    const aluno = alunos.find(a => a.id == responsavel.alunoId);
    res.json({ nomeAluno: aluno.nome, notas: aluno.notas });
  } else {
    res.status(404).send("Responsável não encontrado");
  }
});

// Serve o arquivo HTML que irá carregar o frontend React
app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bot da Escola</title>
        <script src="/bundle.js" defer></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `;
  res.send(html);
});

// Serve o frontend (React)
app.use(express.static(path.join(__dirname, "frontend")));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
