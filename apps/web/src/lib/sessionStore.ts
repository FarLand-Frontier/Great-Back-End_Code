export interface Session {
  id: string;
  title: string;
  createdAt: Date;
}

// In-memory store (to be replaced with Prisma later)
const sessions: Session[] = [];

function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export async function createSession(data: { title: string }): Promise<Session> {
  const session: Session = {
    id: generateId(),
    title: data.title,
    createdAt: new Date(),
  };
  sessions.push(session);
  return session;
}

export async function listSessions(): Promise<Session[]> {
  // Return sorted by createdAt descending (most recent first)
  return [...sessions].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function resetStore(): void {
  sessions.length = 0;
}
