import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";
import { ChatBorderLine } from "../chatBorderLine/chatBorderLine";
import { Chatlabel } from "../chatLabel/chatLabel";

export class ChatList extends Block{
    constructor (props:PropsWithChildren){
        const chatlabelsData:PropsWithChildren[] = props.chatList as PropsWithChildren[];

        const chatLabels:Chatlabel[] = [];

        chatlabelsData.forEach((chatData:PropsWithChildren):void=>{
            chatLabels.push(new Chatlabel({
                params:chatData
            })) 
        })
        super({
            ...props,
            chatBorderLine: new ChatBorderLine(),
            chatLabels: chatLabels
        });
    }

    override render(): string {
        return`
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
            <div class="chat-list__list">
                {{{chatLabels}}}
            </div>
        </div>
        `
    }
}/*{{> chatLabel params=chat}} */