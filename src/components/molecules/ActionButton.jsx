import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  icon,
  loading = false,
  disabled = false,
  tooltip,
  className = '',
  ...props
}) => {
  return (
    <div className="relative inline-block">
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        icon={icon}
        loading={loading}
        disabled={disabled}
        className={className}
        {...props}
      >
        {children}
      </Button>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default ActionButton;