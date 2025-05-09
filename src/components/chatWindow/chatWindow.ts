import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import ChatPack from '../chatPack/chatPack';

export default class ChatWindow extends Block {
  constructor(props:PropsWithChildren) {
    const packsData:PropsWithChildren[] = props.packs as PropsWithChildren[];

    const packs:ChatPack[] = [];

    packsData.forEach((packData:PropsWithChildren):void => {
      packs.push(new ChatPack(packData));
    });
    super({
      ...props,
      packs,
    });
  }

  override render(): string {
    return `
        <div class="chat__window">
            {{{packs}}}
        </div>
        `;
  }
}
