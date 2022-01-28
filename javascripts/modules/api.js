class APIAdapter {
  #fetch;

  constructor(apiDescription) {
    this.#fetch = {};

    Object.keys(apiDescription).forEach(apiCall => {
      this.#fetch[apiCall] = this.#makeFetchFunction(apiDescription[apiCall]);
    });
  }

  #makeFetchFunction(init) {
    return function(...args) {
      let url = init.path;
      const method = init.method;
      let body = (init.takesBody ? args.pop() : undefined);

      if (body instanceof FormData) {
        body = new URLSearchParams(body);
      }

      if (init.params) {
        init.params.forEach(param => {
          url = url.replace(':' + param, args.shift());
        });
      }

      const request = new Request(url, { 
        body, 
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      });

      return fetch(request).then(response => {
          if (response.ok && init.jsonResponse) {
            return response.json();
          } else if (response.ok) {
            return Promise.resolve(true);
          } else {
            throw `Fetch error (${response.status}): ${response.statusText}`;
          }
        });
    };
  }

  async getAll() {
    return await this.#fetch.all();
  }
  
  async delete(id) {
    return await this.#fetch.delete(id);
  }

  async getOne(id) {
    return await this.#fetch.one(id);
  }

  async saveNew(body) {
    return await this.#fetch.new(body);
  }

  async update(id, body) {
    return await this.#fetch.update(id, body);
  }
}

export { APIAdapter };
