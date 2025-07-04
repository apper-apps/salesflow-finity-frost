import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-card p-12 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-error to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Oops! Something went wrong</h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      <div className="flex items-center justify-center space-x-4">
        {onRetry && (
          <Button
            onClick={onRetry}
            icon="RefreshCw"
            variant="primary"
          >
            Try Again
          </Button>
        )}
        
        <Button
          onClick={() => window.location.reload()}
          icon="RotateCcw"
          variant="outline"
        >
          Reload Page
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          If this problem persists, please contact support or check your internet connection.
        </p>
      </div>
    </motion.div>
  );
};

export default Error;