/* ============================================
   SearchBar — global search with debounce
   ============================================ */
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useDebounce from '@/hooks/useDebounce';
import { useEffect } from 'react';

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  value: controlledValue,
  onChange,
  className = '',
  size = 'md',
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(controlledValue || '');
  const debouncedValue = useDebounce(localValue, debounceMs);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : localValue;

  useEffect(() => {
    if (onSearch && !isControlled) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, isControlled]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (isControlled && onChange) {
      onChange(val);
    } else {
      setLocalValue(val);
    }
  };

  const handleClear = () => {
    if (isControlled && onChange) {
      onChange('');
    } else {
      setLocalValue('');
      onSearch?.('');
    }
  };

  const sizeClasses = {
    sm: 'py-1.5 pl-9 pr-8 text-xs',
    md: 'py-2.5 pl-10 pr-9 text-sm',
    lg: 'py-3 pl-12 pr-10 text-base',
  };

  return (
    <div className={`relative ${className}`}>
      <SearchIcon
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        style={{ fontSize: size === 'sm' ? 16 : size === 'lg' ? 22 : 18 }}
      />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          w-full rounded-lg border border-[var(--border-color)]
          bg-[var(--input-bg)] text-[var(--text-primary)]
          placeholder:text-[var(--text-tertiary)]
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          hover:border-[var(--border-hover)]
          transition-all duration-200
          ${sizeClasses[size]}
        `}
        aria-label="Search"
      />
      {currentValue && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          aria-label="Clear search"
        >
          <CloseIcon style={{ fontSize: 16 }} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
