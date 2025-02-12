import { createServer } from "http"
import { URL } from 'url';

export const server = createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const users = []

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    switch(path){
        case '/addUser':
            res.writeHead(200);
            const teste = getUser();
            users.push(teste);
            res.end(`Deu algum bom ai${users}`)
            break;
        case '/users':
            res.writeHead(200);
            break;
        case '/user':
            res.writeHead(200);
            break;
        case '/':
            res.writeHead(200);
            res.end("Deu bom porra");
            break;
        default:
            res.writeHead(404);
            break;
    }
})

function getUser(){
    fetch("https://randomuser.me/api/", {method: "GET"})
    .then((response) => {
        return response.json()
    })
    .then(
        (response) => {
            return response.results[0]
        }
    )
    .catch((e) => {
        console.log(`Erro na seguinte coisa ${e}`)
    })
}