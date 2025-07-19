/* eslint-disable import/no-extraneous-dependencies */
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { createSandbox, SinonStub } from 'sinon';
import { HTTP } from './fetch';
import { queryStringify } from './extraFunctions';

describe('HTTPRequest', () => {
  use(sinonChai);
  const sandbox = createSandbox();
  let http: HTTP;
  let request: SinonStub<any>;

  // тест создание запроса
  it('Должен отправлять GET', () => {
    http = new HTTP('');
    request = sandbox.stub(http, 'request' as keyof typeof http).callsFake(() => Promise.resolve());
    http.get('', {
      data: { message: 'sometext' },
    });

    expect(request).calledWith('', { data: { message: 'sometext' }, method: 'GET' });
  });

  // тест строки запроса
  it('Должен правильно оформлять строку для { message: "sometext" }', () => {
    expect(queryStringify({ message: 'sometext' })).to.be.eq('?message=sometext');
  });

  // тест строки запроса
  it('Должен правильно оформлять строку для { a: "1", b: "2" }', () => {
    expect(queryStringify({ a: '1', b: '2' })).to.be.eq('?a=1&b=2');
  });

  // тест строки запроса
  it('Должен правильно оформлять строку для { a: "1", b: "2 2"  }', () => {
    expect(queryStringify({ a: '1', b: '2 2' })).to.be.eq('?a=1&b=2%202');
  });
});
