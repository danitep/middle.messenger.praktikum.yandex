import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import ProfileForm from '../profileForm/profileForm';

const createProfileForm = (params:PropsWithChildren) => new ProfileForm({
  profileRowsData: params.profileRowsData,
  passwordRowsData: params.passwordRowsData,
  isEditDisabled: params.isEditDisabled,
  isPasswordEditable: params.isPasswordEditable,
  buttonsData: params.buttonsData,
});

export default class ProfileInfo extends Block {
  constructor(props:PropsWithChildren) {
    const params:PropsWithChildren = props.params as PropsWithChildren;
    const profileForm = createProfileForm(params);
    super({
      ...props,
      profileForm,
    });

    const newProps = props;
    const additionalProps = {
      profileForm,
    };
    const events = {
      events: {
        click_button: this.changeForm.bind(this),
        submit: this.onFormSubmit.bind(this),
        click: (props.events as PropsWithChildren).click,
        blur: this.onInputBlur.bind(this),
        click_image: (props.events as PropsWithChildren).click_image,
      },
    };
    const propsWithEvents = Object.assign(newProps, additionalProps, events);
    console.log(propsWithEvents);
    this.setProps(propsWithEvents);
  }

  onInputBlur(e:Event) {
    const input = e.target as HTMLInputElement;
    if (!input.validity.valid) {
      (e.target as HTMLInputElement).className = 'profile__input profile__input_errored';
    } else {
      (e.target as HTMLInputElement).className = 'profile__input';
    }
  }

  onFormSubmit(e:Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputs = form.querySelectorAll('input');
    let allValid = true;
    const validityArray:boolean[] = [];
    inputs.forEach((input:HTMLInputElement) => {
      validityArray.push(input.validity.valid);
    });
    validityArray.forEach((validity) => {
      if (validity === false) {
        allValid = false;
      }
    });
    if (allValid) {
      const submitValue: {[key: string]: string} = {};
      if (inputs.length === 3) { // пароли
        if (inputs[2].value === inputs[1].value && inputs[1].value !== inputs[0].value) {
          inputs.forEach((input) => {
            submitValue[input.name] = input.value;
          });
          // пока не сделана связь с сервером, то просто затычка
          console.log(submitValue);
          if (form.name === 'profileForm') {
            this._changeProps('isEditDisabled', true);
          } else {
            this._changeProps('isPasswordEditable', false);
          }
        } else if (inputs[1].value === inputs[0].value) {
          alert('Новый пароль идентичен предыдущему!');
        } else if (inputs[2].value !== inputs[1].value) {
          alert('Новые пароли не совпадают!');
        }
      } else {
        inputs.forEach((input) => {
          submitValue[input.name] = input.value;
        });

        // пока не сделана связь с сервером, то просто затычка
        console.log(submitValue);
        if (form.name === 'profileForm') {
          this._changeProps('isEditDisabled', true);
        } else {
          this._changeProps('isPasswordEditable', false);
        }
      }
    } else {
      alert('Испраьте некорректные поля');
    }
  }

  changeForm(e:Event) { // вешается на 2 синие кнопки, которые ссылки (<a>)
    // функция для смены состяний формы, для правильной отрисовки страницы
    e.preventDefault();
    if ((e.target as HTMLAnchorElement).text === 'Изменить данные') {
      this._changeProps('isEditDisabled', false);
    } else if ((e.target as HTMLAnchorElement).text === 'Изменить пароль') {
      this._changeProps('isPasswordEditable', true);
    }
  }

  _changeProps(propName:string, value:boolean) {
    let newProps:PropsWithChildren = this.props as PropsWithChildren;
    (newProps.params as PropsWithChildren)[propName] = value;

    const profileForm = { profileForm: createProfileForm(newProps.params as PropsWithChildren) };
    const events = {
      events: (this.props as PropsWithChildren).events,
    };
    newProps = Object.assign(newProps, profileForm, events);
    this.setProps(newProps);
    this.render();
  }

  override render(): string {
    return `
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

        `;
  }
}
