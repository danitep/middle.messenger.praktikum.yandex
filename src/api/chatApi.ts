import { Iargs } from '../utils/apiInterfaces';
import { throwError } from '../utils/extraFunctions';
import apiInstance from '../utils/fetch';
import BaseAPI from './baseApi';

const chatAPIInstance = apiInstance;

export class ChatAPI extends BaseAPI {
  _create(args:Iargs) { // post
    const { path, dataToSend } = args;
    return chatAPIInstance.post(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { 'Content-type': 'application/json; charset=utf-8', accept: 'application/json' },
      data: dataToSend,
    });
  }

  _request(args:Iargs) { // get
    const { path } = args;
    return chatAPIInstance.get(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { accept: 'application/json' },
    })
      .then((res:unknown):PromiseLike<unknown> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  _delete(args:Iargs) { // delete
    const { path, dataToSend } = args;
    return chatAPIInstance.delete(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { 'Content-type': 'application/json; charset=utf-8', accept: 'application/json' },
      data: dataToSend,
    });
  }

  _update(args:Iargs) { // put
    const { path, dataToSend } = args;
    return chatAPIInstance.put(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { 'Content-type': 'application/json; charset=utf-8', accept: 'application/json' },
      data: dataToSend,
    })
      .then((res:unknown):PromiseLike<unknown> => {
        console.log(res);
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = (res as XMLHttpRequest).response;
        console.log(data);
        return data;
      });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  createChat(args:Iargs) {
    return this._create({ path: 'chats', dataToSend: args })
      .then((res:unknown):PromiseLike<{id: string}> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        console.log(res);
        const data = JSON.parse((res as XMLHttpRequest).response);
        console.log(data);
        return data;
      });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  getChats(args:Iargs) {
    const { offset = '0', limit = '0', title = '' } = args; // Дописать типа разбор объект с заданием данных заранее, типа 0, 0, ''
    const offsetString = Number(offset) > 0 ? `offset=${args.offset}&` : null;
    const limitString = Number(limit) > 0 ? `limit=${args.limit}&` : null;
    const titleString = (title !== '') ? `title=${args.title}` : null;
    let requestString = 'chats/';
    if (offsetString || limitString || titleString) {
      requestString += '?';
      if (offsetString) requestString += offsetString;
      if (limitString) requestString += limitString;
      if (titleString) requestString += titleString;
    }
    return this._request({ path: requestString });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  deleteChat(args:Iargs) {
    console.log(args);
    return this._delete({ path: 'chats', dataToSend: args })
      .then((res:unknown):PromiseLike<unknown> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  addUserToChat(args:Iargs) {
    return this._update({ path: 'chats/users', dataToSend: args });
  }

  deleteUserFromChat(args:Iargs) {
    return this._delete({ path: 'chats/users', dataToSend: args });
  }

  getChatToken(args:Iargs) {
    return this._create({ path: `chats/token/${args.id}`, dataToSend: args })
      .then((res:unknown):PromiseLike<Iargs> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });
  }
}

const chatApi = new ChatAPI();
export default chatApi;
