import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'status-badge inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    active: 'active',
    inactive: 'inactive',
    lead: 'lead',
    qualified: 'qualified',
    proposal: 'proposal',
    negotiation: 'negotiation',
    closed: 'closed',
    high: 'priority-badge high',
    medium: 'priority-badge medium',
    low: 'priority-badge low',
    success: 'bg-gradient-to-r from-success to-accent text-white',
    warning: 'bg-gradient-to-r from-warning to-yellow-400 text-white',
    error: 'bg-gradient-to-r from-error to-red-400 text-white',
    info: 'bg-gradient-to-r from-info to-secondary text-white',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;