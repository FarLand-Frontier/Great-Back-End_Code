import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

describe('Chat Send API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/chat/send', () => {
    it('should forward message to lighthouse endpoint by default', async () => {
      const mockResponse = { 
        ok: true, 
        json: async () => ({ message: { content: 'Hello from gateway' } }) 
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      // Simulate the API call by importing and calling the handler logic
      const { sendChatMessage } = await import('../../src/lib/openclawClient');
      
      const result = await sendChatMessage({ 
        message: 'Hello', 
        endpoint: 'lighthouse' 
      });

      expect(global.fetch).toHaveBeenCalled();
      
      // Verify the call was made to lighthouse endpoint
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const url = fetchCall[0] as string;
      expect(url).toContain('lighthouse');
    });

    it('should forward message to owner endpoint when specified', async () => {
      const mockResponse = { 
        ok: true, 
        json: async () => ({ message: { content: 'Owner response' } }) 
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { sendChatMessage } = await import('../../src/lib/openclawClient');
      
      const result = await sendChatMessage({ 
        message: 'Hello owner', 
        endpoint: 'owner' 
      });

      expect(global.fetch).toHaveBeenCalled();
      
      // Verify the call was made to owner endpoint
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const url = fetchCall[0] as string;
      expect(url).toContain('owner');
    });

    it('should include partner-safe endpoint key in request', async () => {
      const mockResponse = { 
        ok: true, 
        json: async () => ({ message: { content: 'Response' } }) 
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { sendChatMessage } = await import('../../src/lib/openclawClient');
      
      await sendChatMessage({ 
        message: 'Test', 
        endpoint: 'lighthouse' 
      });

      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const options = fetchCall[1] as RequestInit;
      const body = JSON.parse(options.body as string);
      
      // Verify endpoint key is included for partner-safe access
      expect(body).toHaveProperty('endpointKey');
    });

    it('should handle gateway errors gracefully', async () => {
      const mockResponse = { 
        ok: false, 
        status: 500,
        json: async () => ({ error: 'Gateway error' }) 
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const { sendChatMessage } = await import('../../src/lib/openclawClient');
      
      await expect(sendChatMessage({ 
        message: 'Hello', 
        endpoint: 'lighthouse' 
      })).rejects.toThrow('Gateway error');
    });
  });
});
