# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Component Generator** application built with Nuxt 4 that allows users to generate Web Components dynamically using Claude's API. Users input a natural language description of a component, and the application generates and renders scoped Web Components with Tailwind CSS v4 in real-time.

## Commands

### Development

- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally

### Code Quality

- `pnpm verify` - Run all validation (format, lint, typecheck, test)
- `pnpm format` - Format code with Prettier
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm typecheck` - Run TypeScript type checking

### Other

- `pnpm generate` - Generate static site
- `pnpm start` - Start production server

## Architecture

### Core Flow

1. **User Input** → `GeneratorForm.vue` captures component description
2. **API Call** → `/api/generate-component` endpoint calls Claude API
3. **Component Generation** → Claude generates Web Components with Shadow DOM and Tailwind CSS v4
4. **Dynamic Rendering** → `ComponentRenderer.vue` injects and displays the Web Component

### Key Components

**Frontend:**

- `app/pages/index.vue` - Main page with form and preview
- `app/components/GeneratorForm.vue` - Input form for component descriptions
- `app/components/ComponentRenderer.vue` - Dynamically injects and renders generated Web Components

**Backend:**

- `server/api/generate-component.post.ts` - API endpoint that calls Claude to generate Web Components

### Environment Configuration

The app requires `NUXT_ANTHROPIC_API_KEY` environment variable in `.env`:

```
NUXT_ANTHROPIC_API_KEY=sk-ant-api03-...
```

This is accessed via `useRuntimeConfig().anthropicApiKey` in the server API.

### Dynamic Web Component Rendering

The `ComponentRenderer` component:

- Accepts Web Component code with Shadow DOM and Tailwind CSS v4
- Safely injects Web Component HTML into a preview container
- Executes minimal JavaScript for custom element registration
- Handles script cleanup to prevent memory leaks
- Provides error handling and code display toggle
- Components are properly scoped using Shadow DOM

### Claude API Integration

The server endpoint:

- Uses `@anthropic-ai/sdk` package
- Calls `claude-sonnet-4-20250514` model
- Sends structured prompt requesting Web Components with Shadow DOM
- Uses Tailwind CSS v4 via `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`
- Returns complete Web Component code with proper scoping and no custom JavaScript logic

## Technical Notes

- Uses Nuxt 4 with Vue 3 composition API
- Components are auto-imported from `~/components`
- Uses Tailwind CSS v4 for styling via CDN in generated components
- TypeScript enabled with strict type checking
- ESLint + Prettier for code formatting
- Always verify code after changes with `npm run verify` command.
- do not start the dev server it is already running