import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  task = null,
  contacts = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contactId: '',
    dueDate: '',
    priority: 'medium',
    completed: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        contactId: task.contactId || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'medium',
        completed: task.completed || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        contactId: '',
        dueDate: '',
        priority: 'medium',
        completed: false,
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const taskData = {
      ...formData,
      Id: task?.Id,
    };
    
    onSave(taskData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      contactId: '',
      dueDate: '',
      priority: 'medium',
      completed: false,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const contactOptions = contacts.map(contact => ({
    value: contact.Id,
    label: `${contact.name} (${contact.company})`,
  }));

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="modal-content w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon="X"
              onClick={handleClose}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body space-y-6">
            <FormField
              name="title"
              label="Task Title"
              value={formData.title}
              onChange={handleFieldChange}
              error={errors.title}
              required
              placeholder="Enter task title"
              icon="CheckSquare"
            />

            <FormField
              name="description"
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={handleFieldChange}
              error={errors.description}
              placeholder="Enter task description"
              rows={3}
            />

            <FormField
              name="contactId"
              label="Contact"
              type="select"
              value={formData.contactId}
              onChange={handleFieldChange}
              error={errors.contactId}
              required
              options={contactOptions}
              placeholder="Select a contact"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="dueDate"
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={handleFieldChange}
                error={errors.dueDate}
                required
                icon="Calendar"
              />

              <FormField
                name="priority"
                label="Priority"
                type="select"
                value={formData.priority}
                onChange={handleFieldChange}
                error={errors.priority}
                required
                options={priorityOptions}
              />
            </div>

            {task && (
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="completed"
                  checked={formData.completed}
                  onChange={(e) => handleFieldChange('completed', e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                  Mark as completed
                </label>
              </div>
            )}
          </div>

          <div className="card-footer">
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {task ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;