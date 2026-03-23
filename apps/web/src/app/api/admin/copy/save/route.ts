// Admin Copy Save API Route
// POST /api/admin/copy/save

import { NextRequest, NextResponse } from 'next/server'
import { saveCopy, getCopy, type UICopyContract } from '../../../../../lib/copyStore'

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()

    // Validate body is a proper UICopyContract
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const copy = body as UICopyContract
    const result = await saveCopy(copy)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      copy: result.copy
    })
  } catch (error) {
    console.error('Error saving copy:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
