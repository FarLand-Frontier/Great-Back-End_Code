import { NextResponse } from 'next/server';
import { triggerTestPush } from '../../../lib/pushStore';

export async function POST() {
  try {
    const result = await triggerTestPush();
    
    return NextResponse.json({
      success: true,
      sent: result.sent,
      errors: result.errors
    });
  } catch (error) {
    console.error('[push/test] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send test push' },
      { status: 500 }
    );
  }
}
