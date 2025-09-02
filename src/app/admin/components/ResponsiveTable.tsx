'use client'

import { ReactNode } from 'react'

interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  render?: (value: unknown, item: T) => ReactNode
  mobileLabel?: string // Optional different label for mobile
  hideOnMobile?: boolean // Hide this column on mobile
}

interface ResponsiveTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  idField?: keyof T
  className?: string
  mobileCardHeader?: (item: T) => ReactNode
}

export default function ResponsiveTable<T extends Record<string, unknown> = Record<string, unknown>>({ 
  columns, 
  data, 
  idField = 'id' as keyof T,
  className = '',
  mobileCardHeader 
}: ResponsiveTableProps<T>) {
  const visibleColumns = columns.filter(col => !col.hideOnMobile)
  
  return (
    <div className={`responsive-table-container ${className}`}>
      {/* Desktop Table View */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={String(item[idField])}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render 
                      ? column.render(item[column.key as keyof T], item)
                      : String(item[column.key as keyof T] ?? '-')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="admin-mobile-cards">
        {data.map((item) => (
          <div key={String(item[idField])} className="admin-mobile-card">
            {/* Card Header */}
            {mobileCardHeader && (
              <div className="admin-mobile-card-header">
                {mobileCardHeader(item)}
              </div>
            )}
            
            {/* Card Content */}
            {visibleColumns.map((column) => (
              <div key={column.key} className="admin-mobile-card-row">
                <div className="admin-mobile-card-label">
                  {column.mobileLabel || column.label}:
                </div>
                <div className="admin-mobile-card-value">
                  {column.render 
                    ? column.render(item[column.key as keyof T], item)
                    : String(item[column.key as keyof T] ?? '-')
                  }
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* No Data State */}
      {data.length === 0 && (
        <div className="admin-loading">
          <p>Keine Daten vorhanden</p>
        </div>
      )}
    </div>
  )
}

// Helper component for action buttons in table cells
export function TableActions({ children }: { children: ReactNode }) {
  return <div className="admin-actions">{children}</div>
}

// Helper component for status badges
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'featured' | 'draft' | 'published'
  children: ReactNode
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const getStatusClass = () => {
    switch (status) {
      case 'active':
      case 'published':
      case 'featured':
        return 'success'
      case 'draft':
        return 'warning'
      case 'inactive':
        return 'danger'
      default:
        return ''
    }
  }

  return (
    <span 
      className={`status-badge status-${getStatusClass()}`}
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: status === 'active' || status === 'published' || status === 'featured' ? '#28a745' :
                        status === 'draft' ? '#ffc107' : '#dc3545',
        color: 'white'
      }}
    >
      {children}
    </span>
  )
}