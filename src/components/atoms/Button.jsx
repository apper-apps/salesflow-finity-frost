import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'btn-primary focus:ring-primary',
    secondary: 'btn-secondary focus:ring-secondary',
    success: 'btn-success focus:ring-success',
    danger: 'btn-danger focus:ring-error',
    outline: 'btn-outline focus:ring-primary',
  };

  const sizes = {
    sm: 'btn-sm',
    default: '',
    lg: 'btn-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="w-4 h-4 animate-spin mr-2" 
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 mr-2" 
        />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 ml-2" 
        />
      )}
    </motion.button>
  );
};

export default Button;