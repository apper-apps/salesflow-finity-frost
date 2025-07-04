import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = 'No data found',
  description = 'Get started by adding your first item',
  icon = 'Inbox',
  actionLabel = 'Add Item',
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-card p-12 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          icon="Plus"
          size="lg"
          className="mb-6"
        >
          {actionLabel}
        </Button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-info to-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Zap" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Quick Setup</h4>
            <p className="text-sm text-gray-600">Get up and running in minutes with our intuitive interface</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-success to-accent rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Shield" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Secure & Reliable</h4>
            <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-warning to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Headphones" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">24/7 Support</h4>
            <p className="text-sm text-gray-600">Our team is here to help you succeed every step of the way</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;