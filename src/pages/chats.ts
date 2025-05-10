import Chat from '../components/chat/chat';
import ChatHeader from '../components/chatHeader/chatHeader';
import ChatList from '../components/chatList/chatList';
import ChatMenu from '../components/chatMenu/chatMenu';
import ChatPopup from '../components/chatPopup/chatPopup';
import ChatSettingsPopup from '../components/chatSettingsPopup/chatSettingsPopup';
import ChatWindow from '../components/chatWindow/chatWindow';
import Block from '../framework/Block';
import { PropsWithChildren } from '../utils/blockInterfaces';

const chatListPropsFilter = (key: string):boolean => key === 'chatList' || key === 'profileLink';
const chatPropsFilter = (key: string):boolean => key === 'isChatChosen' || key === 'openedChat' || key === 'profileLink';

export default class ChatPage extends Block {
  constructor(props:PropsWithChildren) {
    const propsForChatList:PropsWithChildren = Object.keys(props).filter((key:string) => chatListPropsFilter(key)).reduce((obj: PropsWithChildren, key:string) => {
      obj[key] = props[key];
      return obj;
    }, {});
    const propsForChat:PropsWithChildren = Object.keys(props).filter((key:string) => chatPropsFilter(key)).reduce((obj: PropsWithChildren, key:string) => {
      obj[key] = props[key];
      return obj;
    }, {});

    const chatSettingsPopupsData:PropsWithChildren[] = props.popups as PropsWithChildren[];
    const chatAddRemovePopupsData:PropsWithChildren[] = props.addRemovePopups as PropsWithChildren[];

    const chatSettingsPopups:ChatSettingsPopup[] = [];
    const chatAddRemovePopups:ChatPopup[] = [];

    chatSettingsPopupsData.forEach((settngsPopupData:PropsWithChildren):void => {
      chatSettingsPopups.push(new ChatSettingsPopup(settngsPopupData));
    });
    chatAddRemovePopupsData.forEach((popupData:PropsWithChildren):void => {
      chatAddRemovePopups.push(new ChatPopup(popupData));
    });

    super({
      ...props,
      chatList: new ChatList(propsForChatList),
      chat: new Chat(propsForChat),
      chatPopups: chatAddRemovePopups,
      chatSettingsPopups,
    });

    const newProps = props;
    const events = {
      events: {
        select_chat: this.onChatSelect.bind(this),
        'add-remove_click': this.onAddRemoveRowClick.bind(this),
      },
    };
    const propsWithEvents = Object.assign(newProps, events);

    this.setProps(propsWithEvents);
  }

  onAddRemoveRowClick(e:Event) { // для обработки кнопок малых popup'ов в чате
    const targetId = (e.target as HTMLElement).id ? (e.target as HTMLElement).id : (e.target as HTMLElement).parentElement?.id;

    if (targetId === 'add_user' || targetId === 'remove_user') {
      const button = document.querySelector('#addRemove') as HTMLButtonElement;
      if (button) {
        button.blur();
      }

      let popup;
      if (targetId === 'add_user') {
        popup = this._element?.querySelector('#popup_add');
      }
      if (targetId === 'remove_user') {
        popup = this._element?.querySelector('#popup_remove');
      }

      if (popup) {
        popup.classList.add('chat-popup__layout_active');
      }
    }
    if (targetId === 'add_media' || targetId === 'add_file' || targetId === 'add_geo') {
      const button = document.querySelector('.chat__button_active');
      button?.classList.remove('chat__button_active');
    }
  }

  onButtonClick(e:Event) { // для открытия popup'ов чата
    if ((e.target as HTMLElement).id === 'addRemove') { // Добавить/удалить чат
      (e.target as HTMLElement).classList.add('chat-header__button_active');
    }
    if ((e.target as HTMLElement).id === 'AddToMessage') { // Добавить элемент к сообщению
      (e.target as HTMLElement).classList.add('chat__button_active');
    }
  }

  onButtonBlur(e:Event) { // когда надо закрыть popup'ы чата
    if ((e.target as HTMLElement).id === 'addRemove') { // Добавить/удалить чат
      (e.target as HTMLElement).classList.remove('chat-header__button_active');
    }
    if ((e.target as HTMLElement).id === 'AddToMessage') { // Добавить элемент к сообщению
      (e.target as HTMLElement).classList.remove('chat__button_active');
    }
  }

  onChatSelect(e:Event) { // для выбора чата
    const allLabels = this._element?.querySelectorAll('.chat-label__container');
    if ((e.target as HTMLElement).className.includes('chat-label')) {
      allLabels?.forEach((label) => {
        label.className = 'chat-label__container';
      });
      const chosenLabel = (e.target as HTMLElement).closest('.chat-label__container');
      if (chosenLabel) {
        chosenLabel.className = 'chat-label__container chat-label__container_active';
        const chatProps = this.children.chat.props as PropsWithChildren;
        let chosenChat:PropsWithChildren|undefined;
        if (this.props.chats) {
          chosenChat = (this.props.chats as PropsWithChildren[]).find((chat) => chat.id.toString() === chosenLabel.id);
          if (chosenChat) { // пока заглушка, потом поменять при добавлении всех чатов
            chatProps.openedChat = chosenChat;
            chatProps.isChatChosen = true;
          } else { // на случай, если сбой и чата с эти id нет(по идее такого не должно быть, но пока заглушка)
            chatProps.isChatChosen = false;
          }
        }

        if (chosenChat) { // пока заглушка, потом поменять при добавлении всех чатов
          this.children.chat.setProps({
            ...chatProps,
            chatHeader: new ChatHeader({ params: chatProps.openedChat }),
            chatWindow: new ChatWindow({ packs: (chatProps.openedChat as PropsWithChildren).packs as PropsWithChildren }),
            chatMenu: new ChatMenu({}),
            events: {
              chat_button_click: this.onButtonClick.bind(this),
              button_blur: this.onButtonBlur.bind(this),
            },
          });
        } else { // на случай, если сбой и чата с эти id нет(по идее такого не должно быть, но пока заглушка)
          this.children.chat.setProps({
            ...chatProps,
          });
        }
      }
    }
  }

  override render(): string {
    return `
        <div id="app">
            <main class="page__chat">
                {{{chatList}}}
                {{{chat}}}
                {{{chatSettingsPopups}}}
                {{{chatPopups}}}
            </main>
        </div>
        `;
  }
}
