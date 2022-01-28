// Get and display all contacts:
//
// - Load index.html
//   - This has handlebars templates for a single contact and the contact list
//  
//
//  - Class for list
//  
//

// Makes all calls to API and returns contact, array of contacts, or errors
// ??? do I want this to create the contact or let my contact List class do it?

const apiPaths = {
  all: {
    path: 'api/contacts', 
    method: 'GET',
    takesBody: false,
  },

  'delete': {
    path: 'api/contacts/:id',
    method: 'DELETE',
    params: ['id'],
    takesBody: false,
  },

  one: {
    path: 'api/contacts/:id',
    method: 'GET',
    params: ['id'],
    takesBody: false,
  },

  'new': {
    path: 'api/contacts/',
    method: 'POST',
    takesBody: true,
  },

  update: {
    path: 'api/contacts/:id',
    method: 'PUT',
    params: ['id'],
    takesBody: true,
  },
};


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
      let method = init.method;
      let body = (init.takesBody ? args.pop() : undefined);

      if (init.params) {
        init.params.forEach(param => {
          url = url.replace(':' + param, args.shift());
        });
      }

      const request = new Request(url, { body, method });

      return fetch(request).then(response => {
          if (response.ok) {
            return response.json();
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

class Contact {
  constructor(initObj) {
    this.id = initObj.id;
    this.fullName = initObj.full_name;
    this.email = initObj.email;
    this.phone = initObj.phone_number;
    this.tags = initObj.tags?.split(',') || [];
    this.parseName();
  }

  // Returns true if the contact matches the query
  matches(queryString) {

  }

  // Returns true if a tag matches the queryTag
  tagsMatch(queryTag) {

  }

  // Parses into an array of name parts for search
  parseName() {
    this.nameParts = this.fullName.split(' ');
  }
}

class ListView {
  #list;
  #tags;

  constructor($container, dataToHTML) {
    this.#list = [];
    this.$container = $container;
    //this.#tags = new Set();
    this.dataToHTML = dataToHTML;
  }

  createList(initList) {
    initList.forEach(contact => {
      let $li = $(this.dataToHTML(contact));
      this.$container.append($li);
    });
  }

  addTags(tags) {
    if (typeof tags === 'string') {
      tags = [tags];
    }
    
    tags.forEach(tag => this.#tags.add(tag));
  }

  // add(initObj) {
  //   const newContact = new Contact(initObj);
  //   this.#contacts.push(newContact);
  //   this.addTags(newContact.tags);
  //   return newContact;
  // }

  delete(id) {
    // const delIdx = this.#contacts.findIndex(contact => contact.id = id);
    // this.#contacts.splice(delIdx, 1);
  }

  update(id, update) {
    // const updateIdx = this.#contacts.findIndex(contact => contact.id = id);
    // this.#contacts[updateIdx] = new Contact(update);
    // return this.#contacts[updateIdx];
  }

  filterOnName(searchCriteria) {

  }

  filterOnTag(searchCriteria) {

  }
}

function setUp() {
  const contact_template = Handlebars.compile($('#contact_template').text());
  const listView = new ListView($('#list'), contact_template);
  const api = new APIAdapter(apiPaths);



  api.getAll().then(data => {
    let contacts = data.map(obj => new Contact(obj));
    listView.createList(contacts);
  });
}

$(setUp);


/*
const presenter = (function pMaker() {
  const contacts = ContactList;
  const storage = APIAdapter;
  const


  return {


  };
}())


*/
