import Block from "../framework/Block";
import { PropsWithChildren } from "../utils/blockInterfaces";
import { ErrorPage } from "../components/errorPage/errorPage";

export class Err5xx extends Block{
    constructor (props:PropsWithChildren){
        super({
            ...props,
            errorPage: new ErrorPage({
                params: props
            })
        });
        
    }

    override render(): string {
        return`
        <div id="app">
            {{{errorPage}}}
        </div>
        `
    }
}