import { NextResponse } from 'next/server';
import { createSession } from '../../../../lib/sessionStore';

export async function POST() {
  try {
    const session = await createSession({ title: 'New Conversation' });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
