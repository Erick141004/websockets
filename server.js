import { createServer } from 'http' 
import { URL } from 'url';
import { readFile, readFileSync } from 'fs';

export const server = createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    switch(path){
        case '/teste':
            res.writeHead(200);
            res.end(`Teste deu ok`);
            break;
        case '/nome':
            res.writeHead(200);
            res.end(`Olá ${url.searchParams.get('usuario')}`);
            break;
        case '/':
            res.writeHead(200);
            res.end(`Olá BCC`);
            break;
        case '/arquivosync':
            res.writeHead(200);
            const arquivoSync = readFileSync("./index.js");
            res.end(`Resultado do arquivo (leitura sincrona):\n\n ${arquivoSync}`);
            break;
        case '/arquivoasync':
            readFile("./index.js", "utf-8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Erro ao ler o arquivo assincronamente.");
                } else {
                    res.writeHead(200);
                    res.end(`Resultado do arquivo (leitura assincrona):\n\n ${data}`);
                }
            })
            break;    
        default:
            res.writeHead(404);
            res.end("Deu ruim");
            break;
    }
})