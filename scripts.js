const getTarefas = async () => {
  let url = 'http://127.0.0.1:5000/tarefas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.tarefas.forEach(item => insertList(item.id, item.descricao, item.data_inicio, item.data_conclusao))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const getTarefasPendentes = async () => {
  try {
    const url = 'http://127.0.0.1:5000/tarefas/pendentes';
    const response = await fetch(url);
    const data = await response.json();

    const listaOrigem = document.getElementById('tarefas-pendentes');
    const listaDestino = document.getElementById('tarefas-iniciadas');

    data.tarefas.forEach((item) => {
      const novoElemento = criarElementoComBotao(item.id, item.descricao, listaOrigem, listaDestino, "iniciar" );
      listaOrigem.appendChild(novoElemento);
    });
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
}

const getTarefasIniciadas = async () => {
  try {
    const url = 'http://127.0.0.1:5000/tarefas/iniciadas';
    const response = await fetch(url);
    const data = await response.json();

    const listaOrigem = document.getElementById('tarefas-iniciadas');
    const listaDestino = document.getElementById('tarefas-concluidas');

    data.tarefas.forEach((item) => {
      const novoElemento = criarElementoComBotao(item.id, item.descricao, listaOrigem, listaDestino, "concluir");
      listaOrigem.appendChild(novoElemento);
    });
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
} 

const getTarefasConcluidas = async () => {
  try {
    const url = 'http://127.0.0.1:5000/tarefas/concluidas';
    const response = await fetch(url);
    const data = await response.json();

    const lista = document.getElementById('tarefas-concluidas');
  
    data.tarefas.forEach((item) => {
      const novoElemento = criarElementoSemBotao(item.descricao);
      lista.appendChild(novoElemento);
    });
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
}

getTarefas()
getTarefasPendentes()
getTarefasIniciadas()
getTarefasConcluidas()


const postTarefa = async (inputTarefa) => {
  const formData = new FormData();
  formData.append('descricao', inputTarefa);
  
  let url = 'http://127.0.0.1:5000/tarefa/add';
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
    insertList(data.id, data.descricao, data.data_inicio, data.data_conclusao);
    appendAlert('Tarefa adicionada com sucesso!!!', 'success');
  })
  .catch((error) => {
    console.error(error); 
    appendAlert(error.message, 'danger');
  });
}

const atualizarTarefa = async (id, operacao) => {
  const formData = new FormData();
  formData.append('id', id);
  let url = '';
  
  if(operacao == 'iniciar'){
    url = 'http://127.0.0.1:5000/tarefa/iniciar';
  }else{
    url = 'http://127.0.0.1:5000/tarefa/concluir';
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
    insertList(data.id, data.descricao, data.data_inicio, data.data_conclusao);
  })
  .catch((error) => {
    console.error(error); 
    appendAlert(error.message, 'danger');
  });
}


const insertButton = (parent) => {
  let button = document.createElement("button");
  let txt = document.createTextNode("\u00D7");
  button.className = "btn btn-secundary close";
  button.appendChild(txt);
  parent.appendChild(button);
}


const removeElement = () => {
  let close = document.getElementsByClassName("close");

  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/tarefa?id=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

const novaTarefa = () => {
  let inputTarefa = document.getElementById("inputTarefa").value;

  if (inputTarefa === '') {
    appendAlert('Escreva sua nova tarefa!!!', 'warning')
  } else {
    postTarefa(inputTarefa)
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id, descricao, data_inicio, data_conclusao) => {
  var item = [id, descricao, data_inicio, data_conclusao]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("inputTarefa").value = "";
  
  removeElement()
}

const alertPlaceholder = document.getElementById('dynamic-alert')

const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}


function moverElementoDeLista(elementoParaMover, listaOrigem, listaDestino) {
  listaOrigem.removeChild(elementoParaMover);
  listaDestino.appendChild(elementoParaMover);
}

function criarElementoComBotao(id, descricao, listaOrigem, listaDestino, operacao) {
  const liElement = document.createElement('li');
  liElement.className = "list-group-item";
  liElement.textContent = descricao;

  const buttonElement = document.createElement('button');
  buttonElement.className= "btn btn-secundary"
  buttonElement.textContent = operacao;
  buttonElement.addEventListener('click', () => {
    moverElementoDeLista(liElement, listaOrigem, listaDestino);
    atualizarTarefa(id, operacao)
  });

  liElement.appendChild(buttonElement);

  return liElement;
}

function criarElementoSemBotao(descricao) {
  let liElement = document.createElement('li');
  liElement.className = "list-group-item";
  liElement.textContent = descricao;
  return liElement;
}


