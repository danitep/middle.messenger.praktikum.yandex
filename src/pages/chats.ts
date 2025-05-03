import { Chat } from "../components/chat/chat";
import { ChatList } from "../components/chatList/chatList";
import { ChatPopup } from "../components/chatPopup/chatPopup";
import { ChatSettingsPopup } from "../components/chatSettingsPopup/chatSettingsPopup";
import Block from "../framework/Block";
import { PropsWithChildren } from "../utils/blockInterfaces";

const chatListPropsFilter = (key: string):boolean=>{
    return key === 'chatList' || key === 'profileLink'
}
const chatPropsFilter = (key: string):boolean=>{
    return key === 'isChatChosen' || key === 'openedChat' || key === 'profileLink'
}

export class ChatPage extends Block{
    constructor (props:PropsWithChildren){
        const propsForChatList:PropsWithChildren = Object.keys(props).filter((key:string) =>
            chatListPropsFilter(key)).reduce((obj: PropsWithChildren, key:string) =>
            {
                obj[key] = props[key];
                return obj;
            }, {}
        );
        const propsForChat:PropsWithChildren = Object.keys(props).filter((key:string) =>
            chatPropsFilter(key)).reduce((obj: PropsWithChildren, key:string) =>
            {
                obj[key] = props[key];
                return obj;
            }, {}
        );
        const chatSettingsPopupsData:PropsWithChildren[] = props.popups as PropsWithChildren[];
        const chatSettingsPopups:ChatSettingsPopup[] = [];
        
        chatSettingsPopupsData.forEach((popupData:PropsWithChildren):void=>{
            chatSettingsPopups.push(new ChatSettingsPopup(popupData)) 
        })
        super({
            ...props,
            chatList: new ChatList(propsForChatList),
            chat: new Chat(propsForChat),
            chatPopup: new ChatPopup(props.addRemovePopup as PropsWithChildren),
            chatSettingsPopups: chatSettingsPopups
        });
        
    }

    override render(): string {
        return`
        <div id="app">
            <main class="page__chat">
                {{{chatList}}}
                {{{chat}}}
                {{{chatSettingsPopups}}}
                {{{chatPopup}}}
            </main>
        </div>
        `
    }
}


