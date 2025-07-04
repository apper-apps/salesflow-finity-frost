// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tableName = 'task';
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
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "contactId" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "dueDate", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
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
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: taskData.completed || false,
        contactId: parseInt(taskData.contactId)
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
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create task');
        }
        
        return successfulRecords[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, taskData) {
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
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: taskData.completed || false,
        contactId: parseInt(taskData.contactId)
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
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update task');
        }
        
        return successfulUpdates[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error updating task:', error);
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
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete task');
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async toggleComplete(id, completed) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateableData = {
        Id: parseInt(id),
        completed: completed
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
          console.error(`Failed to toggle ${failedUpdates.length} task completion:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to toggle task completion');
        }
        
        return successfulUpdates[0]?.data;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  async getByStatus(status) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const now = new Date();
      let params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "contactId" } }
        ]
      };

      switch (status) {
        case 'today':
          params.where = [
            {
              FieldName: "dueDate",
              Operator: "EqualTo",
              Values: [now.toISOString().split('T')[0]]
            },
            {
              FieldName: "completed",
              Operator: "EqualTo",
              Values: [false]
            }
          ];
          break;
        case 'upcoming':
          params.where = [
            {
              FieldName: "dueDate",
              Operator: "GreaterThan",
              Values: [now.toISOString()]
            },
            {
              FieldName: "completed",
              Operator: "EqualTo",
              Values: [false]
            }
          ];
          break;
        case 'overdue':
          params.where = [
            {
              FieldName: "dueDate",
              Operator: "LessThan",
              Values: [now.toISOString()]
            },
            {
              FieldName: "completed",
              Operator: "EqualTo",
              Values: [false]
            }
          ];
          break;
        case 'completed':
          params.where = [
            {
              FieldName: "completed",
              Operator: "EqualTo",
              Values: [true]
            }
          ];
          break;
      }

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      throw error;
    }
  }
}

export default new TaskService();