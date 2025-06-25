import Block from '../../framework/Block';
import { Props, PropsWithChildren } from '../../utils/blockInterfaces';
import store, { Store } from '../../utils/store';

export default class ChatPopup extends Block {
  store: Store;

  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });

    this.store = store;

    const newProps = props;
    const events = {
      events: {
        popup_close: this.onLayoutClick.bind(this),
        popup_submit: this.onSubmit.bind(this),
      },
    };
    const propsWithEvents = Object.assign(newProps, events);
    this.setProps(propsWithEvents);
  }

  onSubmit(e:Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input');
    const button = (e as SubmitEvent).submitter;

    if (button) {
      if (button.id === 'add_user') { // добавляем пользователя
        if (input?.value) {
          ((this.props.submitFunctions as Props).addUser as Function)(input.value);
        }
      }
      if (button.id === 'remove_user') { // удаляем пользователя
        if (input?.value) {
          ((this.props.submitFunctions as Props).removeUser as Function)(input.value);
        }
      }
      if (button.id === 'add_chat') { // добавляем чат
        if (input?.value) {
          ((this.props.submitFunctions as Props).addChat as Function)(input.value);
        }
      }
      if (button.id === 'remove_chat') { // удаляем чат
        ((this.props.submitFunctions as Props).removeChat as Function)(Number(store.getState().clickedChatId));
      }
    }
    this._element?.classList.remove('chat-popup__layout_active');
    /*
    const input = form.querySelector('input');
    const submitValue: {[key: string]: string } = {};

    console.log(input?.value);
    if (input?.value) { // заготовка на потом, если вдруг пустое значение нельзя отправлять
      submitValue[`${input.name}`] = input.value;
      console.log(submitValue);
      this._element?.classList.remove('chat-popup__layout_active');
    }
    // пока не сделана связь с сервером, то просто затычка

    */
  }

  onLayoutClick(e:Event) {
    if ((e.target as HTMLDivElement).className.includes('chat-popup__layout')) {
      e.preventDefault();
      this._element?.classList.remove('chat-popup__layout_active');
    }
  }

  override render(): string {
    return `
        <div class="chat-popup__layout" id="{{id}}">
            <form class="chat-popup">
                <p class="chat-popup__title">{{title}}</p>
                    {{#if deleteChat}}
                    <p class="chat-popup__question">Уверены, что хотите удалить чат?</p>
                    {{else}}
                      {{#if addChat}}
                      <p class="chat-popup__span">Название чата</p>
                      {{else}}
                      <p class="chat-popup__span">Логин</p>
                      {{/if}}
                    <input type="text" 
                      class="chat-popup__input" 
                      id="login" 
                      name="login" 
                      onChange={}
                      placeholder="Логин"
                      value=""
                      required         
                      minLength=1/>
                    {{/if}}
                    <button class="chat-popup__submit-button" type="submit" id="{{buttonId}}">{{buttonText}}</button>
            </form>
        </div>
        `;
  }
}
