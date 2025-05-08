import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";
import { ChatSettingsRow } from "../chatSettingsRow/chatSettingsRow";

export class ChatSettingsPopup extends Block{
    constructor (props:PropsWithChildren){
        const popupsData:PropsWithChildren[] = props.buttons as PropsWithChildren[];
        const chatSettingsRows:ChatSettingsRow[] = [];

        popupsData.forEach((popupData:PropsWithChildren):void=>{
            chatSettingsRows.push(new ChatSettingsRow({
                params:popupData
            })) 
        })
        super({
          ...props,
          chatSettingsRows:chatSettingsRows
        });
    }

    override render(): string {
        return`
        <div class="
        additional-popup 
        {{#if isActive}}additional-popup_active{{/if}}
        {{#if isSettings}}additional-popup_settings{{/if}}
        {{#if isAdd}}additional-popup_add{{/if}}"

        popover

        id="{{#if isSettings}}popup_settings{{/if}}{{#if isAdd}}popup_add_data{{/if}}">
            {{{chatSettingsRows}}}
        </div>
        `
    }
}

