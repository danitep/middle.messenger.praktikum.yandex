import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";


export class ProfilePopup extends Block{
    constructor (props:PropsWithChildren){
        super({
            ...props,
        });

        const newProps = props
        const events = {
            events:{
                'popup_close': this.onLayoutClick.bind(this),
                'popup_submit': this.onSubmit.bind(this),
                'change': this.validateForm.bind(this),
            }
        }
        const propsWithEvents = Object.assign(newProps, events)
        this.setProps(propsWithEvents);
    }

    validateForm(e:Event){
        console.log(e.target)
        const fileNameP = (e.target as HTMLInputElement).parentElement?.querySelector('popup__input-text')
        console.log((e.target as HTMLInputElement).parentElement)
        this._changeProps('isImageLoaded',true); 
    }

    onLayoutClick(e:Event){
        if ( (e.target as HTMLDivElement).className.includes("popup__layout")){
            e.preventDefault();
            this._changeProps('isOpened',false);
        }   
    }

    onSubmit(e:Event){
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        console.log(e.target)
        const inputs = form.querySelectorAll('input');
        const submitValue: {[key: string]: string} = {};
        inputs.forEach((input)=>{
            submitValue[input.name] = input.value
        })
        //пока не сделана связь с сервером, то просто затычка
        console.log(submitValue);
        this._changeProps('isOpened',false); 
    }

    _changeProps(propName:string, value:boolean){
        let newProps:PropsWithChildren = this.props as PropsWithChildren;
        (newProps.params as PropsWithChildren)[propName] = value;
        const events = {
            events:(this.props as PropsWithChildren).events
        }
        newProps = Object.assign(newProps, events);
        this.setProps(newProps);
        this.render()
    }

    override render(): string {
        return`
        <div class="popup__layout {{#if params.isOpened}} {{else}}popup__layout_hidden{{/if}}">
            <form class="popup">
                {{#if params.isSubmitErrored}}
                    <p class="popup__title popup__title_errored">Ошибка, попробуйте ещё раз</p>
                {{else}}
                    {{#if params.isImageLoaded}}
                        <p class="popup__title">Файл загружен</p>
                    {{else}}
                        <p class="popup__title">Загрузите файл</p>
                    {{/if}}
                {{/if}}

                <div class="popup__file-button">
                    <input type="file" accept=".jpg, .jpeg, .png" name="avatar" class="popup__file-input">
                    <p class="{{#if params.isImageLoaded}}popup__image-name{{else}}popup__input-text{{/if}}">{{#if params.isImageLoaded}}{{params.fileName}}{{else}}Выбрать файл на компьютере{{/if}}</p>
                </div>

                <button class="popup__submit-button" type="submit">Поменять</button>
                <p class="popup__error {{#if params.isSubmitEmpty}} {{else}}popup__error_hidden{{/if}}">Нужно выбрать файл</p>
            </form>
        </div>
        `
    }
}