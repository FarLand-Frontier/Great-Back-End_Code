import { NextResponse } from 'next/server'
import { getDashboardSummary } from '../../../lib/dashboardSummary'

/**
 * GET /api/dashboard/summary
 * Returns dashboard summary data including token usage, task status, and health
 */
export async function GET() {
  const summary = getDashboardSummary()
  
  return NextResponse.json(summary)
}