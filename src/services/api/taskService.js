import tasksData from '@/services/mockData/tasks.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay(400);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id),
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async toggleComplete(id, completed) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      completed,
    };
    
    return { ...this.tasks[index] };
  }

  async getByStatus(status) {
    await delay(200);
    const now = new Date();
    
    switch (status) {
      case 'today':
        return this.tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate.toDateString() === now.toDateString() && !task.completed;
        });
      case 'upcoming':
        return this.tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate > now && !task.completed;
        });
      case 'overdue':
        return this.tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate < now && !task.completed;
        });
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return [...this.tasks];
    }
  }
}

export default new TaskService();