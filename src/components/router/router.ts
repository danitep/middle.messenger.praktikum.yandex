/* eslint-disable no-else-return */
import Block from '../../framework/Block';
import ChatPage from '../../pages/chats';
import Err404 from '../../pages/err404';
import Err5xx from '../../pages/err5xx';
import Login from '../../pages/login';
import MainPage from '../../pages/MainPage';
import Profile from '../../pages/profile';
import Signin from '../../pages/signin';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import {
  loginParams,
  signinParams,
  err404Params,
  err5xxParams,
  profileParams,
  chatParams,
} from '../../utils/pageVariables';
import Route from '../route/route';

const anchorHandler = (e:Event) => {
  e.preventDefault();
  if (e.target) {
    const newPath:string = (e.target as HTMLAnchorElement).pathname;
    router.go(newPath);
  }
};

const events = {
  events: {
    click: anchorHandler,
  },
};

export class Router {
  routes: Route[] = [];

  history: History | unknown;

  static __instance: Router;

  _currentRoute: Route | null | unknown;

  _rootQuery: string = '';

  constructor(rootQuery:string) {
    if (Router.__instance) {
      // eslint-disable-next-line no-constructor-return
      return Router.__instance;
    } else {
      this.routes = [];
      this.history = window.history;
      this._currentRoute = null;
      this._rootQuery = rootQuery;

      Router.__instance = this;
    }
  }

  use(pathname:string, block:typeof Block, props:PropsWithChildren) {
    const route = new Route(pathname, block, Object.assign(props, { rootQuery: this._rootQuery }));

    this.routes.push(route);

    return this;
  }

  start() {
    window.onpopstate = ((event) => {
      console.log((event.currentTarget as Window).location.pathname);
      this._onRoute((event.currentTarget as Window).location.pathname);
    });
    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname:string) {
    let route = this.getRoute(pathname);
    if (!route) {
      route = this.getRoute('/err404');

      if (this._currentRoute && this._currentRoute instanceof Route && this._currentRoute !== route) {
        this._currentRoute = route;
        window.location.pathname = '/err404';
      }
      route?.render();
    }

    if (this._currentRoute && this._currentRoute instanceof Route && this._currentRoute !== route) {
      this._currentRoute = route;
      window.location.pathname = pathname;
    }

    route?.render();
  }

  go(pathname:string) {
    if (this.history && this.history instanceof History) {
      this.history.pushState({}, '', pathname);
    }
    this._onRoute(pathname);
  }

  back() {
    if (this.history && this.history instanceof History) {
      this.history.back();
    }
  }

  forward() {
    if (this.history && this.history instanceof History) {
      this.history.forward();
    }
  }

  getRoute(pathname:string) {
    const route: Route|undefined = this.routes.find((route) => route.match(pathname));
    return route;
  }
}

const router = new Router('#app');

router
  .use('/main', MainPage, events)
  .use('/', Login, Object.assign(loginParams, events))
  .use('/sign-up', Signin, Object.assign(signinParams, events))
  .use('/err404', Err404, Object.assign(err404Params, events))
  .use('/err5xx', Err5xx, Object.assign(err5xxParams, events))
  .use('/settings', Profile, Object.assign(profileParams, events))
  .use('/messenger', ChatPage, Object.assign(chatParams, events));
export default router;
