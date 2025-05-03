import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";

export class ChatPopup extends Block{
    constructor (props:PropsWithChildren){
        super({
          ...props
        });
    }

    override render(): string {
        return`
        <div class="chat-popup__layout {{#if isOpened}} {{else}}chat-popup__layout_hidden{{/if}}">
            <form class="chat-popup">
                {{#if isAdd}}
                    <p class="chat-popup__title">{{addPopup.title}}</p>

                    <p class="chat-popup__span">Логин</p>
                    <input type="text" 
                            class="chat-popup__input" 
                            id="login" 
                            name="login" 
                            onChange={}
                            placeholder="Логин"
                            value="{{username}}"
                            required         
                            minLength=1/>
                    <button class="chat-popup__submit-button" type="submit">{{addPopup.buttonText}}</button>
                {{else}}
                    <p class="chat-popup__title">{{removePopup.title}}</p>

                    <p class="chat-popup__span">Логин</p>
                    <input type="text" 
                            class="chat-popup__input" 
                            id="login" 
                            name="login" 
                            onChange={}
                            placeholder="Логин"
                            value="{{username}}"
                            required         
                            minLength=1/>
                    <button class="chat-popup__submit-button" type="submit">{{removePopup.buttonText}}</button>
                {{/if}}
            </form>
        </div>
        `
    }
}

