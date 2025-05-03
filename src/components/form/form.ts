import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";
import { InputField } from "../inputField/inputField";

export class Form extends Block{
    constructor (props:PropsWithChildren){
        const inputParams:PropsWithChildren[] = props.inputParams?props.inputParams as PropsWithChildren[]:[];
        //Без понятия почему он дважды сюда смотрит, но "?" помогло
        const inputs = inputParams.map((params)=>{
            return new InputField({
                params: params,
            });
        });
        super({
            ...props,
            inputs: inputs
        });

        const newProps = props;
        const events = {
            events:{
                'submit': this.onFormSubmit.bind(this),
            }
        }
        const propsWithEvents = Object.assign(newProps, events)
        this.setProps(propsWithEvents);
    }

    onFormSubmit(e:Event){
        e.preventDefault();
        const form = e.target as HTMLFormElement ;
        const inputs = form.querySelectorAll('input');
        const submitValue: {[key: string]: string} = {};
        inputs.forEach((input)=>{
            submitValue[input.name] = input.value
        })
        //пока не сделана связь с сервером, то просто затычка
        console.log(submitValue);
    }

    override render(): string {
        return`
        <main class="form form_type_{{name}}">
            <h2 class="form__title">{{title}}</h2>
            <form class="form__list form__list_type_{{name}}" id="{{name}}__form" name={{name}} onSubmit={}>
                {{{inputs}}}
                
            <button class="form__button" type="submit">{{buttontext}}</button>
            
            </form>
            <a class="form__link" href="{{linkpath}}">{{linktext}}</a>
        </main>
        `
    }
}