/* eslint-disable no-unused-vars */
enum METHOD {// в упор не видит, что METHOD вызывается в коде
        GET = 'GET',
        POST = 'POST',
        PUT = 'PUT',
        DELETE = 'DELETE'
}

type Options = {
    method: METHOD;
    [key: string]: any;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

function queryStringify(data: string) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  // Здесь достаточно и [object Object] для объекта
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => `${result}${key}=${encodeURIComponent(data[key])}${index < keys.length - 1 ? '&' : ''}`, '?');
}

export class HTTP {
  url: string;

  constructor(url:string) {
    this.url = url;
  }

  get = (path:string, options?:OptionsWithoutMethod) => this.request(this.url + path, { ...options, method: METHOD.GET }, options?.timeout);

  post = (path:string, options?:OptionsWithoutMethod) => this.request(this.url + path, { ...options, method: METHOD.POST }, options?.timeout);

  put = (path:string, options?:OptionsWithoutMethod) => this.request(this.url + path, { ...options, method: METHOD.PUT }, options?.timeout);

  delete = (path:string, options?:OptionsWithoutMethod) => this.request(this.url + path, { ...options, method: METHOD.DELETE }, options?.timeout);

  request = (url:string, options = {}, timeout = 5000) => {
    const {
      headers = {},
      method,
      data,
      formData,
      credentials,
    } = options as OptionsWithoutMethod;
    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHOD.GET;

      xhr.open(
        method,
        isGet && !!data
          ? `${url}${queryStringify(data)}`
          : url,
      );

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      xhr.withCredentials = !!credentials;
      if (formData) {
        xhr.send(formData);
      } else if (isGet || (!data && !formData)) {
        xhr.send();
      } else {
        const json = JSON.stringify(data);
        xhr.send(json);
      }
    });
  };
}

const apiInstance = new HTTP('https://ya-praktikum.tech/api/v2/');
export default apiInstance;
