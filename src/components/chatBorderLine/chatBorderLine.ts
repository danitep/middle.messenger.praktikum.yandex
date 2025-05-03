import Block from "../../framework/Block";

export class ChatBorderLine extends Block{
    constructor (){
        super({
          
        });
    }

    override render(): string {
        return`
        <div class="chat-list__border"></div>
        `
    }
}