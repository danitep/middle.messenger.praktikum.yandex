enum METHOD {
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
  return keys.reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}

class HTTPTransport {
  get = (url:string, options:Options = { method: METHOD.GET }) => this.request(url, { ...options, method: METHOD.GET }, options.timeout);

  post = (url:string, options:Options = { method: METHOD.POST }) => this.request(url, { ...options, method: METHOD.POST }, options.timeout);

  put = (url:string, options:Options = { method: METHOD.PUT }) => this.request(url, { ...options, method: METHOD.PUT }, options.timeout);

  delete = (url:string, options:Options = { method: METHOD.DELETE }) => this.request(url, { ...options, method: METHOD.DELETE }, options.timeout);

  request = (url:string, options = {}, timeout = 5000) => {
    const { headers = {}, method, data } = options as OptionsWithoutMethod;

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

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}
