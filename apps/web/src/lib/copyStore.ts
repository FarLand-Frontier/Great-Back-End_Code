// Copy Store - manages UI copy in memory with persistence contract
// Provides save/load operations for admin copy editor

export interface QuickPrompt {
  id: string
  text: string
}

export interface HomeCopy {
  title: string
  placeholder: string
  quickPrompts: QuickPrompt[]
}

export interface UICopyContract {
  home: HomeCopy
}

interface SaveResult {
  success: boolean
  copy?: UICopyContract
  error?: string
}

// In-memory store (would be replaced with Prisma/Postgres in production)
let copyStore: UICopyContract | null = null

// Default copy matching data/config/ui-copy.json schema
const defaultCopy: UICopyContract = {
  home: {
    title: 'Great Back End',
    placeholder: 'Ask me anything...',
    quickPrompts: [
      { id: 'quick-1', text: 'Start a new session' },
      { id: 'quick-2', text: 'View history' },
      { id: 'quick-3', text: 'Open dashboard' }
    ]
  }
}

/**
 * Get the current copy from store
 * Returns default copy if nothing is stored
 */
export function getCopy(): UICopyContract {
  if (!copyStore) {
    copyStore = { ...defaultCopy }
  }
  return copyStore
}

/**
 * Save copy to store
 * Validates against ui-copy.json schema and triggers export
 */
export async function saveCopy(copy: UICopyContract): Promise<SaveResult> {
  // Validate required fields
  if (!copy.home) {
    return { success: false, error: 'Missing required field: home' }
  }
  
  if (typeof copy.home.title !== 'string') {
    return { success: false, error: 'Invalid: home.title must be a string' }
  }
  
  if (typeof copy.home.placeholder !== 'string') {
    return { success: false, error: 'Invalid: home.placeholder must be a string' }
  }
  
  if (!Array.isArray(copy.home.quickPrompts)) {
    return { success: false, error: 'Invalid: home.quickPrompts must be an array' }
  }

  // Validate quick prompts
  for (const prompt of copy.home.quickPrompts) {
    if (!prompt.id || !prompt.text) {
      return { success: false, error: 'Invalid: each quickPrompt must have id and text' }
    }
  }

  // Save to store
  copyStore = { ...copy }

  // Trigger export to data repo
  try {
    const { exportCopyToDataRepo } = await import('./exportToDataRepo')
    await exportCopyToDataRepo(copy)
  } catch (error) {
    console.error('Failed to export copy to data repo:', error)
    // Don't fail the save if export fails - it's a background operation
  }

  return { success: true, copy: copyStore }
}

/**
 * Reset store to default (for testing)
 */
export function resetCopyStore(): void {
  copyStore = null
}
