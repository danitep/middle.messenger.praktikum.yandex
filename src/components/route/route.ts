import Block from '../../framework/Block';
import { PropsWithChildren } from '../../utils/blockInterfaces';

type PlainObject<T = unknown> = {
  [key: string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object'
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is ([] | PlainObject) {
  return isPlainObject(value) || isArray(value);
}

function isEqual(lhs: PlainObject|[]|unknown, rhs: PlainObject|[]|unknown) {
  if (isArrayOrObject(lhs) && isArrayOrObject(rhs)) {
    for (let i = 0; i < Object.entries(lhs).length; i += 1) { // Object.entries(lhs)
      const [key, value]:[string, unknown] = Object.entries(lhs)[i];
      let rightValue:unknown;
      if (isArray(rhs)) { // если массив?
        if (Number.isNaN(Number(key))) { // если каким-то образом будет сравниваться объект с массивом с key instance of string
          return false;
        }
        rightValue = rhs[Number(key)];
      } else { // если объект
        rightValue = rhs[key];
      }
      if (isArrayOrObject(value) && isArrayOrObject(rightValue)) { // если поле объект или массив
        // Здесь value и rightValue может быть только массивом или объектом
        // и TypeScript это понимает с помощью Type Guard
        if (isEqual(value, rightValue)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        return false;
      }

      if (value !== rightValue) {
        return false;
      }
    }
  } else if (lhs !== rhs) {
    return false;
  }

  return true;
}

function render(query:string, block:Block) { // вставляем в разметку
  let root = document.querySelector(query);
  if (root) {
    root.replaceWith(block.getContent() as Node);
    root = document.querySelector(query);
  }
  return root;
}

export default class Route {
  _pathname: string;

  _blockClass: typeof Block;

  _block: Block|null;

  _props:PropsWithChildren;

  constructor(pathname: string, view:typeof Block, props:PropsWithChildren) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return isEqual(pathname, this._pathname);
  }

  render() {
    this._block = new this._blockClass(this._props);
    render(this._props.rootQuery as string, this._block);
  }
}
