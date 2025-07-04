import { useState } from 'react';

const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const textareaClasses = `
    form-textarea
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
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default TextArea;