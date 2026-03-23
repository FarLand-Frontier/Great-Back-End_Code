import Link from 'next/link'
import { getHomeCopy } from '../lib/uiCopy'

export default function HomePage() {
  const { title, placeholder, quickPrompts } = getHomeCopy()

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ marginBottom: 16 }}>{title}</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder={placeholder}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            border: '1px solid #d0d7de',
            padding: '0 12px'
          }}
        />
        <button
          type="button"
          style={{
            height: 40,
            padding: '0 16px',
            borderRadius: 10,
            border: '1px solid #111827',
            background: '#111827',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 16 }}>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            style={{
              textAlign: 'left',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid #d0d7de',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            {prompt.text}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button type="button" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7de', cursor: 'pointer' }}>
            Open Dashboard
          </button>
        </Link>
        <Link href="/admin/copy" style={{ textDecoration: 'none' }}>
          <button type="button" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7de', cursor: 'pointer' }}>
            Edit Copy
          </button>
        </Link>
      </div>
    </main>
  )
}
