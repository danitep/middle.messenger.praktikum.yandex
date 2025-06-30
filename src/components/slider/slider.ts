import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

export default class Slider extends Block {
  constructor(props:PropsWithChildren) {
    super({
      ...props,
    });
  }

  override render(): string {
    return `
        <a class="slider" href={{linkpath}}></a>
        `;
  }
}
