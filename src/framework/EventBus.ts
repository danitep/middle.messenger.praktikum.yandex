export default class EventBus {
  // eslint-disable-next-line no-unused-vars
  listeners:{[key: string]: ((data: string) => void)[]};

  constructor() {
    this.listeners = {};
  }

  on = (event:string, callback:any) => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  };

  off = (event:string, callback:any) => {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback,
    );
  };

  emit(event:string, ...args:any) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event].forEach((listener) => {
      listener(args);
    });
  }
}
