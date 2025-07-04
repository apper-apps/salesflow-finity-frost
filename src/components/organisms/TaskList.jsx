import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { format, isToday, isPast, isFuture } from 'date-fns';

const TaskList = ({ 
  tasks = [], 
  onTaskComplete, 
  onTaskEdit, 
  onTaskDelete,
  loading = false,
  className = '' 
}) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'today', label: 'Today', icon: 'Calendar' },
    { value: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { value: 'overdue', label: 'Overdue', icon: 'AlertTriangle' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' },
  ];

  const getFilteredTasks = () => {
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return tasks.filter(task => isToday(new Date(task.dueDate)) && !task.completed);
      case 'upcoming':
        return tasks.filter(task => isFuture(new Date(task.dueDate)) && !task.completed);
      case 'overdue':
        return tasks.filter(task => isPast(new Date(task.dueDate)) && !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'low';
    }
  };

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed';
    if (isPast(new Date(task.dueDate))) return 'overdue';
    if (isToday(new Date(task.dueDate))) return 'today';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'overdue':
        return 'error';
      case 'today':
        return 'warning';
      case 'upcoming':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((option) => (
            <div key={option.value} className="skeleton h-10 w-24 rounded-lg"></div>
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-24 w-full rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'primary' : 'outline'}
            size="sm"
            icon={option.icon}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <Card className="text-center py-12">
          <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Create your first task to get started' 
              : `No ${filter} tasks at the moment`}
          </p>
          <Button icon="Plus" onClick={() => onTaskEdit?.()}>
            Add Task
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => {
            const status = getTaskStatus(task);
            
            return (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className={`${task.completed ? 'opacity-75' : ''}`}>
                  <div className="card-body">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <button
                          onClick={() => onTaskComplete?.(task.Id, !task.completed)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.completed 
                              ? 'bg-success border-success' 
                              : 'border-gray-300 hover:border-success'
                          }`}
                        >
                          {task.completed && (
                            <ApperIcon name="Check" className="w-3 h-3 text-white" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant={getPriorityColor(task.priority)} size="sm">
                              {task.priority}
                            </Badge>
                            <Badge variant={getStatusColor(status)} size="sm">
                              {status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center">
                              <ApperIcon name="User" className="w-4 h-4 mr-1" />
                              Contact ID: {task.contactId}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Edit"
                              onClick={() => onTaskEdit?.(task)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              icon="Trash2"
                              onClick={() => onTaskDelete?.(task.Id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;