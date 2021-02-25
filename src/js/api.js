/* eslint-disable class-methods-use-this */
// import { container } from './app';

export default class API {
  constructor(url) {
    this.url = url;
    this.serverResponse; //записываем содержание ответа сервера (текст, список юзеров)
    this.userNickname; //текущее имя пользователя
    this.type; //тип ответа сервера
    this.response; //само тело ответа сервера
    this.userTitleStyle; //стилизация титула сообщения в чате, зависит текущий юзер или нет
    this.userMessageStyle; // также стилизация самого ответа
    this.currentName = 'You'; //переписываем текущее имя пользователя для отображения
  }

  getWebSocket() {
    return new WebSocket(this.url);
  }

  getRequest(type, nickname, text) { //создаем объект запроса на сервер
    const data = JSON.stringify({type: type, nickname: nickname, text: text});
    console.log(data);
    return data;
  }

  responseHandler(e) {
    this.response = JSON.parse(e.data); //парсим ответ сервера
    this.type = this.response.type; //записываем тип ответа
    if (this.type === 'error') { //ответ ошибка
      this.serverResponse = this.response.text; //текст ошибки
      console.log(this.serverResponse);
    } else if (this.type === 'users list') { //список юзеров
      this.serverResponse = this.response.users.map((user) => {
        if (user === this.userNickname) { //переписываем на You текущее имя юзера в списке
          return user = this.currentName;
        } else {
          return user; //все остальные имена
        }
      });
      console.log(this.serverResponse);
    } else if (this.type === 'user added') { //добавляем юзера
      this.serverResponse = this.response.users.map((user) => {
        if (user === this.userNickname) { //переписываем на You текущее имя юзера в списке
          return user = this.currentName;
        } else {
          return user; //все остальные имена
        }
      });
      console.log(this.serverResponse);
    } else if (this.type ==='message') { //обрабатываем сообщение
      this.serverResponse = this.response;
      console.log(this.serverResponse);
    }
  }

  getDate() { //получаем текущею дату сообщения
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const now = hour + '.' + minutes + ' ' + day + '.' + month + '.' + year;
    return now; 
  }

  nicknameValid(e) { //обрабатываем оригинальный никнэйм и записываем его
    if (this.type === 'nickname is valid') {
      this.userNickname = this.response.nickname;
      console.log(this.userNickname);
    }
  }

  userMessage(nickname) { //стилизуем сообшения
    console.log(nickname);
    if (nickname === this.userNickname) { //для сообщений текущего пользователя
      this.userMessageStyle = 'current-user-message';
      this.userTitleStyle = 'current-user-title';
      return this.currentName;
    } else { //для других пользователей
      this.userMessageStyle = 'other-user-message';
      this.userTitleStyle = 'other-user-title';
      return nickname;
    }
  }
}
