// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.tableName = 'deal';
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
          { field: { Name: "title" } },
          { field: { Name: "stage" } },
          { field: { Name: "value" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "contactId" } },
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
      console.error('Error fetching deals:', error);
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
          { field: { Name: "title" } },
          { field: { Name: "stage" } },
          { field: { Name: "value" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "contactId" } },
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
      console.error(`Error fetching deal with ID ${id}:`, error);
      throw error;
    }
  }

  async create(dealData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: dealData.title,
        title: dealData.title,
        stage: dealData.stage,
        value: parseFloat(dealData.value),
        probability: parseFloat(dealData.probability),
        expectedClose: dealData.expectedClose,
        createdAt: new Date().toISOString(),
        contactId: parseInt(dealData.contactId)
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
          console.error(`Failed to create ${failedRecords.length} deals:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create deal');
        }
        
        return successfulRecords[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  async update(id, dealData) {
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
        Name: dealData.title,
        title: dealData.title,
        stage: dealData.stage,
        value: parseFloat(dealData.value),
        probability: parseFloat(dealData.probability),
        expectedClose: dealData.expectedClose,
        contactId: parseInt(dealData.contactId)
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
          console.error(`Failed to update ${failedUpdates.length} deals:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update deal');
        }
        
        return successfulUpdates[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error updating deal:', error);
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
          console.error(`Failed to delete ${failedDeletions.length} deals:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete deal');
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }

  async updateStage(id, stage) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateableData = {
        Id: parseInt(id),
        stage: stage
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
          console.error(`Failed to update ${failedUpdates.length} deal stages:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update deal stage');
        }
        
        return successfulUpdates[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error updating deal stage:', error);
      throw error;
    }
  }

  async getByStage(stage) {
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
          { field: { Name: "title" } },
          { field: { Name: "stage" } },
          { field: { Name: "value" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "contactId" } }
        ],
        where: [
          {
            FieldName: "stage",
            Operator: "EqualTo",
            Values: [stage]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching deals by stage:', error);
      throw error;
    }
  }
}

export default new DealService();