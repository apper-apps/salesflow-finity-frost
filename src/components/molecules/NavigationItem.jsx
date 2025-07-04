import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const NavigationItem = ({ 
  to, 
  icon, 
  label, 
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10';
  const activeClasses = 'bg-white/20 text-white';
  const inactiveClasses = 'text-white/70 hover:text-white';

  const content = (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-center w-full"
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          className="w-5 h-5 mr-3" 
        />
      )}
      <span>{label}</span>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${inactiveClasses} ${className} w-full text-left`}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`
      }
      {...props}
    >
      {content}
    </NavLink>
  );
};

export default NavigationItem;