import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// TDD Step 1: Write the failing test
// This test verifies PWA installability requirements:
// 1. manifest.webmanifest exists with required fields
// 2. Service worker exists
// 3. iPhone UX considerations (standalone display mode, proper icons)

const WEB_APP_DIR = '/root/.openclaw/workspace/great-back-end/code/apps/web'

describe('PWA Installability', () => {
  it('should have manifest.webmanifest with required PWA fields', () => {
    const manifestPath = path.join(WEB_APP_DIR, 'public/manifest.webmanifest')
    
    // Check file exists
    expect(fs.existsSync(manifestPath), 'manifest.webmanifest should exist in public/').toBe(true)
    
    // Parse and validate manifest
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)
    
    // Required PWA fields
    expect(manifest.name).toBeDefined()
    expect(manifest.short_name).toBeDefined()
    expect(manifest.start_url).toBeDefined()
    expect(manifest.display).toBeDefined()
    expect(manifest.icons).toBeDefined()
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThan(0)
    
    // iPhone UX: display should be standalone for installable PWA
    expect(manifest.display).toBe('standalone')
    
    // iPhone UX: should have background_color and theme_color
    expect(manifest.background_color).toBeDefined()
    expect(manifest.theme_color).toBeDefined()
  })
  
  it('should have service worker (sw.ts) for offline support', () => {
    const swPath = path.join(WEB_APP_DIR, 'src/app/sw.ts')
    
    // Check service worker file exists
    expect(fs.existsSync(swPath), 'service worker (sw.ts) should exist in src/app/').toBe(true)
    
    // Verify it's a valid TypeScript service worker
    const swContent = fs.readFileSync(swPath, 'utf-8')
    
    // Service worker should have install, activate, and fetch event listeners
    expect(swContent).toContain('install')
    expect(swContent).toContain('activate')
    expect(swContent).toContain('fetch')
  })
  
  it('should have valid icon configuration for iPhone', () => {
    const manifestPath = path.join(WEB_APP_DIR, 'public/manifest.webmanifest')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    
    // Check for iOS-compatible icons (at least one should have sizes suitable for iPhone)
    // iOS typically needs 192x192 and 512x512 at minimum
    const hasValidIconSizes = manifest.icons.some((icon: { sizes: string }) => {
      const sizes = icon.sizes || ''
      return sizes.includes('192') || sizes.includes('512')
    })
    
    expect(hasValidIconSizes, 'manifest should have at least one icon with 192x192 or 512x512 size').toBe(true)
  })
})
