import { useState } from 'react';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const selectClasses = `
    form-select
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
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Select;