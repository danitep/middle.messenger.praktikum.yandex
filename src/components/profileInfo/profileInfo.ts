import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";
import { ProfileForm } from "../profileForm/profileForm";


const createProfileForm = (params:PropsWithChildren)=>{
    return new ProfileForm({
        profileRowsData: params.profileRowsData,
        passwordRowsData: params.passwordRowsData,
        isEditDisabled: params.isEditDisabled,
        isPasswordEditable: params.isPasswordEditable,
        buttonsData: params.buttonsData
    })
}

export class ProfileInfo extends Block{
    constructor (props:PropsWithChildren){
        
        const params:PropsWithChildren = props.params as PropsWithChildren;
        const profileForm = createProfileForm(params);
        super({
            ...props,
            profileForm: profileForm
        });

        const newProps = props
        const additionalProps = {
            profileForm:profileForm
        }
        const events = {
            events:{
                'click_button': this.changeForm.bind(this),
                'submit': this.onFormSubmit.bind(this),
                'click': (props.events as PropsWithChildren).click
            }
        }
        const propsWithEvents = Object.assign(newProps, additionalProps, events)

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

        if(form.name === "profileForm"){
            this._changeProps('isEditDisabled', true);
        }else{
            this._changeProps('isPasswordEditable', false);
        }

    }

    changeForm(e:Event){//вешается на 2 синие кнопки, которые ссылки (<a>)
        //функция для смены состяний, для правильной отрисовки страницы
        e.preventDefault();    
        if ((e.target as HTMLAnchorElement).text === "Изменить данные"){
            this._changeProps('isEditDisabled', false);
        }else if((e.target as HTMLAnchorElement).text === "Изменить пароль"){
            this._changeProps('isPasswordEditable', true);
        }
    }

    _changeProps(propName:string, value:boolean){
        let newProps:PropsWithChildren = this.props as PropsWithChildren;
        console.log(this.props);
        (newProps.params as PropsWithChildren)[propName] = value;

        const profileForm = {profileForm: createProfileForm(newProps.params as PropsWithChildren)};
        const events = {
            events:(this.props as PropsWithChildren).events
        }
        newProps = Object.assign(newProps, profileForm, events);
        this.setProps(newProps);
        this.render()
    }

    override render(): string {
        return`
        <div class="profile">
            <div class="profile__image-container">
                <button class="profile__change" type="button">
                    <p >Поменять<br/>аватар</p>
                </button>  
                <input type="image" 
                name="avatar" 
                class="profile__image" 
                src={{params.avatarTempPath}} 
                alt="Аватар">
            </div>

            {{#if params.isPasswordEditable}}
                <p class="profile__user profile__user_hidden">{{params.username}}</p>
            {{else}}
                {{#if params.isEditDisabled}}
                    <p class="profile__user">{{params.username}}</p>
                {{else}}
                    <p class="profile__user profile__user_hidden">{{params.username}}</p>
                {{/if}}
            {{/if}}
            
            {{{profileForm}}}
        </div>

        `
    }
}

