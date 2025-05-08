import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";
import { Chatlabel } from "../chatLabel/chatLabel";

export class chatListContainer extends Block{
    constructor (props:PropsWithChildren){
        const chatlabelsData:PropsWithChildren[] = props.chatList as PropsWithChildren[];

        const chatLabelElements:Chatlabel[] = [];

        chatlabelsData.forEach((chatData:PropsWithChildren):void=>{
            chatLabelElements.push(new Chatlabel({
                params:chatData
            })) 
        })
        super({
            noMatch: false,
            chatLabelElements: chatLabelElements,
            backup: {
                allLabels: chatLabelElements
            }
        });
        
    }
    
    override render(): string {
        return`
        <ul class="chat-list__list">
            {{#if noMatch}}

            {{else}}
                {{{chatLabelElements}}}
            {{/if}}
            
        </ul>
        `
    }
}

