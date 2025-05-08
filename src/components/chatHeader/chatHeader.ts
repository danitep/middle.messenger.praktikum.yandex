import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";

export class ChatHeader extends Block{
    constructor (props:PropsWithChildren){
        super({
          ...props
        });
    }

    override render(): string {
        return`
        <div class="chat-header">
            <div class="chat-header__image-container">
                <img class="chat-header__image" src="{{params.imagePath}}">
            </div>
            <p class="chat-header__name">{{params.name}}</p>
            <button class="chat-header__button {{#if params.isSettingsActive}}chat-header__button_active{{/if}}" 
                id="addRemove" 
                type="button" popovertarget="popup_settings"
            ></button>
        </div>
        `
    }
}

