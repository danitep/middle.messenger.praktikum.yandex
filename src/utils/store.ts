type Indexed<T = any> = {
    [key: string]: T;
};

function merge(lhs: Indexed, rhs: Indexed): Indexed { // объединение(merge) объектов
  for (let i = 0; i < Object.entries(rhs).length; i += 1) {
    const [key]:[string, unknown] = Object.entries(rhs)[i];
    if (!Object.prototype.hasOwnProperty.call(rhs, key)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    try {
      if (rhs[key].constructor === Object) {
        lhs[key] = lhs[key] ? lhs[key] : {};
        rhs[key] = merge(lhs[key] as Indexed, rhs[key] as Indexed);
      } else {
        lhs[`${key}`] = rhs[key];
      }
    } catch (e) {
      console.log(e);
    }
  }

  return lhs;
}

function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown { // установка нового значения в объекте
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }

  const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
    [key]: acc,
  }), value as any);
  return merge(object as Indexed, result);
}

export class Store {
  private state: Indexed = {};

  constructor() {
    const localState = localStorage.getItem('store');
    if (localState) {
      this.state = JSON.parse(localState);
    }
  }

  public getState() {
    return this.state;
  }

  public setState(path: string, value: unknown) {
    set(this.state, path, value);
    localStorage.setItem('store', JSON.stringify(this.getState()));
  }

  public clearLocalStorage() {
    localStorage.setItem('store', JSON.stringify({}));
  }
}

const store = new Store();
export default store;
