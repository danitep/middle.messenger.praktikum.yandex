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
            <div class="additional-popup__image" id="{{params.image_id}}"></div>
            <p class="additional-popup__text">{{params.buttonText}}</p>
        </button>
        `;
  }
}
