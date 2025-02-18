import { createServer } from "http";
import { URL } from "url";
import { users } from "./index.js"; // users agora é compartilhado

export const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (path.startsWith("/user/")) {
    const id = parseInt(path.split("/")[2], 10);

    if (isNaN(id) || id < 0 || id >= users.length) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Usuário não encontrado" }));
    }

    res.writeHead(200);
    return res.end(JSON.stringify(users[id]));
  }

  switch (path) {
    case "/addUser":
      res.writeHead(200);
      getUser()
        .then((value) => {
          users.push(value);
          console.log(users);
          res.end(`Usuário adicionado!`);
        })
        .catch((e) => {
          res.end(`Erro ao adicionar usuário: ${e}`);
        });
      break;
    case "/users":
      res.writeHead(200);
      res.end(JSON.stringify(users, null, 2));
      break;
    case "/":
      res.writeHead(200);
      res.end("Deu bom");
      break;
    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Rota não encontrada" }));
      break;
  }
});

function getUser() {
  return fetch("https://randomuser.me/api/")
    .then((response) => response.json())
    .then((data) => data.results[0])
    .catch((e) => {
      console.error(`Erro ao buscar usuário: ${e}`);
      throw e;
    });
}