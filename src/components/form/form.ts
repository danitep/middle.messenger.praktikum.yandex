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
                'blur': this.onInputBlur.bind(this),
            }
        }
        const propsWithEvents = Object.assign(newProps, events)
        this.setProps(propsWithEvents);
    }

    onInputBlur(e:Event){
        const input = e.target as HTMLInputElement;
        const errortext = (e.target as HTMLInputElement).parentElement?.querySelector(`#${input.id}__field-error`)
        if(errortext){
            if (!input.validity.valid){
                (e.target as HTMLInputElement).className = "field__input field__input_errored";
                errortext.className = "field__error field__error_active";
            }else{
                (e.target as HTMLInputElement).className = "field__input"
                errortext.className = "field__error";
            }
        }
    }

    onFormSubmit(e:Event){
        e.preventDefault();
        const form = e.target as HTMLFormElement ;
        const inputs = form.querySelectorAll('input');
        let allValid = true;
        const validityArray:boolean[]= []
        inputs.forEach((input:HTMLInputElement)=>{
            validityArray.push(input.validity.valid);
        })
        validityArray.forEach((validity)=>{
            if (validity === false){
                allValid = false;
            }
        })
        if (allValid){
            const submitValue: {[key: string]: string} = {};
            if(inputs.length===7){//пароли
                const errortext = (e.target as HTMLInputElement).querySelector(`#password_again__field-error`)
                if (inputs[6].value === inputs[5].value && errortext){
                    errortext.className = "field__error";
                    errortext.textContent = "Некорректный пароль"
                    inputs.forEach((input)=>{
                        submitValue[input.name] = input.value
                    })
                    //пока не сделана связь с сервером, то просто затычка
                    console.log(submitValue);
                }else if(inputs[6].value !== inputs[5].value && errortext){
                    errortext.className = "field__error field__error_active";
                    errortext.textContent = "Пароли не совпадают"
                }
            }else{
                inputs.forEach((input)=>{
                    submitValue[input.name] = input.value
                })

                //пока не сделана связь с сервером, то просто затычка
                console.log(submitValue);
            }
        }
        else{
            alert('Испраьте некорректные поля')
        } 
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