import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const inputClasses = `
    form-input
    ${icon ? 'pl-10' : ''}
    ${error ? 'border-error' : ''}
    ${focused ? 'border-secondary' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              className="w-5 h-5 text-gray-400" 
            />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;