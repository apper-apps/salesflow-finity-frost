// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.tableName = 'app_contact';
  }

  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "lastContact" } },
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

      return response.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "lastContact" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  }

  async create(contactData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: contactData.name || contactData.Name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        status: contactData.status,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags || '',
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString()
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
          console.error(`Failed to create ${failedRecords.length} contacts:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create contact');
        }
        
        return successfulRecords[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async update(id, contactData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: contactData.name || contactData.Name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        status: contactData.status,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : contactData.tags || '',
        lastContact: new Date().toISOString()
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
          console.error(`Failed to update ${failedUpdates.length} contacts:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update contact');
        }
        
        return successfulUpdates[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async delete(id) {
    await delay(300);
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
          console.error(`Failed to delete ${failedDeletions.length} contacts:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete contact');
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  async search(query) {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "lastContact" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "email",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "company",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }
  }
}

export default new ContactService();