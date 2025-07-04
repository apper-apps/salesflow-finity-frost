import { motion } from 'framer-motion';

const Loading = ({ type = 'default', className = '' }) => {
  const loadingVariants = {
    default: (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton w-12 h-12 rounded-full"></div>
              </div>
              <div className="skeleton h-8 w-16 mb-2"></div>
              <div className="skeleton h-3 w-24"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="skeleton h-6 w-32 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="skeleton w-12 h-12 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4"></div>
                  <div className="skeleton h-3 w-1/2"></div>
                </div>
                <div className="skeleton h-8 w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    
    table: (
      <div className={`bg-white rounded-lg shadow-card ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="skeleton h-6 w-32"></div>
        </div>
        <div className="space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div className="flex-1 grid grid-cols-4 gap-4">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
              <div className="skeleton h-8 w-20"></div>
            </div>
          ))}
        </div>
      </div>
    ),
    
    cards: (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="skeleton h-5 w-24"></div>
              <div className="skeleton h-6 w-12"></div>
            </div>
            <div className="space-y-3">
              <div className="skeleton h-8 w-20"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    
    pipeline: (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="skeleton h-6 w-20"></div>
              <div className="skeleton h-6 w-8"></div>
            </div>
            <div className="skeleton h-4 w-16"></div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white rounded-lg shadow-card p-4">
                  <div className="skeleton h-4 w-full mb-3"></div>
                  <div className="skeleton h-6 w-20 mb-2"></div>
                  <div className="skeleton h-3 w-24"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="animate-pulse"
    >
      {loadingVariants[type]}
    </motion.div>
  );
};

export default Loading;