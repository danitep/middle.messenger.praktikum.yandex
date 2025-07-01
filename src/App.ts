// import * as Pages from './pages/index.js'
import router, { Router } from './components/router/router';

export default class App {
  router:Router;

  // socket: WebSocket;

  constructor() {
    this.router = router;
  }

  render() {
    this.router.start();
  }
}
