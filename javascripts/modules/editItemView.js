class EditItemView {
  #tags;

  constructor(openBtn, layer, app) {
    this.$layer = layer;
    this.$openBtn = openBtn;
    this.$formContainer = layer.find('#form-container');
    this.$closeBtn = layer.find('.close-layer');
    this.#tags = new Set();
    this.app = app;
    this.bindEvents();
    Handlebars.registerHelper('selectSize', (tags) => Math.min(tags.length + 1, 4));
    Handlebars.registerHelper('selectTag', (tag, selectedTags) => {
      return selectedTags.includes(tag) ? "selected" : "";
    });
  }

  addTag(tag) {
    this.#tags.add(tag);
  }

  makeRenderer(template) {
    this.renderForm = Handlebars.compile(template.text());
  }

  bindEvents() {
    this.$formContainer.on('click', 'input[value="Cancel"]', this.close.bind(this));
    this.$openBtn.click(this.open.bind(this));
    this.$formContainer.submit(this.submit.bind(this));
  }

  submit(event) {
    event.preventDefault();

    const data = new FormData(this.$form[0]);

    if (this.$form.data('edit')) {
      this.app.update(data);
    } else {
      this.app.add(data);
    }

    this.$form[0].reset();
    this.close(event);
  }

  open(event) {
    event.preventDefault();

    const formHTML = this.renderForm(
      {
        formTitle: "Add New Contact",
        buttonText: "Create Contact",
        data: {},
        tags: [...this.#tags],
        selectedTags: [],
      }
    );

    this.$form = $(formHTML);
    this.$formContainer.empty().append(this.$form);
    this.$layer.fadeIn(250);
  }

  openForEdit(data) {
    const formHTML = this.renderForm(
      {
        data,
        formTitle: "Edit Contact",
        buttonText: "Update Contact",
        tags: [...this.#tags],
        selectedTags: data.tags,
      }
    );
    this.$form = $(formHTML);
    this.$form.data('edit', true);
    this.$formContainer.empty().append(this.$form);
    this.$layer.fadeIn(250);
  }

  close(event) {
    event.preventDefault();
    this.$layer.fadeOut(250, () => this.$form[0].reset());
  }
}

export { EditItemView };
