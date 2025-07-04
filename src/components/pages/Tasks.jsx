import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import taskService from '@/services/api/taskService';
import contactService from '@/services/api/contactService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks data');
      toast.error('Failed to load tasks data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleTaskComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId, completed);
      setTasks(prev => prev.map(t => 
        t.Id === taskId ? updatedTask : t
      ));
      toast.success(completed ? 'Task completed' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      setModalLoading(true);
      
      let savedTask;
      if (selectedTask) {
        // Update existing task
        savedTask = await taskService.update(selectedTask.Id, taskData);
        setTasks(prev => prev.map(t => 
          t.Id === selectedTask.Id ? savedTask : t
        ));
        toast.success('Task updated successfully');
      } else {
        // Create new task
        savedTask = await taskService.create(taskData);
        setTasks(prev => [...prev, savedTask]);
        toast.success('Task created successfully');
      }
      
      setShowModal(false);
      setSelectedTask(null);
    } catch (err) {
      toast.error('Failed to save task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const today = tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      const now = new Date();
      return taskDate.toDateString() === now.toDateString() && !t.completed;
    }).length;
    const overdue = tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      const now = new Date();
      return taskDate < now && !t.completed;
    }).length;

    return { total, completed, today, overdue };
  };

  if (loading) {
    return <Loading type="default" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and stay on top of your schedule
          </p>
        </div>
        <Button 
          icon="Plus" 
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-success to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-warning to-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-error to-red-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      <TaskList
        tasks={tasks}
        onTaskComplete={handleTaskComplete}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        loading={loading}
      />

      <TaskModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={selectedTask}
        contacts={contacts}
        loading={modalLoading}
      />
    </div>
  );
};

export default Tasks;