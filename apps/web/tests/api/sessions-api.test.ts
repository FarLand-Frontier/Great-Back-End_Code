import { describe, it, expect, beforeEach } from 'vitest';
import { createSession, listSessions, resetStore } from '../../src/lib/sessionStore';

describe('Sessions API', () => {
  beforeEach(() => {
    // Reset store between tests
    resetStore();
  });

  describe('createSession', () => {
    it('should create a new session and return id', async () => {
      const session = await createSession({ title: 'New Chat' });
      expect(session).toHaveProperty('id');
      expect(session.id).toBeDefined();
      expect(typeof session.id).toBe('string');
    });

    it('should create session with correct title', async () => {
      const session = await createSession({ title: 'Test Session' });
      expect(session.title).toBe('Test Session');
    });

    it('should set createdAt timestamp', async () => {
      const before = new Date();
      const session = await createSession({ title: 'Test' });
      const after = new Date();
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('listSessions', () => {
    it('should return sessions sorted by createdAt descending (most recent first)', async () => {
      await createSession({ title: 'First' });
      await new Promise(r => setTimeout(r, 10));
      await createSession({ title: 'Second' });
      await new Promise(r => setTimeout(r, 10));
      await createSession({ title: 'Third' });

      const sessions = await listSessions();
      expect(sessions).toHaveLength(3);
      expect(sessions[0].title).toBe('Third');
      expect(sessions[1].title).toBe('Second');
      expect(sessions[2].title).toBe('First');
    });

    it('should return empty array when no sessions exist', async () => {
      const sessions = await listSessions();
      expect(sessions).toEqual([]);
    });
  });
});
