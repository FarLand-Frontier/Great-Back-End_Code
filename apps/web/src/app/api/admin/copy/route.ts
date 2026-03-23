// Admin Copy GET API Route
// GET /api/admin/copy

import { NextResponse } from 'next/server'
import { getCopy } from '../../../../lib/copyStore'

export async function GET() {
  try {
    const copy = getCopy()
    return NextResponse.json(copy)
  } catch (error) {
    console.error('Error loading copy:', error)
    return NextResponse.json(
      { error: 'Failed to load copy' },
      { status: 500 }
    )
  }
}
