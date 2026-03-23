// Dashboard summary module - provides data for dashboard cards
// Returns fallback state when no real data is available

export interface TokenUsage {
  used: number
  limit: number
}

export interface TaskStatus {
  active: number
  completed: number
  failed: number
}

export interface Health {
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number // milliseconds
}

export interface DashboardSummary {
  tokenUsage: TokenUsage
  taskStatus: TaskStatus
  health: Health
}

// Fallback data when no real data is available
const fallbackSummary: DashboardSummary = {
  tokenUsage: {
    used: 0,
    limit: 100000
  },
  taskStatus: {
    active: 0,
    completed: 0,
    failed: 0
  },
  health: {
    status: 'healthy',
    responseTime: 0
  }
}

/**
 * Get dashboard summary data
 * Returns fallback state for MVP - to be connected to real data sources later
 */
export function getDashboardSummary(): DashboardSummary {
  return fallbackSummary
}

