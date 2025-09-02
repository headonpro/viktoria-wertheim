'use client'

import { ReactNode } from 'react'

interface FilterOption {
  value: string
  label: string
}

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterOptions?: FilterOption[]
  filterLabel?: string
  children?: ReactNode
  className?: string
}

export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "🔍 Suchen...",
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "Filter",
  children,
  className = ""
}: SearchFilterBarProps) {
  return (
    <div className={`admin-filter-bar ${className}`}>
      {/* Search Input */}
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="admin-search-input"
      />

      {/* Filter Dropdown */}
      {filterOptions && onFilterChange && (
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="admin-filter-select"
          aria-label={filterLabel}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Additional Actions */}
      {children}
    </div>
  )
}

// Pre-configured common filter options
export const commonFilterOptions = {
  categories: [
    { value: 'all', label: 'Alle Kategorien' },
    { value: 'match_report', label: 'Spielbericht' },
    { value: 'transfers', label: 'Transfers' },
    { value: 'youth', label: 'Jugend' },
    { value: 'training', label: 'Training' },
    { value: 'club_news', label: 'Vereinsnachrichten' },
    { value: 'general', label: 'Allgemein' },
  ],
  
  status: [
    { value: 'all', label: 'Alle Status' },
    { value: 'active', label: 'Aktiv' },
    { value: 'inactive', label: 'Inaktiv' },
  ],

  positions: [
    { value: 'all', label: 'Alle Positionen' },
    { value: 'Torwart', label: 'Torwart' },
    { value: 'Abwehr', label: 'Abwehr' },
    { value: 'Mittelfeld', label: 'Mittelfeld' },
    { value: 'Sturm', label: 'Sturm' },
  ],

  teams: [
    { value: 'all', label: 'Alle Teams' },
    // Teams would be populated dynamically
  ]
}