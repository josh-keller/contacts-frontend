class Contact {
  constructor(initObj) {
    this.id = initObj.id;
    this.fullName = initObj.full_name;
    this.email = initObj.email;
    this.phone = initObj.phone_number;
    this.tags = initObj.tags?.split(',') || [];
    this.tags = this.tags.filter(tag => tag.length > 0);
    this.nameParts = undefined;
    this.parseName();
  }

  static caseIncludes(query, str) {
    return str.toLowerCase().includes(query.toLowerCase());
  }

  // Returns true if the contact matches the query
  matches(queryString, criteria) {
    return this[criteria + 'Matches'](queryString);
  }

  allMatches(query) {
    const stringified = JSON.stringify(this);
    return Contact.caseIncludes(query, stringified);
  }

  nameMatches(query) {
    return this.nameParts.some(namePart => {
      return Contact.caseIncludes(query, namePart);
    });
  }

  tagsMatches(query) {
    const allTags = this.tags.join(',');
    return Contact.caseIncludes(query, allTags);
  }

  emailMatches(query) {
    return Contact.caseIncludes(query, this.email);
  }

  phoneMatches(query) {
    return Contact.caseIncludes(query, this.phone);
  }

  parseName() {
    this.nameParts = this.fullName.split(' ');
  }
}

export { Contact };
