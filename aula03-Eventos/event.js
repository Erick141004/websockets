import { EventEmitter } from 'events';

const notificator = new EventEmitter();
const tasks = [
    { id: 1, descricao: 'Tarefa 1', status: 'trabalhando' },
    { id: 2, descricao: 'Tarefa 2', status: 'aguardando' },
    { id: 3, descricao: 'Tarefa 3', status: 'aguardando' }
];

notificator.on('aguardando', (dado) => {
    if(dado !== ""){
        console.log("Tarefas aguardando: ", dado);
    } else {
        console.log("Nenhuma tarefa em aguardo");
    }
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
    let tasksFinalizadas = '';
    if(dado.dadosAnteriores && dado.dadoAlterado){
        dado.dadoAlterado.status = 'finalizado';
        tasksFinalizadas = dado.dadosAnteriores + ', ' + dado.dadoAlterado.descricao;
        console.log("Finalizado: ", tasksFinalizadas)
    } else if(dado.dadoAlterado){
        dado.dadoAlterado.status = 'finalizado';
        tasksFinalizadas = dado.dadoAlterado.descricao;
        console.log("Finalizado: ", tasksFinalizadas);
    } else if(dado.dadosAnteriores){
        tasksFinalizadas = dado.dadosAnteriores.descricao;
        console.log("Finalizado: ", tasksFinalizadas);
    }
});

function gerenciadorTarefas(){
    const random = Math.random();
    console.log('Numero sorteado: ', random.toFixed(2));
    const mudaTarefa = random > 0.7;

    const indexTrabalhando = tasks.findIndex(t => t.status === 'trabalhando');
    const proxTarefa = tasks.find(t => t.status === 'aguardando')
    
    const tasksAguardando = tasks.filter(t => t.status === 'aguardando');
    const ids = tasksAguardando.map(t => t.id).join(', ');

    const tasksFinalizadas = tasks.filter(t => t.status === 'finalizado');
    const idsFinalizados = tasksFinalizadas.map(t => t.descricao).join(", ");

    if(mudaTarefa){
        notificator.emit('trabalhando', {novaTarefa: proxTarefa});
        notificator.emit('aguardando', ids.replace(`${proxTarefa.id}, `, ' '));
        notificator.emit('finalizado', {dadoAlterado: tasks[indexTrabalhando], dadosAnteriores: idsFinalizados});
    } else {
        notificator.emit('trabalhando', {mesmaTarefa: tasks[indexTrabalhando]});
        notificator.emit('aguardando', ids);
        notificator.emit('finalizado', {dadosAnteriores: idsFinalizados});
    }
}

setInterval(gerenciadorTarefas, 5000);