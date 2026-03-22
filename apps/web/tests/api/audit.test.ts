import { describe, it, expect, beforeEach } from 'vitest';
import { logAuditEvent, listAuditLogs, resetAuditStore, AuditEvent } from '../../src/lib/audit';

describe('Audit API', () => {
  beforeEach(() => {
    resetAuditStore();
  });

  describe('logAuditEvent', () => {
    it('should log an audit event with actor, action, and timestamp', async () => {
      const event = await logAuditEvent({
        actor: 'user:admin',
        action: 'config:update',
        target: 'ui-copy',
        diff: { before: { title: 'Old' }, after: { title: 'New' } },
      });

      expect(event).toHaveProperty('id');
      expect(event.actor).toBe('user:admin');
      expect(event.action).toBe('config:update');
      expect(event.target).toBe('ui-copy');
      expect(event.diff).toEqual({ before: { title: 'Old' }, after: { title: 'New' } });
      expect(event.timestamp).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for each event', async () => {
      const event1 = await logAuditEvent({
        actor: 'user:admin',
        action: 'config:update',
        target: 'ui-copy',
      });
      const event2 = await logAuditEvent({
        actor: 'user:admin',
        action: 'config:update',
        target: 'ui-copy',
      });

      expect(event1.id).not.toBe(event2.id);
    });
  });

  describe('listAuditLogs', () => {
    it('should return audit logs sorted by timestamp descending (most recent first)', async () => {
      await logAuditEvent({
        actor: 'user:admin',
        action: 'config:update',
        target: 'ui-copy',
        diff: { before: { v: 1 }, after: { v: 2 } },
      });
      await new Promise(r => setTimeout(r, 10));
      await logAuditEvent({
        actor: 'user:editor',
        action: 'config:create',
        target: 'dashboard',
      });
      await new Promise(r => setTimeout(r, 10));
      await logAuditEvent({
        actor: 'user:viewer',
        action: 'config:read',
        target: 'settings',
      });

      const logs = await listAuditLogs();

      expect(logs).toHaveLength(3);
      expect(logs[0].action).toBe('config:read'); // Most recent
      expect(logs[1].action).toBe('config:create');
      expect(logs[2].action).toBe('config:update'); // Oldest
    });

    it('should return empty array when no audit logs exist', async () => {
      const logs = await listAuditLogs();
      expect(logs).toEqual([]);
    });

    it('should filter by action type when provided', async () => {
      await logAuditEvent({
        actor: 'user:admin',
        action: 'config:update',
        target: 'ui-copy',
      });
      await logAuditEvent({
        actor: 'user:editor',
        action: 'config:create',
        target: 'dashboard',
      });
      await logAuditEvent({
        actor: 'user:viewer',
        action: 'config:update',
        target: 'settings',
      });

      const updateLogs = await listAuditLogs({ action: 'config:update' });

      expect(updateLogs).toHaveLength(2);
      expect(updateLogs.every(log => log.action === 'config:update')).toBe(true);
    });

    it('should filter by target when provided', async () => {
      await logAuditEvent({
        actor: 'user:admin',
        action: 'config:update',
        target: 'ui-copy',
      });
      await logAuditEvent({
        actor: 'user:editor',
        action: 'config:create',
        target: 'ui-copy',
      });
      await logAuditEvent({
        actor: 'user:viewer',
        action: 'config:read',
        target: 'settings',
      });

      const uiCopyLogs = await listAuditLogs({ target: 'ui-copy' });

      expect(uiCopyLogs).toHaveLength(2);
      expect(uiCopyLogs.every(log => log.target === 'ui-copy')).toBe(true);
    });
  });
});
