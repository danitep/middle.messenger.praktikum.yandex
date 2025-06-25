import authApi from '../api/authApi';
import router from '../components/router/router';
import { Iargs } from './apiInterfaces';
import store from './store';

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

export const addWebSocketListeners = () => {
  const socket:WebSocket = store.getState().webSocket;
  socket.addEventListener('open', (event) => {
    console.log(event);
    console.log('Соединение установлено');

    const interval = setInterval(() => {
      socket.send(JSON.stringify({
        type: 'ping',
      }));
    }, 30000);

    socket.addEventListener('close', (event) => { // вешаем здесь, потому что надо убрать interval
      clearInterval(interval); // Очищаем интервал при закрытии соединения
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }

      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });
  });

  socket.addEventListener('message', (event) => {
    // по сути тут надо будет вставить какую-то самодельную функцию,
    // которая будет добавлять новые сообщения в чат
    console.log('Получены данные', event.data);
    console.log(JSON.parse(event.data));
  });

  socket.addEventListener('error', (event) => {
    const e = event as ErrorEvent; // чтобы eslint не ругался на message
    console.log('Ошибка', e.message);
  });
};

export const createZeroTimeDate = (messageTime: string) => {
  const messageFullDateArray = new Date(messageTime).toString().split(' ');
  messageFullDateArray[4] = '00:00:00';
  const zeroTimeDate = new Date(messageFullDateArray.join(' '));
  return zeroTimeDate;
};
