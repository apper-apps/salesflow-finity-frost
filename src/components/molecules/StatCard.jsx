import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  color = 'primary',
  className = '',
}) => {
  const colorClasses = {
    primary: 'from-primary to-primary/80',
    secondary: 'from-secondary to-secondary/80',
    success: 'from-success to-accent',
    warning: 'from-warning to-yellow-400',
    error: 'from-error to-red-400',
    info: 'from-info to-secondary',
  };

  const changeClasses = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-gray-600',
  };

  return (
    <Card className={`${className}`}>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {change && (
              <div className="flex items-center">
                <ApperIcon 
                  name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                  className={`w-4 h-4 mr-1 ${changeClasses[changeType]}`} 
                />
                <span className={`text-sm font-medium ${changeClasses[changeType]}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
              <ApperIcon 
                name={icon} 
                className="w-6 h-6 text-white" 
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;