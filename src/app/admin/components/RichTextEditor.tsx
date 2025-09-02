'use client'

import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [content, setContent] = useState(value)

  useEffect(() => {
    setContent(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setContent(newValue)
    onChange(newValue)
  }

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    const newText = 
      content.substring(0, start) + 
      before + selectedText + after +
      content.substring(end)
    
    handleChange(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  const renderPreview = () => {
    // Basic Markdown to HTML conversion
    const html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      // Lists
      .replace(/^\* (.+)$/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;" />')
    
    return `<p>${html}</p>`
  }

  return (
    <div className="admin-rich-editor">
      <div className="admin-editor-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'write' ? 'admin-btn-primary' : ''}`}
          onClick={() => setActiveTab('write')}
        >
          ✏️ Schreiben
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === 'preview' ? 'admin-btn-primary' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Vorschau
        </button>
      </div>

      {activeTab === 'write' && (
        <>
          <div className="admin-editor-toolbar" style={{ 
            display: 'flex', 
            gap: '5px', 
            marginBottom: '10px',
            flexWrap: 'wrap',
            padding: '10px',
            background: '#262626',
            borderRadius: '4px',
            border: '1px solid #404040'
          }}>
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="admin-btn"
              title="Fett"
              style={{ padding: '5px 10px' }}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="admin-btn"
              title="Kursiv"
              style={{ padding: '5px 10px' }}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('# ')}
              className="admin-btn"
              title="Überschrift 1"
              style={{ padding: '5px 10px' }}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('## ')}
              className="admin-btn"
              title="Überschrift 2"
              style={{ padding: '5px 10px' }}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('### ')}
              className="admin-btn"
              title="Überschrift 3"
              style={{ padding: '5px 10px' }}
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('* ')}
              className="admin-btn"
              title="Liste"
              style={{ padding: '5px 10px' }}
            >
              • Liste
            </button>
            <button
              type="button"
              onClick={() => {
                const url = prompt('URL eingeben:')
                const text = prompt('Link-Text eingeben:')
                if (url && text) insertMarkdown(`[${text}](${url})`)
              }}
              className="admin-btn"
              title="Link"
              style={{ padding: '5px 10px' }}
            >
              🔗 Link
            </button>
            <button
              type="button"
              onClick={() => {
                const url = prompt('Bild-URL eingeben:')
                const alt = prompt('Alternativtext:')
                if (url) insertMarkdown(`![${alt || ''}](${url})`)
              }}
              className="admin-btn"
              title="Bild"
              style={{ padding: '5px 10px' }}
            >
              🖼️ Bild
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('---')}
              className="admin-btn"
              title="Trennlinie"
              style={{ padding: '5px 10px' }}
            >
              ─ Linie
            </button>
          </div>

          <textarea
            id="content-editor"
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder || "Artikel-Inhalt (Markdown unterstützt)"}
            style={{ 
              minHeight: '400px',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          />

          <small style={{ color: '#a0a0a0', marginTop: '5px', display: 'block' }}>
            Unterstützt Markdown: **fett**, *kursiv*, # Überschrift, [Link](url), ![Bild](url)
          </small>
        </>
      )}

      {activeTab === 'preview' && (
        <div 
          className="admin-preview-content"
          style={{
            minHeight: '400px',
            padding: '20px',
            background: '#1a1a1a',
            border: '1px solid #404040',
            borderRadius: '4px',
            lineHeight: '1.6',
            color: '#e5e5e5'
          }}
          dangerouslySetInnerHTML={{ __html: renderPreview() }}
        />
      )}
    </div>
  )
}