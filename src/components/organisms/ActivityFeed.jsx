import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const ActivityFeed = ({ 
  activities = [], 
  loading = false,
  className = '' 
}) => {
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

  const getActivityColor = (type) => {
    switch (type) {
      case 'call':
        return 'info';
      case 'email':
        return 'secondary';
      case 'meeting':
        return 'success';
      case 'task':
        return 'warning';
      case 'note':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-3 w-1/2"></div>
              <div className="skeleton h-16 w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="text-center py-12">
        <ApperIcon name="Activity" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities yet</h3>
        <p className="text-gray-600">
          Activities will appear here as you interact with contacts and manage deals
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="flex items-start space-x-4"
        >
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              getActivityColor(activity.type) === 'info' ? 'bg-gradient-to-r from-info to-secondary' :
              getActivityColor(activity.type) === 'success' ? 'bg-gradient-to-r from-success to-accent' :
              getActivityColor(activity.type) === 'warning' ? 'bg-gradient-to-r from-warning to-yellow-400' :
              getActivityColor(activity.type) === 'secondary' ? 'bg-gradient-to-r from-secondary to-accent' :
              'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}>
              <ApperIcon 
                name={getActivityIcon(activity.type)} 
                className="w-5 h-5 text-white" 
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <Card>
              <div className="card-body">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                    <Badge variant={getActivityColor(activity.type)} size="sm">
                      {activity.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                    {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                
                <div className="flex items-center mb-3 text-sm text-gray-600">
                  <ApperIcon name="User" className="w-4 h-4 mr-1" />
                  Contact ID: {activity.contactId}
                </div>
                
                {activity.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{activity.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;