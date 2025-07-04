import contactsData from '@/services/mockData/contacts.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await delay(300);
    return [...this.contacts];
  }

  async getById(id) {
    await delay(200);
    const contact = this.contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  }

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await delay(400);
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id),
    };
    
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const deletedContact = this.contacts.splice(index, 1)[0];
    return { ...deletedContact };
  }

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default new ContactService();