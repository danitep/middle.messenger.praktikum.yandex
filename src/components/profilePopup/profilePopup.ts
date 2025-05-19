import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class ProfilePopup extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });

    const newProps = props;
    const events = {
      events: {
        popup_close: this.onLayoutClick.bind(this),
        popup_submit: this.onSubmit.bind(this),
        change: this.validateForm.bind(this),
      },
    };
    const propsWithEvents = Object.assign(newProps, events);
    this.setProps(propsWithEvents);
  }

  validateForm(e:Event) {
    const title = this._element?.querySelector('.popup__title');
    let fileNameP = (e.target as HTMLInputElement).parentElement?.querySelector('.popup__input-text');
    fileNameP = fileNameP || (e.target as HTMLInputElement).parentElement?.querySelector('.popup__image-name');
    const input = (e.target as HTMLInputElement).parentElement?.querySelector('input');
    const submitButton = this._element?.getElementsByClassName('popup__submit-button');
    const errortext = this._element?.querySelector('.popup__error');
    if (fileNameP && input && title && submitButton && errortext) {
      if (input.files) {
        if ((/\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/i).test(input.files[0].name)) {
          fileNameP.textContent = input.files[0].name;
          fileNameP.className = 'popup__image-name';
          title.textContent = 'Файл загружен';
          title.className = 'popup__title';
          errortext.className = 'popup__error popup__error_hidden';
        } else {
          title.textContent = 'Ошибка, попробуйте ещё раз';
          title.className += ' popup__title_errored';
        }
      }
    }
  }

  onLayoutClick(e:Event) {
    if ((e.target as HTMLDivElement).className.includes('popup__layout')) {
      e.preventDefault();
      this._changeProps('isOpened', false);
    }
  }

  onSubmit(e:Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input');
    const errortext = this._element?.querySelector('.popup__error');

    if (input?.files && errortext) {
      if (input.files.length > 0) {
        console.log(input.files);
        this._changeProps('isOpened', false);
      } else if (input.files.length === 0) { // если пусто - ошибка
        errortext.className = 'popup__error';
        console.log(errortext);
      }
    }
    // пока не сделана связь с сервером, то просто затычка
  }

  _changeProps(propName:string, value:boolean) {
    let newProps:PropsWithChildren = this.props as PropsWithChildren;
    (newProps.params as PropsWithChildren)[propName] = value;
    const events = {
      events: (this.props as PropsWithChildren).events,
    };
    newProps = Object.assign(newProps, events);
    this.setProps(newProps);
    this.render();
  }

  override render(): string {
    return `
        <div class="popup__layout {{#if params.isOpened}} {{else}}popup__layout_hidden{{/if}}">
            <form class="popup">
                <p class="popup__title">Загрузите файл</p>

                <div class="popup__file-button">
                    <input type="file" accept=".jpg, .jpeg, .png, .bmp, .svg" name="avatar" class="popup__file-input">
                    <p class="popup__input-text">Выбрать файл на компьютере</p>
                </div>

                <button class="popup__submit-button" type="submit">Поменять</button>
                <p class="popup__error popup__error_hidden">Нужно выбрать файл</p>
            </form>
        </div>
        `;
  }
}
