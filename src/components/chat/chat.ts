import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import ChatHeader from '../chatHeader/chatHeader';
import ChatMenu from '../chatMenu/chatMenu';
import ChatWindow from '../chatWindow/chatWindow';

export default class Chat extends Block {
  constructor(props:PropsWithChildren) {
    delete props.events;
    if (props.isChatChosen) {
      super({
        ...props,
        chatHeader: new ChatHeader({ params: props.openedChat }),
        chatWindow: new ChatWindow({ packs: (props.openedChat as PropsWithChildren).packs as PropsWithChildren }),
        chatMenu: new ChatMenu({}),
      });
    } else {
      super({
        ...props,
      });
    }
  }

  override render(): string {
    return `
        <div class="chat {{#if isChatChosen}}{{else}} chat_empty{{/if}}">
            {{#if isChatChosen}}
                {{{chatHeader}}}
                {{{chatWindow}}}
                {{{chatMenu}}}
            {{else}}
                <p>Выберите чат чтобы отправить сообщение</p>
            {{/if}}
        </div>
        `;
  }
}
