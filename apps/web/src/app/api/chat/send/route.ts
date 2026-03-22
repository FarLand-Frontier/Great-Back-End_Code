import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage, EndpointType } from '../../../../lib/openclawClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, endpoint = 'lighthouse' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate endpoint type
    const validEndpoints: EndpointType[] = ['owner', 'lighthouse'];
    if (!validEndpoints.includes(endpoint)) {
      return NextResponse.json(
        { error: `Invalid endpoint. Must be one of: ${validEndpoints.join(', ')}` },
        { status: 400 }
      );
    }

    const response = await sendChatMessage({ message, endpoint });
    
    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
