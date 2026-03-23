// Push subscription store (in-memory for MVP)
// To be replaced with database storage later

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt?: Date;
}

// In-memory store
const subscriptions: PushSubscription[] = [];

function generateId(): string {
  return `push_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function validateSubscription(sub: unknown): sub is PushSubscription {
  if (!sub || typeof sub !== 'object') return false;
  const s = sub as Record<string, unknown>;
  if (typeof s.endpoint !== 'string' || !s.endpoint) return false;
  if (!s.keys || typeof s.keys !== 'object') return false;
  const keys = s.keys as Record<string, unknown>;
  if (typeof keys.p256dh !== 'string' || !keys.p256dh) return false;
  if (typeof keys.auth !== 'string' || !keys.auth) return false;
  return true;
}

export async function saveSubscription(subscription: PushSubscription): Promise<PushSubscription> {
  if (!validateSubscription(subscription)) {
    throw new Error('Invalid subscription: endpoint and keys are required');
  }
  
  const sub: PushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    },
    createdAt: new Date()
  };
  
  subscriptions.push(sub);
  return sub;
}

export async function getSubscriptions(): Promise<PushSubscription[]> {
  return [...subscriptions];
}

export function clearSubscriptions(): void {
  subscriptions.length = 0;
}

export interface PushResult {
  sent: number;
  errors: string[];
}

export async function triggerTestPush(): Promise<PushResult> {
  const result: PushResult = {
    sent: 0,
    errors: []
  };
  
  const subs = await getSubscriptions();
  
  for (const sub of subs) {
    // In a real implementation, this would send a push notification
    // using the web-push library with VAPID keys
    // For baseline, we just simulate success
    try {
      // Simulate sending push notification
      console.log(`[push] Would send to: ${sub.endpoint}`);
      result.sent++;
    } catch (error) {
      result.errors.push(`Failed to send to ${sub.endpoint}: ${error}`);
    }
  }
  
  return result;
}
