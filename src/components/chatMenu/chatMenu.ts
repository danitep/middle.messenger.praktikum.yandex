import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class ChatMenu extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });

    const newProps = props;
    const events = {
      events: {
        submit: this.onMessageSend.bind(this),
      },
    };
    const propsWithEvents = Object.assign(newProps, events);

    this.setProps(propsWithEvents);
  }

  onMessageSend(e:Event) {
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
      inputs.forEach((input) => {
        submitValue[input.name] = input.value;
        input.value = '';
      });

      // пока не сделана связь с сервером, то просто затычка
      console.log(submitValue);
    }
  }

  override render(): string {
    return `
        <div class="chat__menu">
            <button class="chat__button" id="AddToMessage" type="button" popovertarget="popup_add_data"></button>
            <form class="chat__form">
                <input type="text" 
                    class="chat__input" 
                    id="message" 
                    name="message" 
                    onChange={}
                    placeholder="Сообщение"
                    required
                       
                    minLength=1/>
                <button class="chat__submit" type="submit"></button>
            </form>
        </div>
        `;
  }
}
