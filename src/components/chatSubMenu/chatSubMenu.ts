import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';
import ChatSettingsRow from '../chatSettingsRow/chatSettingsRow';

export default class ChatSubMenu extends Block {
  constructor(props:PropsWithChildren) {
    const popupsData:PropsWithChildren[] = props.buttons as PropsWithChildren[];
    const chatSettingsRows:ChatSettingsRow[] = [];

    popupsData.forEach((popupData:PropsWithChildren):void => {
      chatSettingsRows.push(new ChatSettingsRow({
        params: popupData,
      }));
    });
    super({
      ...props,
      chatSettingsRows,
    });
  }

  override render(): string {
    return `
        <div class="additional-popup"
        popover
        id="submenu">
            {{{chatSettingsRows}}}
        </div>
        `;
  }
}
