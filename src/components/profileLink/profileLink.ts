import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class ProfileLink extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });
  }

  override render(): string {
    return `
        <a class="profile__link" href="{{{params.link}}}">{{params.text}}</a>
        `;
  }
}
