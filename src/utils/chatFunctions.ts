import Chatlabel from '../components/chatLabel/chatLabel';
import ChatPage from '../pages/chats';
import { PropsWithChildren } from './blockInterfaces';
import { DebounceFunc } from './extraInterfaces';

export const debounce = (f: DebounceFunc) => { // Защита от многократного вызова
  let lastTimeout: number;
  return (e:Event) => { // возвращаем функцию, которая вызывает нужную функцию с задержкой
    if (lastTimeout) { // если ещё раз вызвали стираем старое, делаем новое
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(() => { // задержка для вызова, как защита от повторного вызова
      f(e);
    }, 500);
  };
};

export const chatListPropsFilter = (key: string):boolean => key === 'chatList' || key === 'profileLink';
export const chatPropsFilter = (key: string):boolean => key === 'isChatChosen' || key === 'openedChat' || key === 'profileLink';

export const chatsParser = (data:PropsWithChildren[]) => {
  const intialChatArray:PropsWithChildren[] = data;
  const chatListArray:PropsWithChildren[] = [];
  const chatArray:PropsWithChildren[] = [];
  intialChatArray.forEach((chatInfoElement:PropsWithChildren) => {
    const chatListElement:PropsWithChildren = {};// сбор данных для chatList
    chatListElement.id = chatInfoElement.id;
    chatListElement.hasNewMessages = (chatInfoElement.unread_count as number) > 0;
    chatListElement.imagePath = chatInfoElement.avatar ? chatInfoElement.avatar : '';
    chatListElement.isTooManyMessages = (chatInfoElement.unread_count as number) > 99;
    chatListElement.name = chatInfoElement.title;
    chatListElement.newMessagesCount = chatInfoElement.unread_count;
    chatListArray.push(chatListElement);
    // Т.к. новое сообщение не добавить, то добаивить данные элементы не сможем
    // chatListElement.isMyMessage = false;
    // chatListElement.lastMessage = (chatInfoElement.last_message as PropsWithChildren).content ? (chatInfoElement.last_message as PropsWithChildren).content : '';
    // chatListElement.lastMessageTime = checkTime((chatInfoElement.last_message as PropsWithChildren).time as string);

    // Т.к. нет запроса для загрузки чата, то возьмём, что есть

    const chatElement:PropsWithChildren = {};// заполняем chats
    chatElement.id = chatInfoElement.id;
    chatElement.imagePath = chatInfoElement.avatar;
    chatElement.isAddActive = false;
    chatElement.isSettingsActive = false;
    chatElement.name = chatInfoElement.title;
    chatElement.packs = [{
      messages: [],
    }];
    chatArray.push(chatElement);
  });

  return [chatListArray, chatArray];
};

export const chatLoader = (data: PropsWithChildren[], self:ChatPage) => { // загружаем новый список чатов
  const [chatListArray, chatArray] = chatsParser(data as PropsWithChildren[]);

  // Некрасивый, но рабочий вариант перерендерить список, но при этом сменить props для chatPage
  self.props.chatList = chatListArray;
  self.props.chats = chatArray;

  const newProps = self.props as PropsWithChildren;
  const propsForChatList:PropsWithChildren = Object.keys(newProps).filter((key:string) => chatListPropsFilter(key)).reduce((obj: PropsWithChildren, key:string) => {
    obj[key] = newProps[key];
    return obj;
  }, {});

  const changedChatLabel = { // делаем новые плитки чатов в списке
    noMatch: (propsForChatList.chatList as PropsWithChildren[]).length === 0,
    chatLabelElements: (propsForChatList.chatList as PropsWithChildren[]).map((chatData:PropsWithChildren):Chatlabel => new Chatlabel({ params: chatData })),
  };

  const events = {
    events: {
      select_chat: self.onChatSelect.bind(self),
      subMenuCall: self.onSubMenuCall.bind(self),
    },
  };
  Object.assign(propsForChatList, changedChatLabel, events);
  self.children.chatList.children.chatListElement.setProps(propsForChatList);
  console.log(self.children.chatList.children.chatListElement);
};
