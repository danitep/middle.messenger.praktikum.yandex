/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai';
import { loginParams } from '../utils/pageVariables';
import Login from './login';

describe('LoginPage', () => {
  const loginPage = new Login(loginParams);

  // тест рендера страницы
  it('Должен выдавать шаблон страницы', () => {
    expect(loginPage.render().includes('<div id="app">')).to.be.eq(true);
  });
});
