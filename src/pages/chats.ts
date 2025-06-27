import chatApi, { ChatAPI } from '../api/chatApi';
import userApi, { UserAPI } from '../api/userApi';
import Chat from '../components/chat/chat';
import ChatHeader from '../components/chatHeader/chatHeader';
import ChatList from '../components/chatList/chatList';
import ChatMenu from '../components/chatMenu/chatMenu';
import ChatPack from '../components/chatPack/chatPack';
import ChatPopup from '../components/chatPopup/chatPopup';
import ChatSettingsPopup from '../components/chatSettingsPopup/chatSettingsPopup';
import ChatSubMenu from '../components/chatSubMenu/chatSubMenu';
import ChatWindow from '../components/chatWindow/chatWindow';
import router, { Router } from '../components/router/router';
import Block from '../framework/Block';
import { Iargs } from '../utils/apiInterfaces';
import { PropsWithChildren } from '../utils/blockInterfaces';
import {
  chatListPropsFilter, chatLoader, chatPropsFilter, chatsParser, debounce,
} from '../utils/chatFunctions';
import {
  checkIfLoggedOut,
  createZeroTimeDate,
  is401Error,
  is500Error,
} from '../utils/extraFunctions';
import { monthForDate } from '../utils/pageVariables';
import store, { Store } from '../utils/store';

export default class ChatPage extends Block {
  chatApi: ChatAPI;

  userApi: UserAPI;

  store: Store;

  router:Router;

