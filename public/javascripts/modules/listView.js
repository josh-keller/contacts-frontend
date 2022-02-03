class ListView {
  #tags;

  constructor($container, renderItem, app) {
    this.$container = $container;
    this.app = app;
    this.renderItem = renderItem;
    this.bindEvents();
  }

  makeRenderer(template) {
    this.renderItem = Handlebars.compile(template.text());
  }

  bindSearch($searchForm) {
    let timeoutID;
    const $queryInput = $searchForm.find('#query');
    const $criteriaSelect = $searchForm.find('#criteria');

    $searchForm.on('input', event => {
      event.preventDefault();
      clearTimeout(timeoutID);

      const queryString = $queryInput.val().trim();
      const criteria = $criteriaSelect.val();

      if (queryString.length === 0) {
        this.showAllItems();
      } else {
        timeoutID = setTimeout(
          this.filterView.bind(this, queryString, criteria),
          100
        );
      }
    });
  }

  showAllItems() {
    this.$container.children().each( function() { $(this).show() });
  }

  filterView(queryString, criteria) {
    this.$container.children().each( function() {
      let $item = $( this );
      let contact = $item.data('contact');
      if (contact.matches(queryString, criteria)) {
        $item.show();
      } else {
        $item.hide();
      }
    });
  }


  bindEvents() {
    this.$container.on(
      'click', 
      '.delete',
      this.handleDelete.bind(this)
    );

    this.$container.on(
      'click',
      '.edit',
      this.handleEdit.bind(this)
    );
  }

  createList(initList) {
    initList.forEach(contact => {
      this.add(contact);
    });
  }

  add(contact) {
    let $li = $(this.renderItem(contact));
    $li.data("contact", contact);
    this.$container.append($li);
  }

  handleEdit(event) {
    event.preventDefault()
    const $item = $(event.currentTarget).closest('li');
    this.app.edit($item.data('contact'));
  }

  handleDelete(event) {
    event.preventDefault()
    const id = event.currentTarget.dataset.id;
    const name = event.currentTarget.closest('li').querySelector('.name').textContent;
    if(confirm(`Delete ${name} from your contacts?`)) {
      this.app.delete(id);
    }
  }

  remove(id) {
    const $contact = this.$container.find(`li[data-id=${id}]`);
    $contact.fadeOut(200, () => $contact.remove());
  }

  update(id, updatedContact) {
    const $old = this.$container.find(`li[data-id=${id}]`);
    const $updated = $(this.renderItem(updatedContact));
    $updated.data("contact", updatedContact);
    $old.replaceWith($updated);
  }

  // filterOnName(searchCriteria) {
  //
  // }
  //
  // filterOnTag(searchCriteria) {
  //
  // }
}

export { ListView };
