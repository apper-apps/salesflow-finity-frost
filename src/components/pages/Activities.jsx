import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ActivityFeed from '@/components/organisms/ActivityFeed';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import activityService from '@/services/api/activityService';
import { format } from 'date-fns';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await activityService.getAll();
      setActivities(data);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const filterOptions = [
    { value: 'all', label: 'All Activities', icon: 'Activity' },
    { value: 'call', label: 'Calls', icon: 'Phone' },
    { value: 'email', label: 'Emails', icon: 'Mail' },
    { value: 'meeting', label: 'Meetings', icon: 'Users' },
    { value: 'task', label: 'Tasks', icon: 'CheckSquare' },
    { value: 'note', label: 'Notes', icon: 'FileText' },
  ];

  const getFilteredActivities = () => {
    if (filter === 'all') {
      return activities;
    }
    return activities.filter(activity => activity.type === filter);
  };

  const getActivityStats = () => {
    const total = activities.length;
    const today = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      return activityDate.toDateString() === now.toDateString();
    }).length;
    
    const thisWeek = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return activityDate >= weekStart;
    }).length;

    const byType = filterOptions.slice(1).map(option => ({
      type: option.value,
      label: option.label,
      count: activities.filter(a => a.type === option.value).length,
      icon: option.icon,
    }));

    return { total, today, thisWeek, byType };
  };

  if (loading) {
    return <Loading type="default" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadActivities} />;
  }

  const filteredActivities = getFilteredActivities();
  const stats = getActivityStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">
            Track all your customer interactions and activities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="RefreshCw" onClick={loadActivities}>
            Refresh
          </Button>
          <Button icon="Plus">
            Log Activity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-success to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-info to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">📈</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.byType.map((type) => (
            <div key={type.type} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">{type.count}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{type.label}</p>
            </div>
          ))}
        </div>
      </div>

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

      <ActivityFeed
        activities={filteredActivities}
        loading={loading}
      />
    </div>
  );
};

export default Activities;