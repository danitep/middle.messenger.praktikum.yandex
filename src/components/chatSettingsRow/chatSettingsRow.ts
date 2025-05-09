import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class ChatSettingsRow extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });
  }

  override render(): string {
    return `
        <button class="additional-popup__button" 
        popovertarget="{{params.popoverTarget}}" 
        popovertargetaction="hide"
        id="{{params.id}}"
        >
            <img class="additional-popup__image" src="{{params.imageLink}}"/>
            <p class="additional-popup__text">{{params.buttonText}}</p>
        </button>
        `;
  }
}
