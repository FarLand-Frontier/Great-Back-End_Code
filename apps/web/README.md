# Great Back End Web App

PWA MVP for chat-first interface with OpenClaw gateway integration.

## Tech Stack

- Next.js 15 + TypeScript
- Vitest for testing
- Prisma (planned)

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run dev server
pnpm dev
```

## Project Structure

```
code/apps/web/
├── src/
│   └── lib/
│       └── config.ts       # App configuration
├── tests/
│   └── smoke/
│       └── app-smoke.test.ts
├── package.json
├── vitest.config.ts
└── README.md
```
