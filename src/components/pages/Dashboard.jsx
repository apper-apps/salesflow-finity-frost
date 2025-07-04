import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import taskService from '@/services/api/taskService';
import activityService from '@/services/api/activityService';
import { format, isToday, isPast } from 'date-fns';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    contacts: [],
    deals: [],
    tasks: [],
    activities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [contacts, deals, tasks, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll(),
      ]);
      
      setDashboardData({
        contacts,
        deals,
        tasks,
        activities,
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getDashboardStats = () => {
    const { contacts, deals, tasks } = dashboardData;
    
    const totalContacts = contacts.length;
    const activeContacts = contacts.filter(c => c.status === 'active').length;
    
    const totalDeals = deals.length;
    const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = deals.filter(d => d.stage === 'closed').length;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const todayTasks = tasks.filter(t => isToday(new Date(t.dueDate)) && !t.completed).length;
    const overdueTasks = tasks.filter(t => isPast(new Date(t.dueDate)) && !t.completed).length;
    
    return {
      totalContacts,
      activeContacts,
      totalDeals,
      totalDealValue,
      wonDeals,
      totalTasks,
      completedTasks,
      todayTasks,
      overdueTasks,
    };
  };

  const getUpcomingTasks = () => {
    return dashboardData.tasks
      .filter(task => !task.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getRecentActivities = () => {
    return dashboardData.activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  };

  const getPipelineStats = () => {
    const { deals } = dashboardData;
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
    
    return stages.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      return {
        stage,
        count: stageDeals.length,
        value: stageValue,
      };
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return 'Phone';
      case 'email':
        return 'Mail';
      case 'meeting':
        return 'Users';
      case 'task':
        return 'CheckSquare';
      case 'note':
        return 'FileText';
      default:
        return 'Activity';
    }
  };

  const getTaskStatusColor = (task) => {
    if (task.completed) return 'text-success';
    if (isPast(new Date(task.dueDate))) return 'text-error';
    if (isToday(new Date(task.dueDate))) return 'text-warning';
    return 'text-gray-600';
  };

  if (loading) {
    return <Loading type="default" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const stats = getDashboardStats();
  const upcomingTasks = getUpcomingTasks();
  const recentActivities = getRecentActivities();
  const pipelineStats = getPipelineStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="RefreshCw" onClick={loadDashboardData}>
            Refresh
          </Button>
          <Button icon="Plus">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          change={`${stats.activeContacts} active`}
          changeType="positive"
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Total Deals"
          value={stats.totalDeals}
          change={`${stats.wonDeals} closed`}
          changeType="positive"
          icon="Target"
          color="secondary"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.totalDealValue)}
          change="This month"
          changeType="neutral"
          icon="DollarSign"
          color="success"
        />
        <StatCard
          title="Tasks"
          value={stats.totalTasks}
          change={`${stats.completedTasks} completed`}
          changeType="positive"
          icon="CheckSquare"
          color="info"
        />
      </div>

      {/* Pipeline Overview */}
      <Card>
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStats.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 mb-3">
                  <div className="text-white text-2xl font-bold">{stage.count}</div>
                  <div className="text-white/80 text-sm capitalize">{stage.stage}</div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(stage.value)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
              <Button variant="outline" size="sm" icon="Plus">
                Add Task
              </Button>
            </div>
          </div>
          <div className="card-body">
            {upcomingTasks.length === 0 ? (
              <Empty
                title="No upcoming tasks"
                description="All caught up! No tasks scheduled for the near future."
                icon="CheckSquare"
                actionLabel="Add Task"
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.Id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        <span className={getTaskStatusColor(task)}>
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                        {task.priority === 'high' && (
                          <span className="ml-2 px-2 py-1 bg-error text-white text-xs rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon="ExternalLink" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <Button variant="outline" size="sm" icon="Activity">
                View All
              </Button>
            </div>
          </div>
          <div className="card-body">
            {recentActivities.length === 0 ? (
              <Empty
                title="No recent activities"
                description="Start interacting with your contacts to see activities here."
                icon="Activity"
                actionLabel="Add Activity"
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.Id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon 
                        name={getActivityIcon(activity.type)} 
                        className="w-4 h-4 text-white" 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Contact ID: {activity.contactId}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              icon="UserPlus"
              className="h-20 flex-col"
            >
              <span className="mt-2">Add Contact</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              icon="Target"
              className="h-20 flex-col"
            >
              <span className="mt-2">Create Deal</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              icon="CheckSquare"
              className="h-20 flex-col"
            >
              <span className="mt-2">Add Task</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              icon="Mail"
              className="h-20 flex-col"
            >
              <span className="mt-2">Log Activity</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;