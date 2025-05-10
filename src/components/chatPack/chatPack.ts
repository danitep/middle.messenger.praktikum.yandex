import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import ChatMessage from '../chatMessage/chatMessage';

export default class ChatPack extends Block {
  constructor(props:PropsWithChildren) {
    const messagesData:PropsWithChildren[] = props.messages as PropsWithChildren[];
    const chatMessages:ChatMessage[] = [];

    messagesData.forEach((messageData:PropsWithChildren):void => {
      chatMessages.push(new ChatMessage({
        params: messageData,
      }));
    });
    super({
      ...props,
      chatMessages,
    });
  }

  override render(): string {
    return `
        <div class="chat__pack">
            <p class="chat__date">{{date}}</p>
            <div class="chat__messages-container">
                {{{chatMessages}}}
            </div>
        </div>
        `;
  }
}
