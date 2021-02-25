import API from './api';

const modal = document.querySelector('.modal');
const inputForm = document.querySelector('.form-input');
const addForm = document.querySelector('.add-form');
const usersList = document.querySelector('.list');
const chatForm = document.querySelector('.chat-form');
const inputChat = document.querySelector('.chat-input');
const charBox = document.querySelector('.chat-box');
const tipNickname = document.querySelector('.tip-nickname');
const tipMsg = document.querySelector('.tip-msg');
const url = 'wss://websocket-serv.herokuapp.com/ws'; ////const url = 'wss://localhost:7070/ws';
const api = new API(url);
let ws = api.getWebSocket();

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const target = e.currentTarget.checkValidity();
  if (!target) { // проверяем валидна/невалидна вся форма
    tipNickname.classList.add('visible'); //если невалидна показываем ошибку
    setTimeout(() => { // убираем подсказку
      tipNickname.classList.remove('visible');
    }, 3000);
    return //прерываем дальнейшее выполнение
  }
  if (ws.readyState === WebSocket.OPEN) {
    console.log(inputForm.value)
    ws.send(api.getRequest('add user', inputForm.value)); //создаём и отправляем объект запроса на бэк
    addForm.reset();
    } else {
    ws = api.getWebSocket(); // Reconnect
  }
});

chatForm.addEventListener('submit', (e)=> {
  e.preventDefault();
  const target = e.currentTarget.checkValidity();
  if (!target || !api.userNickname) { // проверяем валидна/невалидна вся форма
    tipMsg.classList.add('visible'); //если невалидна показываем ошибку
    setTimeout(() => { // убираем подсказку
      tipMsg.classList.remove('visible');
    }, 3000);
    return //прерываем дальнейшее выполнение
  }
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(api.getRequest('message', api.userNickname, inputChat.value)); //создаём и отправляем объект запроса на бэк
    chatForm.reset();
    } else {
    ws = api.getWebSocket(); // Reconnect
  }
})

ws.addEventListener('open', () => {
  console.log('connected');
  // After this we can send messages
  ws.send(api.getRequest('get users')); //создаём и отправляем объект запроса на бэк
});

ws.addEventListener('message', (e) => {
  api.responseHandler(e); //обрабатываем запрос
  api.nicknameValid(e); //проверяем оригинальность никнэйма
  if (api.type === 'nickname is valid') modal.classList.add('hidden'); //если оригинально закрываем модалку
  if (api.type === 'user added') {
    usersList.innerHTML='';
    api.serverResponse.forEach((user) => { //отрисовываем список юзеров и меняем имя текущего пользователя на You
      const el = document.createElement('li');
      el.innerHTML = user === 'You' ? `<span>${user}<span>` : `${user}`;
      usersList.append(el);
    })
  } else if (api.type === 'users list') {
    usersList.innerHTML=''; //продолжаем отрисовывать список юзеров
    api.serverResponse.forEach((user) => {
      const el = document.createElement('li');
      el.innerHTML = user === 'You' ? `<span>${user}<span>` : `${user}`;
      usersList.append(el);
    })
  } else if (api.type === 'message') { //отрисовываем сообщения в чате
    const el = document.createElement('div');
    const userNickname = api.userMessage(api.serverResponse.name);
    api.userMessage(api.serverResponse.name);
    el.innerHTML = `
    <h4 class=${api.userTitleStyle}>${userNickname} ${api.getDate()}</h4>
    <p>${api.serverResponse.text}</p>`;
    el.setAttribute('class', api.userMessageStyle);
    charBox.append(el);
  }
});

window.addEventListener('beforeunload', () => {//load при F5 не работает в Firefox
  ws.send(api.getRequest('delete', api.userNickname)); //создаём и отправляем объект запроса на бэк
  ws.close()    
});

ws.addEventListener('error', () => {
  console.log('error');
});

