'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '../AuthGuard'
import { getErrorMessage } from '../types/error.types'

interface Contact {
  id: string
  name: string
  role: string
  department: string | null
  email: string | null
  phone: string | null
  order_position: number
  is_active: boolean | null
}

export default function ContactsManager({ initialContacts }: { initialContacts: Contact[] }) {
  return (
    <AuthGuard>
      <ContactsManagerContent initialContacts={initialContacts} />
    </AuthGuard>
  )
}

function ContactsManagerContent({ initialContacts }: { initialContacts: Contact[] }) {
  const [contacts, setContacts] = useState(initialContacts)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Vorstand',
    email: '',
    phone: '',
    order_position: contacts.length + 1,
    is_active: true
  })

  const departments = ['Vorstand', 'Sportlich', 'Jugend', 'Verwaltung', 'Sonstige']

  const filteredContacts = contacts
    .filter(c => filterDepartment === 'all' || c.department === filterDepartment)
    .sort((a, b) => a.order_position - b.order_position)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingContact) {
        const { error } = await supabase
          .from('contacts')
          .update(formData)
          .eq('id', editingContact.id)
        
        if (error) throw error
        setMessage('Kontakt aktualisiert!')
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert([formData])
        
        if (error) throw error
        setMessage('Kontakt hinzugefügt!')
      }
      
      router.refresh()
      setShowForm(false)
      setEditingContact(null)
      resetForm()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      role: contact.role,
      department: contact.department || 'Vorstand',
      email: contact.email || '',
      phone: contact.phone || '',
      order_position: contact.order_position,
      is_active: contact.is_active !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Kontakt wirklich löschen?')) return
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setMessage('Kontakt gelöscht')
      setContacts(contacts.filter(c => c.id !== id))
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const moveContact = async (contact: Contact, direction: 'up' | 'down') => {
    const currentIndex = filteredContacts.findIndex(c => c.id === contact.id)
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === filteredContacts.length - 1)) {
      return
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const targetContact = filteredContacts[targetIndex]

    try {
      await supabase
        .from('contacts')
        .update({ order_position: targetContact.order_position })
        .eq('id', contact.id)

      await supabase
        .from('contacts')
        .update({ order_position: contact.order_position })
        .eq('id', targetContact.id)

      router.refresh()
    } catch (error) {
      console.error('Fehler:', error)
      setMessage('Fehler: ' + getErrorMessage(error))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      department: 'Vorstand',
      email: '',
      phone: '',
      order_position: contacts.length + 1,
      is_active: true
    })
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Kontakte verwalten</h1>
        <Link href="/admin">← Zurück zum Dashboard</Link>
      </div>

      {message && (
        <div className={`admin-alert ${message.includes('Fehler') ? 'admin-alert-error' : 'admin-alert-success'}`}>
          {message}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-actions" style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
          <div className="admin-actions">
            <button 
              onClick={() => { setShowForm(true); setEditingContact(null); resetForm() }}
              className="admin-btn admin-btn-success"
            >
              + Neuer Kontakt
            </button>
            
            <select 
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="all">Alle Abteilungen</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            {filteredContacts.length} Kontakte
          </div>
        </div>

        {showForm && (
          <div className="admin-card admin-form-card">
            <h3>{editingContact ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="z.B. Max Mustermann"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Funktion *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="z.B. 1. Vorsitzender"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Abteilung</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>E-Mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@beispiel.de"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0123 456789"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Position</label>
                  <input
                    type="number"
                    value={formData.order_position}
                    onChange={(e) => setFormData({ ...formData, order_position: parseInt(e.target.value) || 0 })}
                    min="1"
                  />
                </div>

                <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={{ width: 'auto', marginRight: '10px' }}
                  />
                  <label htmlFor="active" style={{ margin: 0 }}>Aktiv</label>
                </div>
              </div>

              <div className="admin-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingContact ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditingContact(null); resetForm() }}
                  className="admin-btn"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Funktion</th>
              <th>Abteilung</th>
              <th>E-Mail</th>
              <th>Telefon</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => (
              <tr key={contact.id} style={{ opacity: contact.is_active ? 1 : 0.6 }}>
                <td>
                  <div className="admin-actions">
                    <button 
                      onClick={() => moveContact(contact, 'up')}
                      disabled={index === 0}
                      style={{ padding: '2px 6px', fontSize: '16px' }}
                      className="admin-btn"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveContact(contact, 'down')}
                      disabled={index === filteredContacts.length - 1}
                      style={{ padding: '2px 6px', fontSize: '16px' }}
                      className="admin-btn"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td><strong>{contact.name}</strong></td>
                <td>{contact.role}</td>
                <td>{contact.department || '-'}</td>
                <td>
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} style={{ color: '#007bff' }}>
                      {contact.email}
                    </a>
                  ) : '-'}
                </td>
                <td>{contact.phone || '-'}</td>
                <td>{contact.is_active ? '✓' : '✗'}</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      onClick={() => handleEdit(contact)}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Bearbeiten
                    </button>
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}