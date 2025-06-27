import { Iargs } from '../utils/apiInterfaces';
import { throwError } from '../utils/extraFunctions';
import apiInstance from '../utils/fetch';
import BaseAPI from './baseApi';

const authApiInstance = apiInstance;

export class AuthAPI extends BaseAPI {
  _create(args:Iargs) { // post
    const { path, dataToSend } = args;
    return authApiInstance.post(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { 'Content-type': 'application/json; charset=utf-8', accept: 'application/json' },
      data: dataToSend,
    });
  }

  _request(args:Iargs) { // get
    const { path } = args;
    return authApiInstance.get(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { accept: 'application/json' },
    })
      .then((res:unknown):PromiseLike<{id: string}> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  register(args:Iargs) {
    return this._create({ path: 'auth/signup', dataToSend: args })
      .then((res:unknown):PromiseLike<{id: string}> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  login(args:Iargs) {
    return this._create({ path: 'auth/signin', dataToSend: args })
      .then((res:unknown):PromiseLike<void> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        return (res as XMLHttpRequest).response;
      });// напоминалка: после каждого вызова функции прописываем then, catch или finally, и в них обрабатываем
  }

  getUserInfo() {
    return this._request({ path: 'auth/user' });
  }

  logout() {
    return this._create({ path: 'auth/logout', dataToSend: '' })
      .then((res:unknown):PromiseLike<{id: string}> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        return (res as XMLHttpRequest).response;
      });
  }
}

const authApi = new AuthAPI();
export default authApi;
