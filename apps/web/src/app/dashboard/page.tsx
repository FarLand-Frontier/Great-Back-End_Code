import { getDashboardSummary } from '../../lib/dashboardSummary'

export default function DashboardPage() {
  const summary = getDashboardSummary()

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        {/* Token Usage Card */}
        <div className="card token-usage-card">
          <h2>Token Usage</h2>
          <div className="card-content">
            <p className="stat-value">{summary.tokenUsage.used.toLocaleString()}</p>
            <p className="stat-label">used of {summary.tokenUsage.limit.toLocaleString()}</p>
          </div>
        </div>

        {/* Task Status Card */}
        <div className="card task-status-card">
          <h2>Task Status</h2>
          <div className="card-content">
            <div className="stat-row">
              <span className="stat-label">Active:</span>
              <span className="stat-value">{summary.taskStatus.active}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Completed:</span>
              <span className="stat-value">{summary.taskStatus.completed}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Failed:</span>
              <span className="stat-value">{summary.taskStatus.failed}</span>
            </div>
          </div>
        </div>

        {/* Health Card */}
        <div className="card health-card">
          <h2>Health</h2>
          <div className="card-content">
            <p className={`stat-value status-${summary.health.status}`}>
              {summary.health.status}
            </p>
            <p className="stat-label">Response: {summary.health.responseTime}ms</p>
          </div>
        </div>
      </div>
    </main>
  )
}