/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import sinon from 'sinon';
import Block from './Block';

describe('Block', () => {
  let PageComponent: typeof Block;

  beforeEach(() => {
    class Page extends Block {
      //  конструктор от Block'а
      render() {
        return `<div>
          <span id="test-text">{{text}}</span>

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

  // тест на то что реактивность у компонента работает
  it('Компонент должен иметь реактивное поведение', () => {
    const newValue = 'New value';
    const pageComponent = new PageComponent({ text: 'Hello' });
    pageComponent.setProps({ text: newValue });
    const spanText = pageComponent.element?.querySelector('#test-text')?.innerHTML;

    expect(spanText).to.be.eq(newValue);
  });

  // тест на установку событий
  it('Компонент должен установить событие', () => {
    const clickHandlerStub = sinon.stub();
    const pageComponent = new PageComponent({
      events: {
        testClick: clickHandlerStub,
      },
    });
    const event = new MouseEvent('click');
    pageComponent.element?.dispatchEvent(event);

    expect(clickHandlerStub.calledOnce).to.be.eq(true);
  });

  // тест на то что нельзя удалять пропсы
  it('Не может удалять пропсы', () => {
    const pageComponent = new PageComponent({ text: 'Hello', testValue: 'you shall not delete' });

    const deleteFunction = () => {
      delete pageComponent.props.testValue;
    };

    expect(deleteFunction).to.throw('Нет доступа');
  });
});
