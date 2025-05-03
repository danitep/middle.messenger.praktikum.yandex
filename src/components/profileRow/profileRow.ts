import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";

export class ProfileRow extends Block{
    constructor (props:PropsWithChildren){
        super({
            ...props,
        });
    }

    override render(): string {
        return`
        <div class="profile__text-container">
            <label class="profile__row-name">{{params.placeholder}}</label>
            <input type="{{params.type}}" 
                class="profile__input profile__input_errored_{{params.isErrored}}" 
                id="{{params.name}}" 
                name="{{params.name}}" 
                onChange={}
                placeholder="{{params.placeholder}}"
                value={{params.value}}
                required
                {{#if isEditDisabled}}
                disabled
                {{/if}}
                
                minLength={{params.minLength}} 
                maxLength={{params.maxLength}}/>
        </div>
        `
    }
}
