'use client'

import { useState } from 'react'
import { Trash2, Edit3, Download } from 'lucide-react'

interface BulkAction {
  id: string
  label: string
  icon: React.ReactNode
  action: (selectedIds: string[]) => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'danger'
  requireConfirmation?: boolean
  confirmationMessage?: string
}

interface BulkActionsProps {
  data: unknown[]
  idField?: string
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  actions: BulkAction[]
  disabled?: boolean
}

export function BulkActions({
  data,
  idField = 'id',
  selectedIds,
  onSelectionChange,
  actions,
  disabled = false
}: BulkActionsProps) {
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const allIds = data.map(item => String((item as Record<string, unknown>)[idField]))
  const isAllSelected = selectedIds.length === allIds.length && allIds.length > 0
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(allIds)
    } else {
      onSelectionChange([])
    }
  }

  const handleAction = async (actionId: string) => {
    const action = actions.find(a => a.id === actionId)
    if (!action) return

    if (action.requireConfirmation) {
      setShowConfirmation(actionId)
      return
    }

    await executeAction(action)
  }

  const executeAction = async (action: BulkAction) => {
    setIsProcessing(true)
    try {
      await action.action(selectedIds)
      onSelectionChange([]) // Clear selection after successful action
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setIsProcessing(false)
      setShowConfirmation(null)
    }
  }

  const confirmAction = async () => {
    const action = actions.find(a => a.id === showConfirmation)
    if (action) {
      await executeAction(action)
    }
  }

  return (
    <>
      <div className="bulk-actions-container">
        {/* Selection Controls */}
        <div className="bulk-selection">
          <div className="bulk-checkbox-wrapper">
            <input
              type="checkbox"
              id="bulk-select-all"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isIndeterminate
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              disabled={disabled || isProcessing}
              className="bulk-checkbox"
            />
            <label htmlFor="bulk-select-all" className="bulk-checkbox-label">
              {selectedIds.length > 0 ? (
                <span className="selection-count">
                  {selectedIds.length} von {allIds.length} ausgewählt
                </span>
              ) : (
                <span>Alle auswählen</span>
              )}
            </label>
          </div>
          
          {selectedIds.length > 0 && (
            <button 
              onClick={() => onSelectionChange([])}
              className="clear-selection-btn"
              disabled={isProcessing}
            >
              Auswahl aufheben
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bulk-actions-buttons">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={disabled || isProcessing}
                className={`admin-btn bulk-action-btn ${
                  action.variant === 'danger' ? 'admin-btn-danger' :
                  action.variant === 'primary' ? 'admin-btn-primary' :
                  'admin-btn-secondary'
                }`}
              >
                {action.icon}
                <span className="bulk-action-text">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="bulk-confirmation-overlay">
          <div className="bulk-confirmation-modal">
            <h3>Aktion bestätigen</h3>
            <p>
              {actions.find(a => a.id === showConfirmation)?.confirmationMessage || 
               `Möchten Sie diese Aktion für ${selectedIds.length} Element(e) ausführen?`}
            </p>
            <div className="bulk-confirmation-actions">
              <button 
                onClick={() => setShowConfirmation(null)}
                className="admin-btn"
                disabled={isProcessing}
              >
                Abbrechen
              </button>
              <button 
                onClick={confirmAction}
                className="admin-btn admin-btn-danger"
                disabled={isProcessing}
              >
                {isProcessing ? 'Wird ausgeführt...' : 'Bestätigen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface SelectableRowProps {
  id: string
  isSelected: boolean
  onSelectionChange: (id: string, selected: boolean) => void
  children: React.ReactNode
  disabled?: boolean
}

export function SelectableRow({
  id,
  isSelected,
  onSelectionChange,
  children,
  disabled = false
}: SelectableRowProps) {
  return (
    <tr className={`selectable-row ${isSelected ? 'selected' : ''}`}>
      <td className="selection-cell">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectionChange(id, e.target.checked)}
          disabled={disabled}
          className="row-checkbox"
        />
      </td>
      {children}
    </tr>
  )
}

// Common bulk actions
export const CommonBulkActions = {
  delete: (onDelete: (ids: string[]) => Promise<void>): BulkAction => ({
    id: 'delete',
    label: 'Löschen',
    icon: <Trash2 className="admin-btn-icon" />,
    action: onDelete,
    variant: 'danger',
    requireConfirmation: true,
    confirmationMessage: 'Möchten Sie die ausgewählten Elemente wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
  }),

  export: (onExport: (ids: string[]) => Promise<void>): BulkAction => ({
    id: 'export',
    label: 'Exportieren',
    icon: <Download className="admin-btn-icon" />,
    action: onExport,
    variant: 'secondary'
  }),

  edit: (onEdit: (ids: string[]) => void): BulkAction => ({
    id: 'edit',
    label: 'Bearbeiten',
    icon: <Edit3 className="admin-btn-icon" />,
    action: onEdit,
    variant: 'primary'
  })
}