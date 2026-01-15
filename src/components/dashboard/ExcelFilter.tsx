'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

interface ExcelFilterProps {
  columnKey: string;
  options: string[];
  selectedValues: string[];
  onFilterChange: (columnKey: string, values: string[]) => void;
  searchable?: boolean;
}

export default function ExcelFilter({
  columnKey,
  options,
  selectedValues,
  onFilterChange,
  searchable = true,
}: ExcelFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onFilterChange(columnKey, newValues);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      onFilterChange(columnKey, []);
    } else {
      onFilterChange(columnKey, filteredOptions);
    }
  };

  const hasActiveFilter = selectedValues.length > 0 && selectedValues.length < options.length;

  return (
    <div className="excel-filter">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`excel-filter-button ${hasActiveFilter ? 'active' : ''}`}
        title="Filtrar"
      >
        <Filter size={10} strokeWidth={2} />
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="excel-filter-dropdown">
          {searchable && (
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="excel-filter-dropdown"
            />
          )}
          <div className="excel-filter-options">
            <div
              className="excel-filter-option font-semibold"
              onClick={handleSelectAll}
            >
              <input
                type="checkbox"
                checked={
                  filteredOptions.length > 0 &&
                  filteredOptions.every((opt) => selectedValues.includes(opt))
                }
                onChange={handleSelectAll}
                onClick={(e) => e.stopPropagation()}
              />
              <span>Selecionar Todos</span>
            </div>
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="excel-filter-option"
                onClick={() => handleToggleOption(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleToggleOption(option)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
          {hasActiveFilter && (
            <div className="p-2 border-t border-[#d0d0d0]">
              <button
                onClick={() => {
                  onFilterChange(columnKey, []);
                  setIsOpen(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 w-full text-left px-2 py-1"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
