import { APIAdapter } from './modules/api.js'; 
import { Contact } from './modules/contact.js'; 
import { ListView } from './modules/listView.js'; 
import { EditItemView } from './modules/editItemView.js';

const apiPaths = {
  all: {
    path: 'api/contacts', 
    method: 'GET',
    takesBody: false,
    jsonResponse: true,
  },

  'delete': {
    path: 'api/contacts/:id',
    method: 'DELETE',
    params: ['id'],
    takesBody: false,
    jsonResponse: false,
  },

  one: {
    path: 'api/contacts/:id',
    method: 'GET',
    params: ['id'],
    takesBody: false,
    jsonResponse: true,
  },

  'new': {
    path: 'api/contacts/',
    method: 'POST',
    takesBody: true,
    jsonResponse: true,
  },

  update: {
    path: 'api/contacts/:id',
    method: 'PUT',
    params: ['id'],
    takesBody: true,
    jsonResponse: true,
  },
};

class App {
  #listView;
  #storage;
  #contactForm;

  constructor() {
    this.clearForms();
    this.#listView = new ListView($('#list'), contact_template, this);
    this.#listView.makeRenderer($('#contact_template'));
    this.#listView.bindSearch($('#search-contacts'));
    this.#storage = new APIAdapter(apiPaths);
    this.#contactForm = new EditItemView(
      $('#add-contact-btn'),
      $('#add-contact-layer'), 
      this
    );
    this.#contactForm.makeRenderer($('#add_contact_tmpl'));
  }

  start() {
    this.#storage.getAll().then(data => {
      let contacts = data.map(obj => new Contact(obj));
      contacts.forEach(contact => this.addTags(contact.tags));
      this.#listView.createList(contacts);
    });
  }

  clearForms() {
    [...document.querySelectorAll('form')].forEach(form => form.reset());
  }

  addTags(tags) {
    tags.forEach(tag => this.#contactForm.addTag(tag));
  }

  add(data) {
    data = this.normalizeTags(data);
    this.#storage.saveNew(data)
      .then(newData => {
        const newContact = new Contact(newData);
        this.#listView.add(newContact)
        this.addTags(newContact.tags);
      });
  }

  delete(id) {
    this.#storage.delete(id)
      .then(() => this.#listView.remove(id));
  }

  edit(contact) {
    this.#contactForm.openForEdit(contact);
  }

  normalizeTags(formData) {
    const tags = formData.getAll('tags');
    formData.delete('tags');
    formData.append('tags', tags.join(','));
    return formData;
  }

  update(updatedData) {
    updatedData = this.normalizeTags(updatedData);
    let id = updatedData.get('id');
    this.#storage.update(id, updatedData)
      .then(newData => {
        const newContact = new Contact(newData);
        this.#listView.update(id, newContact)
        this.addTags(newContact.tags);
      });
  }
}

$(() => {
  (new App()).start();
});

