import Block from "../framework/Block";
import { PropsWithChildren } from "../utils/blockInterfaces";
import { Form } from "../components/form/form";

export class Login extends Block{
    constructor (props:PropsWithChildren){
        super({
            ...props,
            form: new Form({
                title: props.title, 
                name: props.name, 
                buttontext: props.buttontext, 
                linktext: props.linktext,
                linkpath: props.linkpath,
                inputParams: props.inputs
            })
        });
    }

    override render(): string {
        return`
        <div id="app">
            {{{form}}}
        </div>
        `
    }
}