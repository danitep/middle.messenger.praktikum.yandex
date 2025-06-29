import authApi, { AuthAPI } from '../../api/authApi';
import Block from '../../framework/Block';
import { Props, PropsWithChildren } from '../../utils/blockInterfaces';
import { is500Error } from '../../utils/extraFunctions';
import store from '../../utils/store';
import ProfileForm from '../profileForm/profileForm';
import router, { Router } from '../router/router';

const createProfileForm = (params:PropsWithChildren, self:ProfileInfo) => new ProfileForm({
  profileRowsData: params.profileRowsData,
  passwordRowsData: params.passwordRowsData,
  isEditDisabled: params.isEditDisabled,
  isPasswordEditable: params.isPasswordEditable,
  buttonsData: params.buttonsData,
  events: { // пришлось в тупую прокинуть ниже, т.к. без этого почему-то кнопки не работали на второй раз
    click_button: self.changeForm.bind(self),
    submit: self.onFormSubmit.bind(self),
    click: self.onExitClick.bind(self),
  },
});

export default class ProfileInfo extends Block {
  router: Router;

  authApi: AuthAPI;

  constructor(props:PropsWithChildren) {
    const params:PropsWithChildren = props.params as PropsWithChildren;
    super({
      ...props,
    });
    this.router = router;
    this.authApi = authApi;
    const newProps = props;
    const profileForm = createProfileForm(params, this);
    const additionalProps = {
      profileForm,
    };
    const events = {
      events: {
        click_button: this.changeForm.bind(this),
        submit: this.onFormSubmit.bind(this),
        click: this.onExitClick.bind(this),
        blur: this.onInputBlur.bind(this),
        click_image: (props.events as PropsWithChildren).click_image,
      },
    };
    const propsWithEvents = Object.assign(newProps, additionalProps, events);
    this.setProps(propsWithEvents);
  }

  async onExitClick(e:Event) {
    e.preventDefault();
    if (e.target) {
      const newPath:string = (e.target as HTMLAnchorElement).pathname;
      await this.authApi.logout()
        .then(() => {
          store.clearStore();
        })
        .catch((err: Error) => {
          is500Error(err);
          console.log(err);
        });
      this.router.go(newPath);
    }
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
    // где-нибудь написать косяк, чтобы словить ошибку, а потом протестить выход по роутеру куда-нибудь, типа ошибки 500
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputs = form.querySelectorAll('input');
    const errortext = form.querySelector('#submit_err');
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
          ((this.props.params as Props).changePassword as Function)(submitValue);

          if (form.name === 'profileForm') {
            this._changeProps('isEditDisabled', true);
          } else {
            this._changeProps('isPasswordEditable', false);
          }
        } else if (inputs[1].value === inputs[0].value) {
          if (errortext) {
            errortext.classList.add('profile__errortext_active');
            errortext.textContent = 'Новый пароль идентичен предыдущему!';
          }
        } else if (inputs[2].value !== inputs[1].value) {
          if (errortext) {
            errortext.classList.add('profile__errortext_active');
            errortext.textContent = 'Новые пароли не совпадают!';
          }
        }
      } else { // данные профиля
        inputs.forEach((input) => {
          submitValue[input.name] = input.value;
        });

        ((this.props.params as Props).changeProfileData as Function)(submitValue);
        if (form.name === 'profileForm') {
          this._changeProps('isEditDisabled', true);
        } else {
          this._changeProps('isPasswordEditable', false);
        }
      }
    } else {
      const errortext = form.querySelector('#submit_err');
      if (errortext) {
        errortext.classList.add('profile__errortext_active');
        errortext.textContent = 'Испраьте некорректные поля';
      }
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

    const profileForm = { profileForm: createProfileForm(newProps.params as PropsWithChildren, this) };
    const events = {
      events: (this.props as PropsWithChildren).events,
    };
    newProps = Object.assign(newProps, profileForm, events);
    this.setProps(newProps);
    // this.render();
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
                src="{{params.avatarTempPath}}" 
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
