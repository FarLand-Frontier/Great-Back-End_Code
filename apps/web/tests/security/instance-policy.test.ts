import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

describe('Instance Policy - Partner Isolation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('InstancePolicy', () => {
    it('should enforce that partner role cannot access owner endpoint', async () => {
      const { InstancePolicy, PartnerRole } = await import('../../src/lib/instancePolicy');
      
      // Partner trying to access owner-only resource should be denied
      const policy = new InstancePolicy();
      const result = policy.canAccess({
        role: PartnerRole.PARTNER,
        resource: 'owner:chat:send'
      });
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('isolation');
    });

    it('should allow partner role to access lighthouse endpoint', async () => {
      const { InstancePolicy, PartnerRole } = await import('../../src/lib/instancePolicy');
      
      const policy = new InstancePolicy();
      const result = policy.canAccess({
        role: PartnerRole.PARTNER,
        resource: 'lighthouse:chat:send'
      });
      
      expect(result.allowed).toBe(true);
    });

    it('should allow owner role to access both owner and lighthouse endpoints', async () => {
      const { InstancePolicy, PartnerRole } = await import('../../src/lib/instancePolicy');
      
      const policy = new InstancePolicy();
      
      // Owner can access owner
      const ownerResult = policy.canAccess({
        role: PartnerRole.OWNER,
        resource: 'owner:chat:send'
      });
      expect(ownerResult.allowed).toBe(true);
      
      // Owner can also access lighthouse
      const lighthouseResult = policy.canAccess({
        role: PartnerRole.OWNER,
        resource: 'lighthouse:chat:send'
      });
      expect(lighthouseResult.allowed).toBe(true);
    });

    it('should enforce logical isolation between lighthouse instances', async () => {
      const { InstancePolicy, PartnerRole, LighthouseInstance } = await import('../../src/lib/instancePolicy');
      
      const policy = new InstancePolicy();
      
      // Lighthouse A should not access Lighthouse B's resources
      const result = policy.canAccess({
        role: PartnerRole.LIGHTHOUSE,
        resource: 'lighthouse:other-instance:chat:send',
        instanceId: LighthouseInstance.LIGHTHOUSE_A
      });
      
      expect(result.allowed).toBe(false);
    });

    it('should allow lighthouse to access its own resources', async () => {
      const { InstancePolicy, PartnerRole, LighthouseInstance } = await import('../../src/lib/instancePolicy');
      
      const policy = new InstancePolicy();
      
      const result = policy.canAccess({
        role: PartnerRole.LIGHTHOUSE,
        resource: 'lighthouse:self:chat:send',
        instanceId: LighthouseInstance.LIGHTHOUSE_A
      });
      
      expect(result.allowed).toBe(true);
    });

    it('should return structured access result with policy metadata', async () => {
      const { InstancePolicy, PartnerRole } = await import('../../src/lib/instancePolicy');
      
      const policy = new InstancePolicy();
      const result = policy.canAccess({
        role: PartnerRole.PARTNER,
        resource: 'owner:chat:send'
      });
      
      expect(result).toHaveProperty('allowed');
      expect(result).toHaveProperty('reason');
      expect(result).toHaveProperty('policyVersion');
      expect(result.policyVersion).toBe('1.0');
    });
  });
});
