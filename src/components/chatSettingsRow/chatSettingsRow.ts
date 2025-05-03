import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";

export class ChatSettingsRow extends Block{
    constructor (props:PropsWithChildren){
        super({
          ...props,
        });
    }

    override render(): string {
        return`
        <button class="additional-popup__container">
            <img class="additional-popup__image" src="{{params.imageLink}}"/>
            <p class="additional-popup__text">{{params.buttonText}}</p>
        </button>
        `
    }
}

