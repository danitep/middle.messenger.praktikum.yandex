import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";
import { ProfileLink } from "../profileLink/profileLink";
import { ProfileRow } from "../profileRow/profileRow";

const createChildren = (props: PropsWithChildren) => {
    const passwordRowsData:PropsWithChildren[] = props.passwordRowsData as PropsWithChildren[];
    const profileRowsData: PropsWithChildren[] = props.profileRowsData as PropsWithChildren[];
    const buttonsData: PropsWithChildren[] = props.buttonsData as PropsWithChildren[];

    const passwordRows:ProfileRow[] = [];
    const profileRows:ProfileRow[] = [];
    const buttons:ProfileLink[] = [];

    passwordRowsData.forEach((rowData:PropsWithChildren):void=>{
        passwordRows.push(new ProfileRow({
            params:rowData, 
            isEditDisabled: false,
        })) 
    })
    profileRowsData.forEach((rowData:PropsWithChildren):void=>{
        profileRows.push(new ProfileRow({
            params:rowData, 
            isEditDisabled: props.isEditDisabled
        })) 
    })
    buttonsData.forEach((buttonData:PropsWithChildren):void=>{
        buttons.push(new ProfileLink({
            params:buttonData,
        })) 
    })

    return [passwordRows, profileRows, buttons];
}


export class ProfileForm extends Block{
    
    constructor (props:PropsWithChildren){
        const[passwordRows, profileRows, buttons] = createChildren(props);

        super({
            ...props,
            passwordRows: passwordRows,
            profileRows: profileRows,
            buttons: buttons,
        });
        
    }

    
    
    override render(): string {
        return`
        <form class="profile__form" name="{{#if isPasswordEditable}}passwordForm{{else}}profileForm{{/if}}">
            {{#if isPasswordEditable}}
                <div class="profile__row-container">
                    {{{passwordRows}}}
                </div>

                <button class="profile__save" type="submit">Сохранить</button>
            {{else}}
                <div class="profile__row-container">
                    {{{profileRows}}}
                </div>

                {{#if isEditDisabled}}
                    <div class="profile__link-container">
                        {{{buttons}}}
                    </div>
                {{else}}
                    <button class="profile__save" type="submit">Сохранить</button>
                {{/if}}
            {{/if}}
        </form>
        `
    }
}
