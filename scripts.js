const apiBaseUrl = 'http://127.0.0.1:5000';

$(document).ready(function () {
    const table = initializeDataTable();

    getTarefas(table);

    $('#addTaskForm').submit(function (event) {
        event.preventDefault();
        const description = $('#taskDescription').val();
        addTask(description, table);
    });
});

const getTarefas = async (table) => {
    let url = `${apiBaseUrl}/tarefas`;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            table.clear();
            data.tarefas.forEach(item => insertList(item.id, item.descricao, item.data_inicio, item.data_conclusao, table));
            table.draw();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const insertList = (id, descricao, data_inicio, data_conclusao, table) => {
    var item = [id, descricao, data_inicio || 'Não iniciado', data_conclusao || 'Não concluído', createTaskActions(id)];
    table.row.add(item);

    // Atualizar as listas de tarefas agrupadas
    const status = data_conclusao ? 'completedTasks' : (data_inicio ? 'startedTasks' : 'pendingTasks');
    $(`#${status}`).append(`<p class="kanban-item">${descricao}</p>`);


    $('#taskDescription').val('');
    $('#taskDate').val('');
}

const createTaskActions = (taskId) => {
    return `
        <button class="btn btn-success" onclick="startTask(${taskId})" alt="Iniciar tarefa"> <i class="fas fa-play"></i> </button>
        <button class="btn btn-warning" onclick="completeTask(${taskId})" alt="Concluir tarefa"> <i class="fas fa-check"></i> </button>
        <button class="btn btn-danger" onclick="deleteTask(${taskId})" alt="Deletar tarefa"> <i class="fas fa-trash"></i> </button>
    `;
}

const addTask = async (description, table) => {
    const formData = new FormData();
    formData.append('descricao', description);

    let url = `${apiBaseUrl}/tarefa/add`;
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.json().then((errorData) => {
                    throw new Error(`${errorData.message}`);
                });
            }
        })
        .then((data) => {
            insertList(data.id, data.descricao, data.data_inicio, data.data_conclusao, table);
            table.draw();
            alert('Tarefa adicionada com sucesso!!!');
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}

const startTask = async (taskId) => {
    await atualizarTarefa(taskId, 'iniciar');
    // Atualizar a lista de tarefas iniciadas
    const table = $('#allTasks').DataTable();
    const rowData = table.row($(`button[onclick="startTask(${taskId})"]`).closest('tr')).data();
    const descricao = rowData[1];
}

const completeTask = async (taskId) => {
    await atualizarTarefa(taskId, 'concluir');
    // Atualizar a lista de tarefas concluídas
    const table = $('#allTasks').DataTable();
    const rowData = table.row($(`button[onclick="completeTask(${taskId})"]`).closest('tr')).data();
    const descricao = rowData[1];
}

const deleteTask = async (taskId) => {
    let url = `${apiBaseUrl}/tarefa?id=${taskId}`;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => {
            if (response.status === 200) {
                const table = $('#allTasks').DataTable();
                table.row($(`button[onclick="deleteTask(${taskId})"]`).closest('tr')).remove().draw();
                alert('Tarefa removida com sucesso!!!');
            } else {
                return response.json().then((errorData) => {
                    throw new Error(`${errorData.message}`);
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message);
        });
}

const atualizarTarefa = async (id, operacao) => {
    const formData = new FormData();
    formData.append('id', id);
    let url = '';

    if (operacao == 'iniciar') {
        url = `${apiBaseUrl}/tarefa/iniciar`;
    } else {
        url = `${apiBaseUrl}/tarefa/concluir`;
    }

    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.json().then((errorData) => {
                    throw new Error(`${errorData.message}`);
                });
            }
        })
        .then((data) => {
            const table = $('#allTasks').DataTable();
            table.row($(`button[onclick="${operacao}Task(${id})"]`).closest('tr')).remove().draw();
            insertList(data.id, data.descricao, data.data_inicio, data.data_conclusao, table);
            table.draw();
            alert(`Tarefa atualizada com sucesso!!!`);
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
    
        getTarefas();
}

const initializeDataTable = () => {
    return $('#allTasks').DataTable({
        "pageLength": 5,
        "searching": false,
        "lengthChange": false,
        "language": {
            "decimal": "",
            "emptyTable": "Nenhuma tarefa disponível",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ tarefas",
            "infoEmpty": "Mostrando 0 a 0 de 0 tarefas",
            "infoFiltered": "(filtrado de _MAX_ tarefas no total)",
            "infoPostFix": "",
            "thousands": ".",
            "lengthMenu": "Mostrar _MENU_ tarefas",
            "loadingRecords": "Carregando...",
            "processing": "Processando...",
            "search": "Pesquisar:",
            "zeroRecords": "Nenhuma tarefa encontrada",
            "paginate": {
                "first": "Primeiro",
                "last": "Último",
                "next": "Próximo",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": ativar para ordenar a coluna em ordem crescente",
                "sortDescending": ": ativar para ordenar a coluna em ordem decrescente"
            }
        }
    });
}
