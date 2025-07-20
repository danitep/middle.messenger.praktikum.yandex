import authApi from '../api/authApi';
import router from '../components/router/router';
import { Iargs } from './apiInterfaces';

export const queryStringify = (data: {[key: string]: any}) => {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  // Здесь достаточно и [object Object] для объекта
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => `${result}${key}=${encodeURIComponent(data[key])}${index < keys.length - 1 ? '&' : ''}`, '?');
};

export const is500Error = (err:Error):void => {
  if (err.message.includes('500')) {
    router.go('/err5xx');
  }
};

export const is401Error = (err:Error):void => {
  if (err.message.includes('401')) {
    router.go('/');
  }
};

export const checkIfLoggedOut = () => {
  authApi.getUserInfo()
    .catch((err:Error) => {
      if (err.message.includes('401')) {
        router.go('/');
      }
    });
};

export const checkIfAuthorized = () => {
  authApi.getUserInfo()
    .then((data:Iargs) => {
      if (data) {
        router.go('/messenger');
      }
    })
    .catch((err:Error) => {
      if (err.message.includes('401')) {
        console.log('unauthorized');
      }
    });
};

export const throwError = (res:unknown) => {
  throw new Error(`${(res as XMLHttpRequest).status.toString()} - ${JSON.parse((res as XMLHttpRequest).response).reason}`);
};

export const createZeroTimeDate = (messageTime: string) => {
  const messageFullDateArray = new Date(messageTime).toString().split(' ');
  messageFullDateArray[4] = '00:00:00';
  const zeroTimeDate = new Date(messageFullDateArray.join(' '));
  return zeroTimeDate;
};
