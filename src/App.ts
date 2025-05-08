//import * as Pages from './pages/index.js'
import {err404Params, err5xxParams, profileParams, loginParams, signinParams, chatParams} from './utils/pageVariables.js'
import { Login } from "./pages/login";
import { Signin } from "./pages/signin";
import { Err404 } from './pages/err404.js';
import { Err5xx } from './pages/err5xx.js';
import { Profile } from './pages/profile.js';
import { ChatPage } from './pages/chats.js';
import { MainPage } from './pages/MainPage.js';
import Block from './framework/Block.js';



export default class App {

    state: {
        currentPage: string
    };
    appElement:HTMLElement|null;

    events = {
        events: {
            click: this.anchorHandler.bind(this)
        }
    }

    constructor() {
        const currentPage = localStorage.getItem('currentPage');
        if(!currentPage){
            localStorage.setItem("currentPage", "/main");
            this.state = {
                currentPage: '/main',
            };
        }
        else{
            this.state = {
                currentPage: currentPage
            };
        }
        this.appElement = document.getElementById("app");
    }

    updatePage(newPage:Block){
        if (this.appElement){
            this.appElement.replaceWith(newPage.getContent() as Node);
            this.appElement = document.getElementById("app");
        }
    }

    anchorHandler(e:Event){
        const self = this;
        e.preventDefault();
        if(e.target){
            const newPath:string = (e.target as HTMLAnchorElement).pathname;
            self.changePage(newPath);
        }
    }
    
    render(){        
        if (this.appElement){
            switch(true){
                case this.state.currentPage === "/main":
                    let mainPage = new MainPage(this.events);
                    this.updatePage(mainPage)
                    break;
                case this.state.currentPage === "/login":
                    let login = new Login(Object.assign(loginParams, this.events));
                    this.updatePage(login)
                    break;
                case this.state.currentPage === "/signin":
                    let signin = new Signin(Object.assign(signinParams, this.events));
                    this.updatePage(signin)
                    break;
                case this.state.currentPage === "/err404":
                    let err404 = new Err404(Object.assign(err404Params, this.events));
                    this.updatePage(err404)
                    break;
                case this.state.currentPage === "/err5xx":
                    let err5xx = new Err5xx(Object.assign(err5xxParams, this.events));
                    this.updatePage(err5xx)
                    break;
                case this.state.currentPage === "/profile":
                    let profilePage = new Profile(Object.assign(profileParams, this.events))
                    this.updatePage(profilePage)
                    break;
                case this.state.currentPage === "/chats":
                    let chatPage = new ChatPage(Object.assign(chatParams, this.events));
                    this.updatePage(chatPage);
                    break;
            }
        }
    }

    changePage(page:string){
        this.state.currentPage = page;
        this.render();
    }
}


