// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FilterService {
  constructor() {
    this.tableName = 'filter';
  }

  async getAll() {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "criteria" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // Parse criteria JSON strings back to objects
      const filters = (response.data || []).map(filter => ({
        ...filter,
        criteria: filter.criteria ? JSON.parse(filter.criteria) : []
      }));

      return filters;
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "criteria" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // Parse criteria JSON string back to object
      const filter = response.data;
      if (filter && filter.criteria) {
        filter.criteria = JSON.parse(filter.criteria);
      }

      return filter;
    } catch (error) {
      console.error(`Error fetching filter with ID ${id}:`, error);
      throw error;
    }
  }

  async create(filterData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: filterData.name,
        type: filterData.type,
        criteria: JSON.stringify(filterData.criteria || []),
        createdAt: new Date().toISOString()
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} filters:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create filter');
        }
        
        const createdFilter = successfulRecords[0]?.data;
        // Parse criteria back to object
        if (createdFilter && createdFilter.criteria) {
          createdFilter.criteria = JSON.parse(createdFilter.criteria);
        }
        
        return createdFilter;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error creating filter:', error);
      throw error;
    }
  }

  async update(id, filterData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: filterData.name,
        type: filterData.type,
        criteria: JSON.stringify(filterData.criteria || [])
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} filters:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update filter');
        }
        
        const updatedFilter = successfulUpdates[0]?.data;
        // Parse criteria back to object
        if (updatedFilter && updatedFilter.criteria) {
          updatedFilter.criteria = JSON.parse(updatedFilter.criteria);
        }
        
        return updatedFilter;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error updating filter:', error);
      throw error;
    }
  }

  async delete(id) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} filters:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete filter');
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error deleting filter:', error);
      throw error;
    }
  }

  async getByType(type) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "criteria" } },
          { field: { Name: "createdAt" } }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: [type]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // Parse criteria JSON strings back to objects
      const filters = (response.data || []).map(filter => ({
        ...filter,
        criteria: filter.criteria ? JSON.parse(filter.criteria) : []
      }));

      return filters;
    } catch (error) {
      console.error('Error fetching filters by type:', error);
      throw error;
    }
  }

  // Apply filter criteria to data (static method for client-side filtering)
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