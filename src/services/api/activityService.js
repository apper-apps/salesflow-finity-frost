import activitiesData from '@/services/mockData/activities.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(300);
    return [...this.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  }

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      timestamp: new Date().toISOString(),
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await delay(400);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id),
    };
    
    return { ...this.activities[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const deletedActivity = this.activities.splice(index, 1)[0];
    return { ...deletedActivity };
  }

  async getByContact(contactId) {
    await delay(200);
    return this.activities
      .filter(activity => activity.contactId === contactId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getByType(type) {
    await delay(200);
    return this.activities
      .filter(activity => activity.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

export default new ActivityService();