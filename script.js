// Importa os módulos necessários
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

// Cria o servidor Express
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

// Serve o frontend React
const ReactApp = () => {
  const [isAluno, setIsAluno] = React.useState(null);
  const [userId, setUserId] = React.useState("");
  const [response, setResponse] = React.useState(null);

  const handleUserChoice = (choice) => {
    setIsAluno(choice);
  };

  const fetchAlunoData = async () => {
    const res = await fetch(`/aluno/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setResponse(data);
    } else {
      alert("Aluno não encontrado!");
    }
  };

  const fetchResponsavelData = async () => {
    const res = await fetch(`/responsavel/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setResponse(data);
    } else {
      alert("Responsável não encontrado!");
    }
  };

  return (
    <div className="App">
      <h1>Bem-vindo ao Bot da Escola</h1>

      {isAluno === null && (
        <div>
          <button onClick={() => handleUserChoice(true)}>Sou Aluno</button>
          <button onClick={() => handleUserChoice(false)}>Sou Responsável</button>
        </div>
      )}

      {isAluno !== null && !response && (
        <div>
          <input
            type="number"
            placeholder="Digite seu ID"
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={isAluno ? fetchAlunoData : fetchResponsavelData}>
            {isAluno ? "Consultar Notas e Horários" : "Consultar Notas do Aluno"}
          </button>
        </div>
      )}

      {response && (
        <div>
          <h2>Informações:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// Rende o frontend React no servidor (SSR)
app.get("/", (req, res) => {
  const html = ReactDOMServer.renderToString(React.createElement(ReactApp));
  const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bot da Escola</title>
        <script src="/bundle.js" defer></script>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2c3e50; }
          button { padding: 10px 20px; margin: 10px; }
          input { padding: 8px; }
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;
  res.send(template);
});

// Servir o arquivo do frontend com JavaScript compilado
app.use(express.static(path.join(__dirname, "frontend")));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
