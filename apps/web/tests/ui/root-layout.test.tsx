import { describe, it, expect } from 'vitest'

describe('RootLayout', () => {
  it('should render html + body wrapper and pass children through', async () => {
    const { default: RootLayout } = await import('../../src/app/layout')

    const output = RootLayout({ children: 'hello-layout' }) as {
      type: string
      props: { children: { type: string; props: { children: unknown } } }
    }

    expect(output.type).toBe('html')
    expect(output.props.children.type).toBe('body')
    expect(output.props.children.props.children).toBe('hello-layout')
  })
})
