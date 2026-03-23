import { NextResponse } from 'next/server';
import { saveSubscription, validateSubscription } from '../../../../lib/pushStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!validateSubscription(body)) {
      return NextResponse.json(
        { error: 'Invalid subscription: endpoint and keys (p256dh, auth) are required' },
        { status: 400 }
      );
    }
    
    const subscription = await saveSubscription(body);
    
    return NextResponse.json(
      { success: true, subscription },
      { status: 201 }
    );
  } catch (error) {
    console.error('[push/subscribe] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}
