import Block from "../../framework/Block";
import { Props, PropsWithChildren } from "../../utils/blockInterfaces";
import { ChatBorderLine } from "../chatBorderLine/chatBorderLine";
import { Chatlabel } from "../chatLabel/chatLabel";
import { chatListContainer } from "../chatListContainer/chatListContainer";

export class ChatList extends Block{
    constructor (props:PropsWithChildren){
        
        super({
            ...props,
            chatBorderLine: new ChatBorderLine(),
            chatListElement: new chatListContainer(props)
        });
        const newProps = props
        const events = {
            events:{
                'search': this.onChatSearch.bind(this),
            }
        }
        const propsWithEvents = Object.assign(newProps, events)

        this.setProps(propsWithEvents);
    }

    onChatSearch(e:Event){
        e.preventDefault();
        const value = (e.target as HTMLInputElement).value
        const chatList = this.children.chatListElement;
        const allLabels:Chatlabel[] =(chatList.props.backup as PropsWithChildren).allLabels as Chatlabel[];
        const labels = chatList.lists.chatLabelElements as Chatlabel[];
        if(value===''){
            console.log(allLabels)
            chatList.setProps({
                noMatch: false,
                chatLabelElements:allLabels,
                backup: {
                    allLabels: allLabels
                }
            })
        }else{
            const newLabels: Chatlabel[] = labels.filter((label:Chatlabel)=>{
                return ((label.props.params as Props).name as string).toLowerCase().includes(value.toLowerCase());
            })
            console.log(newLabels)
            
            chatList.setProps({
                noMatch: newLabels.length===0,
                chatLabelElements:newLabels,
                backup: {
                    allLabels: allLabels
                }
            })
        }
        
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
            {{{chatListElement}}}
        </div>
        `
    }
}/*{{> chatLabel params=chat}} */