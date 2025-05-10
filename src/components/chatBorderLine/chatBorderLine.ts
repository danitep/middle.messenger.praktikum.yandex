import Block from '../../framework/Block';

export default class ChatBorderLine extends Block {
  constructor() {
    super({

    });
  }

  override render(): string {
    return `
        <div class="chat-list__border"></div>
        `;
  }
}
