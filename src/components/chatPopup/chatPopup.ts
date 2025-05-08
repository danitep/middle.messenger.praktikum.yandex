import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";

export class ChatPopup extends Block{
    constructor (props:PropsWithChildren){
        super({
          ...props
        });

        const newProps = props
        const events = {
            events:{
                'popup_close': this.onLayoutClick.bind(this),
                'popup_submit': this.onSubmit.bind(this),
            }
        }
        const propsWithEvents = Object.assign(newProps, events)
        this.setProps(propsWithEvents);
    }

    onSubmit(e:Event){
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.querySelector('input');
        const submitValue: {[key: string]: string } = {};
        
        console.log(input?.value)
        if(input?.value){//заготовка на потом, если вдруг пустое значение нельзя отправлять
            submitValue[`${input.name}`] = input.value;
            console.log(submitValue);
            this._element?.classList.remove('chat-popup__layout_active');
        }
        //пока не сделана связь с сервером, то просто затычка

    }

    onLayoutClick(e:Event){
        if ( (e.target as HTMLDivElement).className.includes("chat-popup__layout")){
            e.preventDefault();
            this._element?.classList.remove('chat-popup__layout_active');
        }   
    }

    override render(): string {
        return`
        <div class="chat-popup__layout" id="{{id}}">
            <form class="chat-popup">
                <p class="chat-popup__title">{{title}}</p>
                    <p class="chat-popup__span">Логин</p>
                    <input type="text" 
                            class="chat-popup__input" 
                            id="login" 
                            name="login" 
                            onChange={}
                            placeholder="Логин"
                            value="{{username}}"
                            required         
                            minLength=1/>
                    <button class="chat-popup__submit-button" type="submit">{{buttonText}}</button>
            </form>
        </div>
        `
    }
}

