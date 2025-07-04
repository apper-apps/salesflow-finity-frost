import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  const baseClasses = 'card bg-white rounded-card shadow-card';
  const hoverClasses = hover ? 'hover:shadow-card-hover transition-shadow duration-200' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;