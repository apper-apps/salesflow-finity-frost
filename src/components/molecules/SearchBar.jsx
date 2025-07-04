import { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  onClear,
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange?.(e);
  };

  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear?.();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          icon="Search"
          {...props}
        />
      </div>
      <Button
        onClick={handleSearch}
        variant="secondary"
        icon="Search"
        className="shrink-0"
      >
        Search
      </Button>
      {searchTerm && (
        <Button
          onClick={handleClear}
          variant="outline"
          icon="X"
          className="shrink-0"
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default SearchBar;