import { EventEmitter } from 'events';

const statusEmitter = new EventEmitter();

const servers = [{
    id: 1,
    name: "API-Server-01",
    temperature: 40,
    status: "normal",
    history: [],
    criticalSince: null,  
    lastUpdate: Date.now() 
},
{
    id: 2,
    name: "API-Server-02",
    temperature: 40,
    status: "normal",
    history: [],
    criticalSince: null,  
    lastUpdate: Date.now() 
}]

statusEmitter.on('temperature-update', (server) => {
    server.lastUpdate = Date.now();
    server.temperature = generateTemperature();

    if (!server.history) {
        server.history = [];
    }

    server.history.unshift(server.temperature);    
    if (server.history.length > 5) {
        server.history.pop(); 
    }

    console.log(server.history);
});

statusEmitter.on('status-change', (element) => {
    if(element.status)
        element.server.status = element.status; 
    else if(element.server.temperature <= 45)
        element.server.status = "normal";
    else if(element.server.temperature >= 45 && element.server.temperature <= 55){
        element.server.status = "atencao";
        element.server.criticalSince = null;
    }
    else if(element.server.temperature > 55)
        element.server.status = "critico";
});

statusEmitter.on('server-offline', (server) => {
    console.log(`${formatTimestamp(server.lastUpdate)} ${server.name}: ${server.status}`);
});

statusEmitter.on('server-recovered', (server) => {
    server.criticalSince = null;
    server.temperature = 40;
    server.history = [];
});

statusEmitter.on('critical-alert', (server) => {
    if(server.criticalSince === null)
        server.criticalSince = Date.now();
    console.log(`${formatTimestamp(server.server.lastUpdate)} ${server.server.name}: ${server.server.temperature} ${server.tendencia} (CRITICO) - Desde: ${formatTimestamp(server.server.criticalSince)}
                \n--------------------- Media de Temperatura do Servidor ${server.media.toFixed(2)}`);
});

statusEmitter.on('trend-detected', () => {
    console.log("Tendecia detectada");
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

function generateTemperature() {
    const base = 40;
    const variation = Math.random() * 25 - 5; //-5 a +20
    return +(base + variation).toFixed(1);
}

const calculateAverage = history => {
    return history.reduce((sum, reading) => sum + reading, 0) / history.length;
}

const isTemperatureIncreasing = history => {
    if (history.length < 3) return false;
    const last3 = history.slice(-3);
    return last3[0] < last3[1] && last3[1] < last3[2];
}

function gerenciadorServidores(){
    servers.forEach(element => {
        const random = Math.random();
        const serverOn = random < 0.9;

        console.log(`\n\nNumero sorteado: ${random.toFixed(2)} ----------\n`);
        if(serverOn){
            if(element.status === "OFFLINE"){
                statusEmitter.emit('server-recovered', element);
            }
            statusEmitter.emit('temperature-update', element);
            statusEmitter.emit('status-change', {server: element, status: null});

            const trend = isTemperatureIncreasing(element.history);
            const trendText = trend ? '[Tendencia: ↑]' : "";
            const mediaTemp = calculateAverage(element.history);
            
            if(trend)
                statusEmitter.emit('trend-detected');

            if(element.status === "critico"){
                statusEmitter.emit('critical-alert', {server: element, tendencia: trendText, media: mediaTemp});
            } else {
                console.log(`${formatTimestamp(element.lastUpdate)} ${element.name}: ${element.temperature} (${element.status}) ${trendText}
                     \n--------------------- Media de Temperatura do Servidor ${mediaTemp.toFixed(2)}`);
            }
        } else {
            statusEmitter.emit('status-change', {server: element, status: 'OFFLINE'});
            statusEmitter.emit('server-offline', element)
        }

        console.log(`\n-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n`);
    });
}

setInterval(gerenciadorServidores, 3000);