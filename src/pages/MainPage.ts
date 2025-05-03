import Block from "../framework/Block";
import { PropsWithChildren } from "../utils/blockInterfaces";


export class MainPage extends Block{
    constructor (props:PropsWithChildren){
        super({
            ...props,
        });
    }

    override render(): string {
        return`
        <div id="app">
            <main class="page__index">
                <ul class="page__link-list">
                <li><a class="page__index-link" href="./err404">на страницу ошибки 404</a></li>
                <li><a class="page__index-link" href="./err5xx">на страницу ошибки 5xx</a></li>
                <li><a class="page__index-link" href="./login">на страницу входа</a></li>
                <li><a class="page__index-link" href="./signin">на страницу регистрации</a></li>
                <li><a class="page__index-link" href="./profile">на страницу профиля</a></li>
                <li><a class="page__index-link" href="./chats">на страницу с чатами</a></li>
                </ul>   
            </main>
        </div>
        `
    }
}