  constructor(props:PropsWithChildren) {
    checkIfLoggedOut();
    super({
      ...props,
    });

    this.chatApi = chatApi;
    this.userApi = userApi;
    this.store = store;
    this.router = router;

    this.chatApi.getChats({ offset: '0', limit: '10', title: '' })
      .then((data) => {
        const newProps = this.props as PropsWithChildren;
        const [chatListArray, chatArray] = chatsParser(data as PropsWithChildren[]);

        newProps.chatList = chatListArray;
        newProps.chats = chatArray;

        const propsForChatList:PropsWithChildren = Object.keys(newProps).filter((key:string) => chatListPropsFilter(key)).reduce((obj: PropsWithChildren, key:string) => {
          obj[key] = newProps[key];
          return obj;
        }, {});
        const propsForChat:PropsWithChildren = Object.keys(newProps).filter((key:string) => chatPropsFilter(key)).reduce((obj: PropsWithChildren, key:string) => {
          obj[key] = newProps[key];
          return obj;
        }, {});

        const chatSettingsPopupsData:PropsWithChildren[] = newProps.popups as PropsWithChildren[];
        const chatSettingsSubMenuData:PropsWithChildren = newProps.submenu as PropsWithChildren;
        const chatAddRemovePopupsData:PropsWithChildren[] = newProps.addRemovePopups as PropsWithChildren[];

        const chatSettingsPopups:ChatSettingsPopup[] = [];
        const chatSubMenu:ChatSubMenu = new ChatSubMenu(chatSettingsSubMenuData);
        const chatAddRemovePopups:ChatPopup[] = [];

        const submitFunctions = {
          addUser: this.addUser.bind(this),
          removeUser: this.removeUser.bind(this),
          addChat: this.addChat.bind(this),
          removeChat: this.removeChat.bind(this),
        };

        chatSettingsPopupsData.forEach((settngsPopupData:PropsWithChildren):void => {
          chatSettingsPopups.push(new ChatSettingsPopup(settngsPopupData));
        });
        chatAddRemovePopupsData.forEach((popupData:PropsWithChildren):void => {
          chatAddRemovePopups.push(new ChatPopup(Object.assign(popupData, { submitFunctions })));
        });

        const additionalObject = {
          chatList: new ChatList(propsForChatList),
          chat: new Chat(propsForChat),
          chatPopups: chatAddRemovePopups,
          chatSettingsPopups,
          chatSubMenu,
        };

        const events = {
          events: {
            select_chat: this.onChatSelect.bind(this),
            'add-remove_click': this.onAddRemoveRowClick.bind(this),
            click: (newProps.events as PropsWithChildren).click,
            search: this.chatSearchDebounced.bind(this),
            subMenuCall: this.onSubMenuCall.bind(this),
          },
        };
        const propsWithEvents = Object.assign(newProps, additionalObject, events);

        this.setProps(propsWithEvents);
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  async removeUser(login:string) { // функция удаления пользователя для popup'ов
    await this.userApi.findUser({ login })
      .then((data:PropsWithChildren[]) => {
        const user = data.find((user) => user.login === login);
        const users = [];
        users.push(user?.id);
        this.chatApi.deleteUserFromChat({ users, chatId: Number(store.getState().clickedChatId) })
          .catch((err: Error) => {
            is500Error(err);
            is401Error(err);
            console.log(err);
          });
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  async addUser(login:string) { // функция добавления пользователя для popup'ов
    await this.userApi.findUser({ login })
      .then((data:PropsWithChildren[]) => {
        const user = data.find((user) => user.login === login);
        const users = [];
        users.push(user?.id);

        this.chatApi.addUserToChat({ users, chatId: Number(store.getState().clickedChatId) })
          .catch((err: Error) => {
            is500Error(err);
            is401Error(err);
            console.log(err);
          });
      });
  }

  addChat(chatName:string) { // функция добавления чата для popup'ов
    this.chatApi.createChat({ title: chatName })
      .then(async () => {
        await this.chatApi.getChats({ offset: '0', limit: '10', title: '' })
          .then((data) => {
            chatLoader(data as PropsWithChildren[], this);
          })
          .catch((err: Error) => {
            is500Error(err);
            is401Error(err);
            console.log(err);
          });
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  removeChat(chatId: number) { // функция удаления чата для popup'ов
    this.chatApi.deleteChat({ chatId })
      .then(async () => {
        await this.chatApi.getChats({ offset: '0', limit: '10', title: '' })
          .then((data) => {
            chatLoader(data as PropsWithChildren[], this);
            this.chatCleaner();
          })
          .catch((err: Error) => {
            is500Error(err);
            is401Error(err);
            console.log(err);
          });
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  chatCleaner = () => { // очищает чат до пустого
    this.children.chat.setProps({ isChatChosen: false });
    this.children.chat.render();
  };

  onSubMenuCall(e:Event) { // для подменю создания/удаления чатов
    e.preventDefault();
    const chosenLabel = (e.target as HTMLElement).closest('.chat-label__container');
    this.store.setState('clickedChatId', chosenLabel?.id);
    const chatSubMenuEl = document.querySelector('#submenu') as HTMLElement;
    chatSubMenuEl.style.top = `${(e as MouseEvent).clientY - 90}px`;
    chatSubMenuEl.style.left = `${(e as MouseEvent).clientX}px`;
    if (chatSubMenuEl) {
      chatSubMenuEl.showPopover();
    }
  }

  async onChatSearch(e:Event) { // для поиска чатов по введённым буквам в input
    e.preventDefault();
    this.chatApi = chatApi;
    const { value } = (e.target as HTMLInputElement);

    await this.chatApi.getChats({ offset: '0', limit: '10', title: value })
      .then((data) => {
        chatLoader(data as PropsWithChildren[], this);
      })
      .catch((err: Error) => {
        is500Error(err);
        is401Error(err);
        console.log(err);
      });
  }

  chatSearchDebounced = debounce(this.onChatSearch.bind(this)); // создали защищённую (от повторного вызова) функцию

  onAddRemoveRowClick(e:Event) { // для обработки кнопок малых popup'ов в чате
    const targetId = (e.target as HTMLElement).id ? (e.target as HTMLElement).id : (e.target as HTMLElement).parentElement?.id;

    if (targetId === 'add_user' || targetId === 'remove_user') {
      const button = document.querySelector('#addRemove') as HTMLButtonElement;
      if (button) {
        button.blur();
      }

      let popup;
      if (targetId === 'add_user') {
        popup = this._element?.querySelector('#popup_add_user');
      }
      if (targetId === 'remove_user') {
        popup = this._element?.querySelector('#popup_remove_user');
      }

      if (popup) {
        popup.classList.add('chat-popup__layout_active');
      }
    }
    if (targetId === 'add_media' || targetId === 'add_file' || targetId === 'add_geo') {
      const button = document.querySelector('.chat__button_active');
      button?.classList.remove('chat__button_active');
    }
    if (targetId === 'add_chat' || targetId === 'remove_chat') {
      let popup;
      if (targetId === 'add_chat') {
        popup = this._element?.querySelector('#popup_add_chat');
      }
      if (targetId === 'remove_chat') {
        popup = this._element?.querySelector('#popup_remove_chat');
      }

      if (popup) {
        popup.classList.add('chat-popup__layout_active');
      }
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
    const webSocketToClose = store.getState().webSocket;
    if (webSocketToClose instanceof WebSocket) {
      webSocketToClose.close(); // закрываем существующее соединение
      console.log(`close socket ${webSocketToClose.url}`);
    }
    const allLabels = this._element?.querySelectorAll('.chat-label__container');
    if ((e.target as HTMLElement).className.includes('chat-label')) {
      allLabels?.forEach((label) => { // снимаем выделение со всех остальных
        label.className = 'chat-label__container';
      });
      const chosenLabel = (e.target as HTMLElement).closest('.chat-label__container');
      this.store.setState('clickedChatId', chosenLabel?.id);
      if (chosenLabel) {
        chosenLabel.className = 'chat-label__container chat-label__container_active';
        const chatProps = this.children.chat.props as PropsWithChildren;
        let chosenChat:PropsWithChildren|undefined;
        if (this.props.chats) {
          chosenChat = (this.props.chats as PropsWithChildren[]).find((chat) => chat.id.toString() === chosenLabel.id);
          if (chosenChat) {
            chatProps.openedChat = chosenChat;
            chatProps.isChatChosen = true;
          } else { // на случай, если сбой и чата с эти id нет(по идее такого не должно быть, но пока заглушка)
            chatProps.isChatChosen = false;
          }
        }

        if (chosenChat) { // пока заглушка, потом поменять при добавлении всех чатов
          const messageSendFunction = {
            sendMessage: this.sendMessage.bind(this),
          };

          this.children.chat.setProps({
            ...chatProps,
            chatHeader: new ChatHeader({ params: chatProps.openedChat }),
            chatWindow: new ChatWindow({
              packs: (chatProps.openedChat as PropsWithChildren).packs as PropsWithChildren,
              packReferences: (chatProps.openedChat as PropsWithChildren).packs as PropsWithChildren,
            }),
            chatMenu: new ChatMenu({ messageSendFunction }),
            events: {
              chat_button_click: this.onButtonClick.bind(this),
              button_blur: this.onButtonBlur.bind(this),
            },
          });

          this.chatApi.getChatToken({ id: chosenChat.id })
            .then((data:Iargs) => {
              this.store.setState('token', data.token);
              const storeState = this.store.getState();
              const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${storeState.userInfo.id}/${storeState.clickedChatId}/${storeState.token}`);

              this.store.setState('webSocket', socket); // записываем в store, чтобы вызвать его где угодно

              this.addWebSocketListeners();// вешаем слушатели на потом

              socket.onopen = () => {
                socket.send(JSON.stringify({
                  content: '0',
                  type: 'get old',
                }));
              };
            });
        } else { // на случай, если сбой и чата с эти id нет(по идее такого не должно быть, но пока заглушка)
          this.children.chat.setProps({
            ...chatProps,
          });
        }
      }
    }
  }

  sendMessage(message:string) { // для отправки сообщения в чат
    const { webSocket } = this.store.getState();
    webSocket.send(JSON.stringify({
      content: message,
      type: 'message',
    }));
  }

  addWebSocketListeners = () => {
    const socket:WebSocket = store.getState().webSocket;
    socket.addEventListener('open', () => {
      console.log('Соединение установлено');

      const interval = setInterval(() => {
        socket.send(JSON.stringify({
          type: 'ping',
        }));
      }, 30000);

      socket.addEventListener('close', (event) => { // вешаем здесь, потому что надо убрать interval
        clearInterval(interval); // Очищаем интервал при закрытии соединения
        if (event.wasClean) {
          console.log('Соединение закрыто чисто');
        } else {
          console.log('Обрыв соединения');
        }

        console.log(`Код: ${event.code} | Причина: ${event.reason}`);
      });
    });

    socket.addEventListener('message', (event) => {
    // по сути тут надо будет вставить какую-то самодельную функцию,
    // которая будет добавлять новые сообщения в чат
      this.parseWebSocketMessages(event.data);
    });

    socket.addEventListener('error', (event) => {
      const e = event as ErrorEvent; // чтобы eslint не ругался на message
      console.log('Ошибка', e.message);
    });
  };

  parseWebSocketMessages = (data:string) => {
    // приходит строка JSON, надо распарсить
    const acceptedData:Iargs&Iargs[] = JSON.parse(data);
    if (Array.isArray(acceptedData) && (acceptedData as Iargs[]).length !== 0) { // разбираем массив сообщений
      const packs:Iargs = this.createPacks(acceptedData);
      this.renderChatMessages(packs);
    } else if (acceptedData.type === 'message') { // добавляем одно сообщение в конце
      // добавляем в конце, опять же смотрим по packReferences
      const packs:Iargs = this.addNewMessageToChat(acceptedData);
      this.renderChatMessages(packs);
    } else if (acceptedData.type === 'pong') {
      console.log('соединение продлено');
    } else { // вдруг что-то пропустил
      console.log(acceptedData);
    }
  };

  compareTime = (messageTime:string):string => {
    const messageDate = new Date(messageTime);
    const currentDate = new Date();
    const dayDifference = currentDate.getDate() - messageDate.getDate();
    const monthDifference = currentDate.getMonth() - messageDate.getMonth();
    const yearDifference = currentDate.getFullYear() - messageDate.getFullYear();

    const isToday = dayDifference === 0;
    const isYesterday = dayDifference === 1;
    const isThisMonth = monthDifference === 0;
    const isThisYear = yearDifference === 0;

    const dateArray = messageDate.toString().split(' '); // день недели, месяц, число, год, время, GMT+, стандарт
    let messageDateString = '';
    if (isToday && isThisMonth && isThisYear) {
      messageDateString = 'Сегодня';
    } else if (isYesterday) {
      messageDateString = 'Вчера';
    } else if (isThisYear) {
      messageDateString = `${dateArray[2]} ${monthForDate[messageDate.getMonth()]}`;
    } else {
      messageDateString = `${dateArray[2]} ${monthForDate[messageDate.getMonth()]}, ${dateArray[3]}`;
    }
    return messageDateString;
  };

  createPacks = (messageArray:Iargs[]) => {
    let packs:Iargs[] = []; // создали массив наборов
    let pack:Iargs = {}; // типа создаём набор, если сменится дата, то стираем набор и пишем заново.
    let isLastPackChecked = false;
    if (this.children.chat.children.chatWindow.props.packReferences) { // есть ли сообщения до загрузки
      const initialPacks: PropsWithChildren[] = this.children.chat.children.chatWindow.props.packReferences as PropsWithChildren[];
      if ((initialPacks[0].messages as PropsWithChildren[]).length === 0) { // в наборах пусто, значит просто загружаем туда то что получили
        // обычный createPacks
      } else { // что-то уже записано
        // берём packReferences и отталкиваемся от них
        packs = initialPacks;
      }
    }

    let packDate:string = ''; // для каждого набора ставим свою дату, меняем в случае если поменялась и отправляем набор в массив
    let messageObject:Iargs = {}; // заготовка
    const { userInfo } = this.store.getState();
    let isMyMessage:boolean = false;

    messageArray.forEach((message:Iargs) => {
      const messageDate = this.compareTime(message.time);
      const messageTimeArray = new Date(message.time).toString().split(' ')[4].split(':');
      const messageTime = `${messageTimeArray[0]}:${messageTimeArray[1]}`;

      if (!isLastPackChecked && packs[0]?.date === messageDate) { // проверка, если вдруг у нас загружается сообщение раннего набора
        // eslint-disable-next-line prefer-destructuring
        pack = packs[0];
        isLastPackChecked = true;
      } else { // если ещё более раннее сообщение
        if (packDate === '' || packDate !== messageDate) packDate = messageDate; // если дата сменилась, то меняем
        if (pack.date !== packDate) { // сменилась дата
          if (pack.date) packs.unshift(pack);

          const zeroTimeDate = createZeroTimeDate(message.time); // создём нулевую метку дня
          pack = {
            date: packDate,
            zeroTimeDate,
            messages: [],
          };
        }
      }

      // продолжаем добавлять сообщения
      messageObject = {
        isSideChanged: false, // если поменялся id автора сообщения, надо отслеживать
        isMessageMine: false, // совпадает с id пользователя
        isRead: false, // "прочитано", для своего, по идее можно наверное забить
        isText: false, // это текстовое сообщение?
        isImage: false, // это сообщение с картинкой?
        time: '', // время сообщения, вытащить из даты сообщения
        content: { // само соообщение
          text: '', // текст сообщения
          imageLink: '', // ссылка на картинку, если должна быть
        },
      };
      messageObject.isMessageMine = message.user_id === userInfo.id;
      if (isMyMessage !== messageObject.isMessageMine) { // если старое значение отличается, то надо заменить и указать, что сменилась сторона
        if (pack.messages.length !== 0) {
          messageObject.isSideChanged = true;
        }
        isMyMessage = messageObject.isMessageMine;
      }
      if (messageObject.isMessageMine) { // Отметка о прочитанном сообщении польщователя
        messageObject.isRead = message.is_read;
      }
      if (!message.file) { // записываем текст
        messageObject.isText = true;
        messageObject.content.text = message.content;
      }
      // eslint-disable-next-line prefer-destructuring
      messageObject.time = messageTime;

      pack.messages.unshift(messageObject);
    });
    // pack.messages.unshift(messageObject); // загружаем последнее сообщение в набор
    packs.unshift(pack); // загружаем последний набор

    return packs;
  };

  addNewMessageToChat = (newMessage: Iargs) => {
    let packs:Iargs[] = []; // создали массив наборов
    let pack:Iargs = {}; // типа создаём набор, если сменится дата, то стираем набор и пишем заново.
    let isLastPackChecked = false;
    if (this.children.chat.children.chatWindow.props.packReferences) { // есть ли сообщения до загрузки
      const initialPacks: PropsWithChildren[] = this.children.chat.children.chatWindow.props.packReferences as PropsWithChildren[];
      if ((initialPacks[0].messages as PropsWithChildren[]).length === 0) { // в наборах пусто, значит просто загружаем туда то что получили
        // обычный createPacks
      } else { // что-то уже записано
        // берём packReferences и отталкиваемся от них
        packs = initialPacks;
      }
    }

    let packDate:string = ''; // для каждого набора ставим свою дату, меняем в случае если поменялась и отправляем набор в массив
    let messageObject:Iargs = {}; // заготовка
    const { userInfo } = this.store.getState();
    let isLastMessageMine:boolean = false;
    if (packs.length !== 0) {
      const lastPack = packs[packs.length - 1];
      isLastMessageMine = lastPack.messages[lastPack.messages.length - 1].isMessageMine;
    }

    // собираем набор
    const messageDate = this.compareTime(newMessage.time);
    const messageTimeArray = new Date(newMessage.time).toString().split(' ')[4].split(':');
    const messageTime = `${messageTimeArray[0]}:${messageTimeArray[1]}`;

    if (!isLastPackChecked && packs[packs.length - 1]?.date === messageDate) { // проверка, если вдруг у нас загружается сообщение раннего набора
      // eslint-disable-next-line prefer-destructuring
      pack = packs[packs.length - 1];
      isLastPackChecked = true;
    } else { // если новое сообщение, нового дня
      if (packDate === '' || packDate !== messageDate) packDate = messageDate; // если дата сменилась, то меняем
      if (pack.date !== packDate) { // сменилась дата
        if (pack.date) packs.unshift(pack);

        const zeroTimeDate = createZeroTimeDate(newMessage.time); // создём нулевую метку дня
        pack = {
          date: packDate,
          zeroTimeDate,
          messages: [],
        };
      }
    }

    // продолжаем добавлять сообщения
    messageObject = {
      isSideChanged: false, // если поменялся id автора сообщения, надо отслеживать
      isMessageMine: true, // совпадает с id пользователя
      isRead: false, // "прочитано", для своего, по идее можно наверное забить
      isText: false, // это текстовое сообщение?
      isImage: false, // это сообщение с картинкой?
      time: '', // время сообщения, вытащить из даты сообщения
      content: { // само соообщение
        text: '', // текст сообщения
        imageLink: '', // ссылка на картинку, если должна быть
      },
    };

    messageObject.isMessageMine = newMessage.user_id === userInfo.id;
    if (isLastMessageMine !== messageObject.isMessageMine) { // если старое значение отличается, то надо заменить и указать, что сменилась сторона
      if (pack.messages.length > 0) { // если набор не пустой
        pack.messages[pack.messages.length - 1].isSideChanged = true;
      } // если сообщение в другом наборе, то там итак есть разрыв
    }
    if (messageObject.isMessageMine) { // Отметка о прочитанном сообщении польщователя
      messageObject.isRead = newMessage.is_read;
    }
    if (!newMessage.file) { // записываем текст
      messageObject.isText = true;
      messageObject.content.text = newMessage.content;
    }
    // eslint-disable-next-line prefer-destructuring
    messageObject.time = messageTime;

    pack.messages.push(messageObject);
    // закончили собирать набор

    // загружаем наборы, с учётом заполненности чата
    if (packs.length === 0) { // если пусто
      packs.push(pack);
    } else if (packs[packs.length - 1].date === pack.date) { // если заполняли последний
      packs.pop();
      packs.push(pack);
    } else { // если новый
      packs.push(pack);
    }

    return packs;
  };

  renderChatMessages(packs:Iargs) { // для отображения сообщений
    const packsObjects:ChatPack[] = [];
    packs.forEach((pack:PropsWithChildren) => {
      packsObjects.push(new ChatPack(pack));
    });
    this.children.chat.children.chatWindow.setProps({ packs: packsObjects, packReferences: packs });
    this.children.chat.children.chatWindow.render();
    const chatMessages = document.querySelectorAll('.chat-message');
    chatMessages[chatMessages.length - 1]?.scrollIntoView(true);
  }

  override render(): string {
    return `
        <div id="app">
            <main class="page__chat">
                {{{chatList}}}
                {{{chat}}}
                {{{chatSettingsPopups}}}
                {{{chatPopups}}}
                {{{chatSubMenu}}}
            </main>
        </div>
        `;
  }
}
