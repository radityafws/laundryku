'use client';

import React, { useState } from 'react';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const presetRanges = [
  {
    label: 'Hari Ini',
    getValue: () => {
      const today = new Date().toISOString().split('T')[0];
      return { startDate: today, endDate: today };
    }
  },
  {
    label: 'Kemarin',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const date = yesterday.toISOString().split('T')[0];
      return { startDate: date, endDate: date };
    }
  },
  {
    label: 'Minggu Ini',
    getValue: () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return {
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      };
    }
  },
  {
    label: 'Bulan Ini',
    getValue: () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      };
    }
  },
  {
    label: '7 Hari Terakhir',
    getValue: () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      return {
        startDate: sevenDaysAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    }
  },
  {
    label: '30 Hari Terakhir',
    getValue: () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29);
      
      return {
        startDate: thirtyDaysAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    }
  }
];

export default function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pilih rentang tanggal...',
  className = '',
  error
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = (range: DateRange) => {
    if (!range.startDate && !range.endDate) return '';
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    if (range.startDate === range.endDate) {
      return formatDate(range.startDate);
    }
    
    return `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`;
  };

  const handlePresetSelect = (preset: typeof presetRanges[0]) => {
    const range = preset.getValue();
    onChange(range);
    setIsOpen(false);
  };

  const handleCustomRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    onChange({
      ...value,
      [field]: value
    });
  };

  const handleClear = () => {
    onChange({ startDate: '', endDate: '' });
    setIsOpen(false);
  };

  const displayValue = formatDateRange(value);

  return (
    <div className={`relative ${className}`}>
      <div className={`relative border-2 rounded-xl transition-all duration-300 ${
        error ? 'border-red-300' : isOpen ? 'border-blue-500' : 'border-gray-200'
      } ${isOpen ? 'ring-4 ring-blue-100' : ''}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 pr-10 text-left bg-transparent outline-none"
        >
          <span className={displayValue ? 'text-gray-900' : 'text-gray-500'}>
            {displayValue || placeholder}
          </span>
        </button>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {displayValue && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
          <span className="text-gray-400">📅</span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
          {/* Preset Ranges */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Preset Rentang</h4>
            <div className="grid grid-cols-2 gap-2">
              {presetRanges.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Rentang Kustom</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={value.startDate}
                  onChange={(e) => handleCustomRangeChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Tanggal Akhir</label>
                <input
                  type="date"
                  value={value.endDate}
                  onChange={(e) => handleCustomRangeChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}