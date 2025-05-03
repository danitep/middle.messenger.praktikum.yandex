import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";
import { ChatHeader } from "../chatHeader/chatHeader";
import { ChatWindow } from "../chatWindow/chatWindow";

export class Chat extends Block{
    constructor (props:PropsWithChildren){
        super({
          ...props,
          chatHeader: new ChatHeader({params:props.openedChat}),
          chatWindow: new ChatWindow({packs: (props.openedChat as PropsWithChildren).packs as PropsWithChildren})

        });
    }

    override render(): string {
        return`
        <div class="chat {{#if isChatChosen}}{{else}} chat_empty{{/if}}">
            {{#if isChatChosen}}
                {{{chatHeader}}}
                {{{chatWindow}}}
                <div class="chat__menu">
                    <button class="chat__button {{#if openedChat.isAddActive}} chat__button_active{{/if}}"></button>
                    <form class="chat__form">
                        <input type="text" 
                            class="chat__input" 
                            id="message" 
                            name="message" 
                            onChange={}
                            placeholder="Сообщение"
                            required         
                            minLength=1/>
                        <button class="chat__submit" type="submit"></button>
                    </form>
                </div>
            {{else}}
                <p>Выберите чат чтобы отправить сообщение</p>
            {{/if}}
        </div>
        `
    }
}