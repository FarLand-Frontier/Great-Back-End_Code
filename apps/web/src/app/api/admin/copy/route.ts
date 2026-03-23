// Admin Copy GET API Route
// GET /api/admin/copy

import { NextRequest, NextResponse } from 'next/server'
import { getCopy } from '../../../../lib/copyStore'
import { checkAccess } from '../../../../lib/auth/cloudflareAccess'

export async function GET(request: NextRequest) {
  try {
    const access = checkAccess(request.headers)
    if (access.role !== 'developer') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

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
