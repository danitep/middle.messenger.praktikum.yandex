// import * as Pages from './pages/index.js'
import {
  err404Params, err5xxParams, profileParams, loginParams, signinParams, chatParams,
} from './utils/pageVariables';
import Login from './pages/login';
import Signin from './pages/signin';
import Err404 from './pages/err404';
import Err5xx from './pages/err5xx';
import Profile from './pages/profile';
import ChatPage from './pages/chats';
import MainPage from './pages/MainPage';
import Block from './framework/Block';

export default class App {
  state: {
        currentPage: string
    };

  appElement:HTMLElement|null;

  events = {
    events: {
      click: this.anchorHandler.bind(this),
    },
  };

  pages:{[key: string]: Block};

  constructor() {
    this.pages = {
      mainPage: new MainPage(this.events),
      login: new Login(Object.assign(loginParams, this.events)),
      signin: new Signin(Object.assign(signinParams, this.events)),
      err404: new Err404(Object.assign(err404Params, this.events)),
      err5xx: new Err5xx(Object.assign(err5xxParams, this.events)),
      profilePage: new Profile(Object.assign(profileParams, this.events)),
      chatPage: new ChatPage(Object.assign(chatParams, this.events)),
    };
    const currentPage = localStorage.getItem('currentPage');
    if (!currentPage) {
      localStorage.setItem('currentPage', '/main');
      this.state = {
        currentPage: '/main',
      };
    } else {
      this.state = {
        currentPage,
      };
    }
    this.appElement = document.getElementById('app');
    this.render();
  }

  updatePage(newPage:Block) {
    if (this.appElement) {
      this.appElement.replaceWith(newPage.getContent() as Node);
      this.appElement = document.getElementById('app');
    }
  }

  anchorHandler(e:Event) {
    const self = this;
    e.preventDefault();
    if (e.target) {
      const newPath:string = (e.target as HTMLAnchorElement).pathname;
      self.changePage(newPath);
    }
  }

  render() {
    if (this.appElement) {
      switch (true) {
        case this.state.currentPage === '/main':
          this.updatePage(this.pages.mainPage);
          break;
        case this.state.currentPage === '/login':
          this.updatePage(this.pages.login);
          break;
        case this.state.currentPage === '/signin':
          this.updatePage(this.pages.signin);
          break;
        case this.state.currentPage === '/err404':
          this.updatePage(this.pages.err404);
          break;
        case this.state.currentPage === '/err5xx':
          this.updatePage(this.pages.err5xx);
          break;
        case this.state.currentPage === '/profile':
          this.updatePage(this.pages.profilePage);
          break;
        case this.state.currentPage === '/chats':
          this.updatePage(this.pages.chatPage);
          break;
        default:
          this.updatePage(this.pages.err404);
          break;
      }
    }
  }

  changePage(page:string) {
    this.state.currentPage = page;
    this.render();
  }
}
