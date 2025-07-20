// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<body></body>', {
  url: 'https://test.ru',
});

global.window = jsdom.window;
global.document = jsdom.window.document;
global.MouseEvent = jsdom.window.MouseEvent;
global.history = jsdom.window.history;
global.PopStateEvent = jsdom.window.PopStateEvent;
global.Node = jsdom.window.Node;
global.History = jsdom.window.History;
global.XMLHttpRequest = jsdom.window.XMLHttpRequest;
global.localStorage = jsdom.window.localStorage;
global.WebSocket = jsdom.WebSocket;
