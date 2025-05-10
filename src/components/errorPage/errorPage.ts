import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class ErrorPage extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });
  }

  override render(): string {
    return `
        <main class="page__error">
            <h1 class="err-page__header">{{params.number}}</h1>
            <h2 class="err-page__greeting">{{params.greeting}}</h2>
            <a class="err-page__link" href={{params.link}}>Назад к чатам</a>
        </main>
        `;
  }
}
