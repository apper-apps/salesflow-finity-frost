// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.tableName = 'app_Activity';
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
          { field: { Name: "type" } },
          { field: { Name: "contactId" } },
          { field: { Name: "subject" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
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
          { field: { Name: "contactId" } },
          { field: { Name: "subject" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } },
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
      console.error(`Error fetching activity with ID ${id}:`, error);
      throw error;
    }
  }

  async create(activityData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: activityData.subject,
        type: activityData.type,
        contactId: parseInt(activityData.contactId),
        subject: activityData.subject,
        notes: activityData.notes || '',
        timestamp: new Date().toISOString()
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
          console.error(`Failed to create ${failedRecords.length} activities:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create activity');
        }
        
        return successfulRecords[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async update(id, activityData) {
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
        Name: activityData.subject,
        type: activityData.type,
        contactId: parseInt(activityData.contactId),
        subject: activityData.subject,
        notes: activityData.notes || '',
        timestamp: activityData.timestamp || new Date().toISOString()
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
          console.error(`Failed to update ${failedUpdates.length} activities:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update activity');
        }
        
        return successfulUpdates[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error updating activity:', error);
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
          console.error(`Failed to delete ${failedDeletions.length} activities:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete activity');
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  async getByContact(contactId) {
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
          { field: { Name: "contactId" } },
          { field: { Name: "subject" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } }
        ],
        where: [
          {
            FieldName: "contactId",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching activities by contact:', error);
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
          { field: { Name: "contactId" } },
          { field: { Name: "subject" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: [type]
          }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching activities by type:', error);
      throw error;
    }
  }
}

export default new ActivityService();