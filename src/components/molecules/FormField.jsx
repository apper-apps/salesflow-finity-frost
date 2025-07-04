import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';

const FormField = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  error,
  options = [],
  required = false,
  disabled = false,
  placeholder,
  icon,
  rows,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    onChange?.(name, e.target.value);
  };

  const commonProps = {
    label,
    value,
    onChange: handleChange,
    error,
    required,
    disabled,
    placeholder,
    className,
    ...props
  };

switch (type) {
    case 'select':
      return (
        <Select
          {...commonProps}
          options={options}
          multiple={props.multiple}
        />
      );
    case 'textarea':
      return (
        <TextArea
          {...commonProps}
          rows={rows}
        />
      );
    default:
      return (
        <Input
          {...commonProps}
          type={type}
          icon={icon}
        />
      );
  }
};

export default FormField;