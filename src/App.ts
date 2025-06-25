// import * as Pages from './pages/index.js'
import router, { Router } from './components/router/router';

export default class App {
  router:Router;

  // socket: WebSocket;

  constructor() {
    this.router = router;
    /*
    this.socket = new WebSocket('ya-praktikum.tech/api/v2');

    this.socket.addEventListener('open', (event) => {
      console.log('Соединение установлено');
      console.log(event);
    });
    this.socket.addEventListener('message', (event:any) => {
      console.log('Сообщение от сервера:', event.data);
    });

    // Дождитесь появления в консоли сообщения об установке соединения
    if (this.socket.readyState === 1) {
      this.socket.send('Привет, сервер!');
    }
    */
  }

  render() {
    this.router.start();
  }
}
