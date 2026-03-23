import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const requiredPatterns = [
  '.turbo',
  'coverage',
  '*.tsbuildinfo',
  'next-env.d.ts',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
  'pnpm-debug.log*',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
]

describe('gitignore runtime artifacts policy', () => {
  it('should include required runtime artifact patterns at repo and app level', () => {
    const appRoot = process.cwd()
    const repoRoot = join(appRoot, '..', '..')

    const appGitignore = readFileSync(join(appRoot, '.gitignore'), 'utf8')
    const repoGitignore = readFileSync(join(repoRoot, '.gitignore'), 'utf8')

    for (const pattern of requiredPatterns) {
      expect(appGitignore).toContain(pattern)
      expect(repoGitignore).toContain(pattern)
    }
  })
})
