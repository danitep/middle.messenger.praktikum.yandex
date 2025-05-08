import Block from "../../framework/Block";
import { PropsWithChildren } from "../../utils/blockInterfaces";

export class InputField extends Block{
    constructor (props:PropsWithChildren){
        super({
            ...props,
        });
    }

    override render(): string {
        return`
        <div class="field__container field__container_{{params.name}}">
            <label class="field__name field__name_active_{{params.isNameActive}}" >{{params.placeholder}}</label>
            <input type="{{params.type}}" 
            class="field__input" 
            id="{{params.name}}" 
            name="{{params.name}}" 
            onChange={}
            placeholder="{{params.placeholder}}" 
            required 

            {{#if params.pattern}}
            pattern={{params.pattern}}
            {{/if}}
            
            minLength={{params.minLength}} 
            maxLength={{params.maxLength}}/>
            <span class="field__error" id="{{params.name}}__field-error">{{params.errortext}}</span>
        </div>
        `
    }
}