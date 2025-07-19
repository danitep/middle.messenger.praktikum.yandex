/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import sinon from 'sinon';
import EventBus from './EventBus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  // тест вызова обработчика
  it('Должен вызвать подписанный обработчик', () => {
    const clickHandlerStub = sinon.stub();
    eventBus.on('click', clickHandlerStub);
    eventBus.emit('click');

    expect(clickHandlerStub.calledOnce).to.be.eq(true);
  });

  // тест вызова только одного обработчика
  it('Должен вызвать только вызванный обработчик', () => {
    const clickHandlerStub = sinon.stub();
    const clickHandlerStubSecond = sinon.stub();
    eventBus.on('click', clickHandlerStub);
    eventBus.on('click_second', clickHandlerStubSecond);
    eventBus.emit('click');

    expect(clickHandlerStubSecond.notCalled && clickHandlerStub.calledOnce).to.be.eq(true);
  });

  // тест отписку обработчика
  it('Не должен вызвать отписанный обработчик', () => {
    const clickHandlerStub = sinon.stub();
    eventBus.on('click', clickHandlerStub);
    eventBus.off('click', clickHandlerStub);
    eventBus.emit('click');

    expect(clickHandlerStub.notCalled).to.be.eq(true);
  });

  // тест на выдачу ошибки, в случае вызова несуществующего обработчика
  it('Должен выдать ошибку, если вызван несуществующий обработчик', () => {
    const eventName = 'click';

    const deleteFunction = () => {
      eventBus.emit(eventName);
    };

    expect(deleteFunction).to.throw(`Нет события: ${eventName}`);
  });
});
