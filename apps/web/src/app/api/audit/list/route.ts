import { NextRequest, NextResponse } from 'next/server';
import { listAuditLogs } from '../../../../lib/audit';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action') || undefined;
  const target = searchParams.get('target') || undefined;

  try {
    const logs = await listAuditLogs({ action, target });
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Failed to list audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit logs' },
      { status: 500 }
    );
  }
}
