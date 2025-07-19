/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import sinon from 'sinon';
import router from './router';

describe('Router', () => {
  // без этой штуки не запускается тест
  const variable: string = '';
  console.log(variable);

  // тест на то что компонент вызывает history.pushState
  it('Должен вызывать history.pushState', () => {
    const spyPS = sinon.spy(window.history, 'pushState');
    router.go('/sign-up');

    expect(spyPS.calledOnce).to.be.eq(true);
  });

  // тест на то что компонент вызывает history.back
  it('Должен вызывать history.back', () => {
    const spyBack = sinon.spy(window.history, 'back');
    router.go('/sign-up');
    router.back();

    expect(spyBack.calledOnce).to.be.eq(true);
  });

  // тест на то что компонент вызывает history.forward
  it('Должен вызывать history.forward', () => {
    const spyForward = sinon.spy(window.history, 'forward');
    router.go('/sign-up');
    router.forward();

    expect(spyForward.calledOnce).to.be.eq(true);
  });
});
