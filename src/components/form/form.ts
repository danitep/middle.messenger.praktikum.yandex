import authApi, { AuthAPI } from '../../api/authApi';
import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import { is500Error } from '../../utils/extraFunctions';
import store, { Store } from '../../utils/store';
import InputField from '../inputField/inputField';
import router, { Router } from '../router/router';

export default class Form extends Block {
  authApi: AuthAPI;

  store: Store;

  router: Router;

  constructor(props:PropsWithChildren) {
    const inputParams:PropsWithChildren[] = props.inputParams ? props.inputParams as PropsWithChildren[] : [];
    // Без понятия почему он дважды сюда смотрит, но "?" помогло
    const inputs = inputParams.map((params) => new InputField({
      params,

    }));
    super({
      ...props,
      inputs,
    });
    this.authApi = authApi;
    this.store = store;
    this.router = router;

    const newProps = props;
    const events = {
      events: {
        submit: this.onFormSubmit.bind(this),
        blur: this.onInputBlur.bind(this),
      },
    };
    const propsWithEvents = Object.assign(newProps, events);
    this.setProps(propsWithEvents);
  }

  onInputBlur(e:Event) {
    const input = e.target as HTMLInputElement;
    const errortext = (e.target as HTMLInputElement).parentElement?.querySelector(`#${input.id}__field-error`);
    if (errortext) {
      if (!input.validity.valid) {
        (e.target as HTMLInputElement).className = 'field__input field__input_errored';
        errortext.className = 'field__error field__error_active';
      } else {
        (e.target as HTMLInputElement).className = 'field__input';
        errortext.className = 'field__error';
      }
    }
  }

  async onFormSubmit(e:Event) {
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
      if (inputs.length === 7) { // регистрация(sign-up)
        const errortext = (e.target as HTMLInputElement).querySelector('#password_again__field-error');
        if (inputs[6].value === inputs[5].value && errortext) {
          errortext.className = 'field__error';
          errortext.textContent = 'Некорректный пароль';
          for (let i = 0; i < inputs.length - 1; i += 1) { // убрали один, чтобы не отправлять повтор пароля
            const input = inputs[i];
            submitValue[input.name] = input.value;
          }
          this.authApi.register(submitValue)
            .then((data:{id: string}):void => {
              store.setState('userId', data.id);
              this.authApi.getUserInfo()
                .then((data:{[key:string]: string}):void => {
                  store.setState('userInfo', data);
                  this.router.go('/messenger');
                })
                .catch((err: Error) => {
                  is500Error(err);
                  console.log(err);
                });
            })
            .catch((err: Error) => {
              is500Error(err);
              console.log(err);
            });
        } else if (inputs[6].value !== inputs[5].value && errortext) {
          errortext.className = 'field__error field__error_active';
          errortext.textContent = 'Пароли не совпадают';
        }
      } else { // авторизация (login)
        inputs.forEach((input) => {
          submitValue[`${input.name}`] = input.value;
        });
        this.authApi.login(submitValue)
          .then(():void => {
            this.authApi.getUserInfo()
              .then((data:{[key:string]: string}):void => {
                store.setState('userInfo', data);
                this.router.go('/messenger');
              })
              .catch((err: Error) => {
                is500Error(err);
                console.log(err);
              });
          })
          .catch((err: Error) => {
            is500Error(err);
            console.log(err);
          });
      }
    } else {
      // планировал обработать ошибку, вслучае некорректных полей, но он сам не даёт отправить
      // submit при некорректных полях, так что заглушка на всякий случай
    }
  }

  override render(): string {
    return `
        <main class="form form_type_{{name}}">
            <h2 class="form__title">{{title}}</h2>
            <form class="form__list form__list_type_{{name}}" id="{{name}}__form" name={{name}} onSubmit={}>
                {{{inputs}}}
              <button class="form__button" type="submit">{{buttontext}}</button>
            </form>
            <a class="form__link" href="{{linkpath}}">{{linktext}}</a>
        </main>
        `;
  }
}
