export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  diff?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  timestamp: Date;
}

export interface AuditFilter {
  action?: string;
  target?: string;
}

// In-memory audit store (to be replaced with Prisma/Postgres later)
const auditLogs: AuditEvent[] = [];

function generateId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function logAuditEvent(data: {
  actor: string;
  action: string;
  target: string;
  diff?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
}): Promise<AuditEvent> {
  const event: AuditEvent = {
    id: generateId(),
    actor: data.actor,
    action: data.action,
    target: data.target,
    diff: data.diff,
    timestamp: new Date(),
  };
  auditLogs.push(event);
  return event;
}

export async function listAuditLogs(filter?: AuditFilter): Promise<AuditEvent[]> {
  let results = [...auditLogs];

  if (filter?.action) {
    results = results.filter(log => log.action === filter.action);
  }

  if (filter?.target) {
    results = results.filter(log => log.target === filter.target);
  }

  // Return sorted by timestamp descending (most recent first)
  return results.sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
}

export function resetAuditStore(): void {
  auditLogs.length = 0;
}
