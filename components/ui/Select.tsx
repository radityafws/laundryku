'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T extends SelectOption> {
  options: T[];
  value?: T | null;
  onChange: (option: T | null) => void;
  onCreateOption?: (inputValue: string) => void;
  placeholder?: string;
  isSearchable?: boolean;
  isCreatable?: boolean;
  isLoading?: boolean;
  onInputChange?: (inputValue: string) => void;
  className?: string;
  error?: string;
}

export default function Select<T extends SelectOption>({
  options,
  value,
  onChange,
  onCreateOption,
  placeholder = 'Select...',
  isSearchable = true,
  isCreatable = false,
  isLoading = false,
  onInputChange,
  className = '',
  error
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on input
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
    ('phone' in option && (option as any).phone?.includes(inputValue))
  );

  // Check if we can create a new option
  const canCreate = isCreatable && inputValue && 
    !options.some(option => option.label.toLowerCase() === inputValue.toLowerCase());

  const allOptions = canCreate 
    ? [...filteredOptions, { value: inputValue, label: `Create "${inputValue}"` } as T]
    : filteredOptions;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : allOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && allOptions[highlightedIndex]) {
          handleOptionSelect(allOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleOptionSelect = (option: T) => {
    if (canCreate && option.label.startsWith('Create "')) {
      onCreateOption?.(inputValue);
      setInputValue('');
    } else {
      onChange(option);
      setInputValue(isSearchable ? option.label : '');
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
    
    if (!isOpen) {
      setIsOpen(true);
    }
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    onChange(null);
    setInputValue('');
    setIsOpen(false);
  };

  const displayValue = value ? value.label : '';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`relative border-2 rounded-xl transition-all duration-300 ${
        error ? 'border-red-300' : isOpen ? 'border-blue-500' : 'border-gray-200'
      } ${isOpen ? 'ring-4 ring-blue-100' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={isSearchable ? inputValue : displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          readOnly={!isSearchable}
          className="w-full px-4 py-3 pr-10 bg-transparent outline-none cursor-pointer"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
          <span className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}>
            ▼
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Loading...
            </div>
          ) : allOptions.length > 0 ? (
            allOptions.map((option, index) => (
              <button
                key={`${option.value}-${index}`}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  highlightedIndex === index ? 'bg-blue-50' : ''
                } ${option.label.startsWith('Create "') ? 'text-blue-600 font-medium' : ''}`}
              >
                <div className="font-medium text-gray-900">
                  {option.label.startsWith('Create "') ? (
                    <span className="flex items-center space-x-2">
                      <span>➕</span>
                      <span>{option.label}</span>
                    </span>
                  ) : (
                    option.label
                  )}
                </div>
                {'phone' in option && !(option.label.startsWith('Create "')) && (
                  <div className="text-sm text-gray-500">{(option as any).phone}</div>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-gray-500">
              {inputValue ? 'No options found' : 'Start typing to search...'}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}