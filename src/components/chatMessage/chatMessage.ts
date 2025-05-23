import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class ChatMessage extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,

    });
  }

  override render(): string {
    return `
        {{#if params.isText}}
            <div class="chat-message 
            {{#if params.isSideChanged}}chat-message_side-changed{{/if}}
            {{#if params.isMessageMine}}chat-message_my{{/if}}
            {{#if params.isRead}}chat-message_read{{/if}}
            ">
                <p class="chat-message__text">{{params.content.text}}</p>
                <p class="chat-message__time 
                {{#if params.isMessageMine}}chat-message__time_my{{/if}}
                {{#if params.isRead}}chat-message__time_read{{/if}}
                ">{{params.time}}</p>
            </div>    
        {{/if}}
        {{#if params.isImage}}
            <div class="chat-message
            chat-message_content-image
            {{#if params.isSideChanged}}chat-message_side-changed{{/if}}
            {{#if params.isMessageMine}}chat-message_my-image{{/if}}
            {{#if params.isRead}}chat-message_read{{/if}}
            ">
                <img class="chat-message__image" src="{{params.content.imageLink}}"/>
                <p class="chat-message__time
                chat-message__time_with-image 
                {{#if params.isMessageMine}}chat-message__time_my{{/if}}">
                    {{params.time}}
                </p>
            </div>   
        {{/if}}
        `;
  }
}
