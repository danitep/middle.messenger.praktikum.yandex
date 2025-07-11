/* eslint-disable import/no-extraneous-dependencies */
// import Sinon from 'sinon';
import { expect } from 'chai';
import Block from './Block';
import { PropsWithChildren } from '../utils/blockInterfaces';

describe('Block', () => {
  let PageComponent: typeof Block;

  beforeEach(() => {
    class Page extends Block {
      constructor(props: PropsWithChildren) {
        console.log(1);
        super(props);
      }

      render() {
        return `<div>
          <span id="test-text">{{text}}</span>
          <button>{{text-button}}</button>
        </div>`;
      }
    }

    PageComponent = Page;
  });

  // тест на то что компонент создаётся с переданными пропсами
  it('Должен создать компонент с состоянием из конструктора', () => {
    const text = 'Hello';

    const pageComponent = new PageComponent({ text });

    const spanText = pageComponent.element?.querySelector('#test-text')?.innerHTML;

    expect(spanText).to.be.eq(text);
  });
});
