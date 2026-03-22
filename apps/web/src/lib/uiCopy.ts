// UI Copy module - loads copy contract from data repo
// This module provides typed access to UI copy text defined in data/config/ui-copy.json

interface QuickPrompt {
  id: string
  text: string
}

interface HomeCopy {
  title: string
  placeholder: string
  quickPrompts: QuickPrompt[]
}

interface UICopyContract {
  home: HomeCopy
}

// Default copy contract - can be overridden by loading from data repo
const defaultUICopy: UICopyContract = {
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

let cachedCopy: UICopyContract | null = null

/**
 * Get the home screen copy contract
 * Returns typed copy data for the home screen
 */
export function getHomeCopy(): HomeCopy {
  if (!cachedCopy) {
    cachedCopy = defaultUICopy
  }
  return cachedCopy.home
}

/**
 * Get the full UI copy contract
 */
export function getUICopy(): UICopyContract {
  if (!cachedCopy) {
    cachedCopy = defaultUICopy
  }
  return cachedCopy
}

export type { HomeCopy, QuickPrompt, UICopyContract }
