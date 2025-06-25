import { Iargs } from '../utils/apiInterfaces';
import { PropsWithChildren } from '../utils/blockInterfaces';
import { throwError } from '../utils/extraFunctions';
import apiInstance from '../utils/fetch';
import BaseAPI from './baseApi';

const userApiInstance = apiInstance;

export class UserAPI extends BaseAPI {
  _create(args:Iargs) { // post
    const { path, dataToSend } = args;
    return userApiInstance.post(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { 'Content-type': 'application/json; charset=utf-8', accept: 'application/json' },
      data: dataToSend,
    });
  }

  _request(args:Iargs) { // get
    const { path } = args;
    return userApiInstance.get(path, {
      credentials: 'include',
      mode: 'cors',
      headers: { accept: 'application/json' },
    })
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

  _update(args:Iargs) { // put для фото аватара (отдельно написать для всего остального или переделать if'ами)
    const { path, dataToSend } = args;
    const { formData } = dataToSend;
    let request;
    if (formData) { // если есть файл
      request = userApiInstance.put(path, {
        credentials: 'include',
        mode: 'cors',
        headers: { accept: 'application/json' },
        formData,
      });
    } else { // если нет файла
      request = userApiInstance.put(path, {
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-type': 'application/json; charset=utf-8', accept: 'application/json' },
        data: dataToSend,
      });
    }
    return request;
  }

  findUser(args:Iargs) {
    return this._create({ path: 'user/search', dataToSend: args })
      .then((res:unknown):PromiseLike<PropsWithChildren[]> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });
  }

  loadAvatar(args:Iargs) {
    return this._update({ path: 'user/profile/avatar', dataToSend: args })
      .then((res:unknown):PromiseLike<PropsWithChildren[]> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });
  }

  changeProfileData(args:Iargs) {
    return this._update({ path: 'user/profile', dataToSend: args })
      .then((res:unknown):PromiseLike<PropsWithChildren[]> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });
  }

  changePassword(args:Iargs) {
    return this._update({ path: 'user/password', dataToSend: args })
      .then((res:unknown):PromiseLike<PropsWithChildren[]> => {
        if ((res as XMLHttpRequest).status >= 400) {
          throwError(res);
        }
        const data = JSON.parse((res as XMLHttpRequest).response);
        return data;
      });
  }
}

const userApi = new UserAPI();
export default userApi;
