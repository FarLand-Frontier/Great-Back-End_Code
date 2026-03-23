/**
 * Instance Policy - Enforces logical isolation between partner instances
 * 
 * This module ensures that:
 * - Partner roles cannot access owner-only endpoints
 * - Lighthouse instances cannot access other lighthouse instances
 * - Proper access control is enforced based on role and resource
 */

export enum PartnerRole {
  OWNER = 'owner',
  PARTNER = 'partner',
  LIGHTHOUSE = 'lighthouse',
}

export enum LighthouseInstance {
  LIGHTHOUSE_A = 'lighthouse-a',
  LIGHTHOUSE_B = 'lighthouse-b',
}

export interface AccessRequest {
  role: PartnerRole;
  resource: string;
  instanceId?: LighthouseInstance;
}

export interface AccessResult {
  allowed: boolean;
  reason: string;
  policyVersion: string;
}

/**
 * InstancePolicy enforces logical isolation between different partner instances
 */
export class InstancePolicy {
  private policyVersion = '1.0';

  /**
   * Check if the given access request is allowed based on the isolation policy
   */
  canAccess(request: AccessRequest): AccessResult {
    const { role, resource, instanceId } = request;

    // Parse the resource to determine its type
    const resourceParts = resource.split(':');
    const resourceType = resourceParts[0]; // 'owner', 'lighthouse'
    const resourceTarget = resourceParts[1]; // specific target
    const resourceAction = resourceParts[2]; // 'chat', 'send', etc.

    // Owner role has full access
    if (role === PartnerRole.OWNER) {
      return {
        allowed: true,
        reason: 'Owner has full access to all resources',
        policyVersion: this.policyVersion,
      };
    }

    // Partner role isolation: cannot access owner resources
    if (role === PartnerRole.PARTNER) {
      if (resourceType === 'owner') {
        return {
          allowed: false,
          reason: 'Partner role cannot access owner resources - logical isolation enforced',
          policyVersion: this.policyVersion,
        };
      }
      
      // Partner can access lighthouse resources
      if (resourceType === 'lighthouse') {
        return {
          allowed: true,
          reason: 'Partner can access lighthouse resources',
          policyVersion: this.policyVersion,
        };
      }
    }

    // Lighthouse instance isolation
    if (role === PartnerRole.LIGHTHOUSE) {
      // If accessing another lighthouse instance's resources, deny
      if (resourceType === 'lighthouse' && resourceTarget !== 'self') {
        // If instanceId is provided, verify it's not accessing another instance
        if (instanceId && resourceTarget !== instanceId && resourceTarget !== 'self') {
          return {
            allowed: false,
            reason: `Lighthouse ${instanceId} cannot access lighthouse ${resourceTarget} - cross-instance isolation enforced`,
            policyVersion: this.policyVersion,
          };
        }
        
        // Without instanceId, still deny cross-instance access
        if (!instanceId && resourceTarget !== 'self') {
          return {
            allowed: false,
            reason: 'Cross-lighthouse instance access denied - logical isolation enforced',
            policyVersion: this.policyVersion,
          };
        }
      }

      // Lighthouse can access its own resources (self)
      if (resourceType === 'lighthouse' && (resourceTarget === 'self' || resourceTarget === instanceId)) {
        return {
          allowed: true,
          reason: 'Lighthouse can access its own resources',
          policyVersion: this.policyVersion,
        };
      }
    }

    // Default deny
    return {
      allowed: false,
      reason: 'Access denied by policy',
      policyVersion: this.policyVersion,
    };
  }
}
