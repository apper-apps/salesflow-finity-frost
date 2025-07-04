import filtersData from '@/services/mockData/filters.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FilterService {
  constructor() {
    this.filters = [...filtersData];
  }

  async getAll() {
    await delay(200);
    return [...this.filters];
  }

  async getById(id) {
    await delay(200);
    const filter = this.filters.find(f => f.Id === parseInt(id));
    if (!filter) {
      throw new Error('Filter not found');
    }
    return { ...filter };
  }

  async create(filterData) {
    await delay(300);
    const newFilter = {
      ...filterData,
      Id: Math.max(...this.filters.map(f => f.Id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    this.filters.push(newFilter);
    return { ...newFilter };
  }

  async update(id, filterData) {
    await delay(300);
    const index = this.filters.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Filter not found');
    }
    
    this.filters[index] = {
      ...this.filters[index],
      ...filterData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };
    
    return { ...this.filters[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.filters.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Filter not found');
    }
    
    const deletedFilter = this.filters.splice(index, 1)[0];
    return { ...deletedFilter };
  }

  async getByType(type) {
    await delay(200);
    return this.filters.filter(filter => filter.type === type);
  }

  // Apply filter criteria to data
  static applyFilters(data, criteria) {
    if (!criteria || criteria.length === 0) {
      return data;
    }

    return data.filter(item => {
      return criteria.every(criterion => {
        const { field, operator, value } = criterion;
        const itemValue = item[field];

        if (itemValue === undefined || itemValue === null) {
          return false;
        }

        switch (operator) {
          case 'equals':
            return itemValue.toString().toLowerCase() === value.toString().toLowerCase();
          
          case 'notEquals':
            return itemValue.toString().toLowerCase() !== value.toString().toLowerCase();
          
          case 'contains':
            return itemValue.toString().toLowerCase().includes(value.toString().toLowerCase());
          
          case 'startsWith':
            return itemValue.toString().toLowerCase().startsWith(value.toString().toLowerCase());
          
          case 'endsWith':
            return itemValue.toString().toLowerCase().endsWith(value.toString().toLowerCase());
          
          case 'greaterThan':
            return parseFloat(itemValue) > parseFloat(value);
          
          case 'lessThan':
            return parseFloat(itemValue) < parseFloat(value);
          
          case 'greaterThanOrEqual':
            return parseFloat(itemValue) >= parseFloat(value);
          
          case 'lessThanOrEqual':
            return parseFloat(itemValue) <= parseFloat(value);
          
          case 'in':
            if (Array.isArray(itemValue)) {
              return itemValue.some(v => value.includes(v));
            }
            return value.includes(itemValue);
          
          case 'before':
            return new Date(itemValue) < new Date(value);
          
          case 'after':
            return new Date(itemValue) > new Date(value);
          
          default:
            return false;
        }
      });
    });
  }
}

export default new FilterService();