import { server } from './server.js';

const PORT = 8000;

server.listen(PORT, '127.0.0.1', () => {
    console.log('Server is running...')
})