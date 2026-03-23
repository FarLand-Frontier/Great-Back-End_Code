import Link from 'next/link'
import { getDashboardSummary } from '../../lib/dashboardSummary'

export default function DashboardPage() {
  const summary = getDashboardSummary()

  return (
    <main style={{ maxWidth: 1000, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button type="button" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7de', cursor: 'pointer' }}>
            Back to Chat
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        <section style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 16, background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Token Usage</h2>
          <p style={{ fontSize: 28, margin: '8px 0' }}>{summary.tokenUsage.used.toLocaleString()}</p>
          <p style={{ color: '#6b7280', margin: 0 }}>used of {summary.tokenUsage.limit.toLocaleString()}</p>
        </section>

        <section style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 16, background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Task Status</h2>
          <p style={{ margin: '6px 0' }}>Active: {summary.taskStatus.active}</p>
          <p style={{ margin: '6px 0' }}>Completed: {summary.taskStatus.completed}</p>
          <p style={{ margin: '6px 0' }}>Failed: {summary.taskStatus.failed}</p>
        </section>

        <section style={{ border: '1px solid #d0d7de', borderRadius: 12, padding: 16, background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Health</h2>
          <p style={{ fontSize: 22, margin: '8px 0', color: summary.health.status === 'healthy' ? '#16a34a' : '#dc2626' }}>
            {summary.health.status}
          </p>
          <p style={{ color: '#6b7280', margin: 0 }}>Response: {summary.health.responseTime}ms</p>
        </section>
      </div>
    </main>
  )
}
