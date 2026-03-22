// Admin Copy Editor Page
// Allows admins to edit UI copy and save back to data repo

'use client'

import { useState, useEffect } from 'react'

interface QuickPrompt {
  id: string
  text: string
}

interface HomeCopy {
  title: string
  placeholder: string
  quickPrompts: QuickPrompt[]
}

interface CopyData {
  home: HomeCopy
}

export default function AdminCopyPage() {
  const [copy, setCopy] = useState<CopyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Load current copy on mount
  useEffect(() => {
    loadCopy()
  }, [])

  async function loadCopy() {
    try {
      const res = await fetch('/api/admin/copy')
      if (res.ok) {
        const data = await res.json()
        setCopy(data)
      }
    } catch (error) {
      console.error('Failed to load copy:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!copy) return
    
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/copy/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy)
      })

      const result = await res.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Copy saved and exported successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save copy' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save copy' })
    } finally {
      setSaving(false)
    }
  }

  function updateTitle(value: string) {
    if (!copy) return
    setCopy({ ...copy, home: { ...copy.home, title: value } })
  }

  function updatePlaceholder(value: string) {
    if (!copy) return
    setCopy({ ...copy, home: { ...copy.home, placeholder: value } })
  }

  function updatePrompt(index: number, value: string) {
    if (!copy) return
    const newPrompts = [...copy.home.quickPrompts]
    newPrompts[index] = { ...newPrompts[index], text: value }
    setCopy({ ...copy, home: { ...copy.home, quickPrompts: newPrompts } })
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Admin - Copy Editor</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!copy) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Admin - Copy Editor</h1>
        <p>Failed to load copy data.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin - Copy Editor</h1>
      <p style={{ marginBottom: '2rem' }}>
        Edit UI copy text. Changes will be saved and exported to the data repository.
      </p>

      {message && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24'
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2>Home Screen</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Title
          </label>
          <input
            type="text"
            value={copy.home.title}
            onChange={(e) => updateTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Placeholder
          </label>
          <input
            type="text"
            value={copy.home.placeholder}
            onChange={(e) => updatePlaceholder(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3>Quick Prompts</h3>
          {copy.home.quickPrompts.map((prompt, index) => (
            <div key={prompt.id} style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                Prompt {index + 1}
              </label>
              <input
                type="text"
                value={prompt.text}
                onChange={(e) => updatePrompt(index, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: saving ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: saving ? 'not-allowed' : 'pointer'
        }}
      >
        {saving ? 'Saving...' : 'Save & Export'}
      </button>
    </div>
  )
}
