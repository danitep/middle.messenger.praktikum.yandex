import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class Chatlabel extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });
  }

  override render(): string {
    return `
        <>
        <li class="chat-label__container" id="{{params.id}}">
            <div class="chat-label__image-container">
                <img class="chat-label__image" src="{{params.imagePath}}">
            </div>
            <div class="chat-label__main-info">
                <p class="chat-label__name">{{params.name}}</p>
                <p class="chat-label__message">
                    {{#if params.isMyMessage}}
                        <span class="chat-label__message_my">Вы: </span>
                    {{/if}}
                    {{params.lastMessage}}
                </p>
            </div>
            <div class="chat-label__additional-info">
                <p class="chat-label__time">{{params.lastMessageTime}}</p>
                {{#if params.hasNewMessages}}
                    {{#if params.isTooManyMessages}}
                        <div class="chat-label__count">
                            <p class="chat-label__count-number">99+</p>
                        </div>
                    {{else}}
                        <div class="chat-label__count">
                            <p class="chat-label__count-number">{{params.newMessagesCount}}</p>
                        </div>
                    {{/if}}
                {{/if}}
            </div>
            
        </li>
        <div class="chat-list__border"></div>
        </>
        `;
  }
}
