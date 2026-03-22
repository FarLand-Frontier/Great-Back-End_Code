import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the exportToDataRepo module before importing the route
vi.mock('../../src/lib/exportToDataRepo', () => ({
  exportCopyToDataRepo: vi.fn().mockResolvedValue({ success: true })
}));

describe('Copy Save API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/admin/copy/save', () => {
    it('should save copy and return success', async () => {
      // Import after mocks are set up
      const { saveCopy } = await import('../../src/lib/copyStore');
      
      const copy = {
        home: {
          title: 'Updated Title',
          placeholder: 'Updated placeholder...',
          quickPrompts: [
            { id: 'quick-1', text: 'New prompt 1' },
            { id: 'quick-2', text: 'New prompt 2' },
            { id: 'quick-3', text: 'New prompt 3' }
          ]
        }
      };

      const result = await saveCopy(copy);
      
      expect(result.success).toBe(true);
      expect(result.copy).toEqual(copy);
    });

    it('should validate copy matches ui-copy.json schema', async () => {
      const { saveCopy } = await import('../../src/lib/copyStore');
      
      // Valid copy
      const validCopy = {
        home: {
          title: 'Test',
          placeholder: 'Placeholder',
          quickPrompts: [
            { id: 'q1', text: 'Text' }
          ]
        }
      };

      const result = await saveCopy(validCopy);
      expect(result.success).toBe(true);
    });

    it('should emit export payload matching schema', async () => {
      const { saveCopy } = await import('../../src/lib/copyStore');
      const { exportCopyToDataRepo } = await import('../../src/lib/exportToDataRepo');
      
      const copy = {
        home: {
          title: 'Test Title',
          placeholder: 'Test placeholder',
          quickPrompts: [
            { id: 'test-1', text: 'Test prompt' }
          ]
        }
      };

      await saveCopy(copy);
      
      // Verify export was called
      expect(exportCopyToDataRepo).toHaveBeenCalledWith(copy);
    });
  });

  describe('GET /api/admin/copy', () => {
    it('should load current copy', async () => {
      const { getCopy } = await import('../../src/lib/copyStore');
      
      const copy = await getCopy();
      
      expect(copy).toHaveProperty('home');
      expect(copy.home).toHaveProperty('title');
      expect(copy.home).toHaveProperty('placeholder');
      expect(copy.home).toHaveProperty('quickPrompts');
    });
  });
});
