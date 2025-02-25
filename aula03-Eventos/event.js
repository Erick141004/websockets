import { EventEmitter } from 'events';

const notificator = new EventEmitter();
const tasks = [
    { id: 1, descricao: 'Tarefa 1', status: 'trabalhando' },
    { id: 2, descricao: 'Tarefa 2', status: 'aguardando' },
    { id: 3, descricao: 'Tarefa 3', status: 'aguardando' }
];

notificator.on('aguardando', (dado) => {
    const ids = dado.ids.map(t => t.id).join(', ');
    console.log("Tarefas aguardando: ", ids);
});

notificator.on('trabalhando', (dado) => {
    if(dado.novaTarefa){
        dado.novaTarefa.status = "trabalhando";
        console.log(`Trabalhando: ${dado.novaTarefa.descricao} está em andamento`);
    }
    else{
        console.log(`Trabalhando: ${dado.mesmaTarefa.descricao} está em andamento`);
    }

});

notificator.on('finalizado', (dado) => {
    const tasksFinalizadas = tasks.filter(t => t.status === 'finalizado');

    if(tasksFinalizadas.length > 0){
        const idsFinalizados = tasksFinalizadas.map(t => t.descricao).join(", ");

        if(dado){
            dado.tarefa.status = "finalizado";
            console.log(`Tarefas finalizadas:  ${idsFinalizados}, ${dado.tarefa.descricao}`);
        } else {
            console.log(`Tarefas finalizadas: ${idsFinalizados}`);
        }
    } else if (dado){
        dado.tarefa.status = "finalizado";
        console.log(`Tarefas finalizadas: ${dado.tarefa.descricao}`);
    }
    
});

function gerenciadorTarefas(){
    const indexTrabalhando = tasks.findIndex(t => t.status === 'trabalhando');
    if(indexTrabalhando === -1){
        console.log("Todas as tarefas foram processadas");
        return;
    }
    
    const random = Math.random();
    console.log('Numero sorteado: ', random.toFixed(2));
    const mudaTarefa = random > 0.7;
    
    if(mudaTarefa){
        notificator.emit('finalizado', {tarefa: tasks[indexTrabalhando]});
        
        const proxTarefa = tasks.find(t => t.status === 'aguardando')
        if(proxTarefa){
            notificator.emit('trabalhando', {novaTarefa: proxTarefa});
        }
    } else {
        notificator.emit('finalizado', null);
        notificator.emit('trabalhando', {mesmaTarefa: tasks[indexTrabalhando]});
    }

    const tasksAguardando = tasks.filter(t => t.status === 'aguardando');
    if(tasksAguardando.length > 0){
        notificator.emit('aguardando', {ids: tasksAguardando});
    }

    console.log("\n-----------------------------");
    console.log("Tarefas: ", tasks);
}

setInterval(gerenciadorTarefas, 5000);