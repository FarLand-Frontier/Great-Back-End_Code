import { NextResponse } from 'next/server';
import { listSessions } from '../../../../lib/sessionStore';

export async function GET() {
  try {
    const sessions = await listSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list sessions' },
      { status: 500 }
    );
  }
}
