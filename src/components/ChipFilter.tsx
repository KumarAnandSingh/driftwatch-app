'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface ChipFilterProps {
  label: string;
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  variant?: 'default' | 'ok' | 'warn' | 'err' | 'info';
  className?: string;
}

export function ChipFilter({
  label,
  selected = false,
  onToggle,
  variant = 'default',
  className = '',
}: ChipFilterProps) {
  const [isSelected, setIsSelected] = useState(selected);

  const handleClick = () => {
    const newState = !isSelected;
    setIsSelected(newState);
    onToggle?.(newState);
  };

  const getVariantClasses = () => {
    const base = 'transition-all';
    const duration = 'duration-200';
    if (isSelected) {
      switch (variant) {
        case 'ok':
          return `${base} ${duration} bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300`;
        case 'warn':
          return `${base} ${duration} bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-300`;
        case 'err':
          return `${base} ${duration} bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300`;
        case 'info':
          return `${base} ${duration} bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300`;
        default:
          return `${base} ${duration} bg-primary/10 text-primary border-primary`;
      }
    }
    return `${base} ${duration} bg-secondary hover:bg-accent text-secondary-foreground border-border hover:border-muted-foreground/30`;
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer ${getVariantClasses()} ${className}`}
    >
      {isSelected && <Check className="w-3 h-3" />}
      {label}
    </button>
  );
}

interface ChipFilterGroupProps {
  chips: Array<{
    id: string;
    label: string;
    variant?: ChipFilterProps['variant'];
  }>;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
}

export function ChipFilterGroup({
  chips,
  selectedIds = [],
  onSelectionChange,
  className = '',
}: ChipFilterGroupProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));

  const handleToggle = (chipId: string, isSelected: boolean) => {
    const newSelected = new Set(selected);
    if (isSelected) {
      newSelected.add(chipId);
    } else {
      newSelected.delete(chipId);
    }
    setSelected(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => (
        <ChipFilter
          key={chip.id}
          label={chip.label}
          variant={chip.variant}
          selected={selected.has(chip.id)}
          onToggle={(isSelected) => handleToggle(chip.id, isSelected)}
        />
      ))}
    </div>
  );
}
