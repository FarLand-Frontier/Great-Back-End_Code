// OpenClaw Gateway Client - server-side proxy to OpenClaw gateway
// Supports partner-safe endpoint selection (owner | lighthouse)

export type EndpointType = 'owner' | 'lighthouse';

export interface ChatMessageParams {
  message: string;
  endpoint: EndpointType;
}

export interface ChatResponse {
  message: {
    content: string;
  };
  error?: string;
}

// Environment variables for gateway configuration
const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3000';
const LIGHTHOUSE_ENDPOINT_KEY = process.env.LIGHTHOUSE_ENDPOINT_KEY || 'lighthouse-key';
const OWNER_ENDPOINT_KEY = process.env.OWNER_ENDPOINT_KEY || 'owner-key';

function getEndpointUrl(endpoint: EndpointType): string {
  return `${GATEWAY_URL}/api/chat/${endpoint}`;
}

function getEndpointKey(endpoint: EndpointType): string {
  return endpoint === 'lighthouse' ? LIGHTHOUSE_ENDPOINT_KEY : OWNER_ENDPOINT_KEY;
}

export async function sendChatMessage(params: ChatMessageParams): Promise<ChatResponse> {
  const { message, endpoint = 'lighthouse' } = params;
  
  const url = getEndpointUrl(endpoint);
  const endpointKey = getEndpointKey(endpoint);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      endpointKey,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Gateway error: ${response.status}`);
  }

  return response.json();
}
