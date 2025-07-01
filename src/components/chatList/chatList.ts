import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import ChatBorderLine from '../chatBorderLine/chatBorderLine';
import ChatListContainer from '../chatListContainer/chatListContainer';

export default class ChatList extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
      chatBorderLine: new ChatBorderLine(),
      chatListElement: new ChatListContainer(props),
    });
  }

  override render(): string {
    return `
        <div class="chat-list">
            <div class="chat-list__header">
                <a class="chat-list__link" href="{{profileLink}}">Профиль</a>
                <input type="text" 
                class="chat-list__search" 
                id="search" 
                name="search" 
                onChange={}
                placeholder="Поиск"/>
            </div>
            {{{chatBorderLine}}}
            {{{chatListElement}}}
        </div>
        `;
  }
}
