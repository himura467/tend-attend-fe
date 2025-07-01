# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Management
- Use `pnpm` as the package manager (enforced by preinstall script)
- Install dependencies: `pnpm install`

### Development Server
- Start development server: `pnpm dev` (uses Next.js with Turbopack)
- Production build: `pnpm build`
- Start production server: `pnpm start`

### Code Quality
- ESLint check: `pnpm lint:eslint` or `next lint`
- ESLint fix: `pnpm lint-fix:eslint` or `next lint --fix`
- Prettier check: `pnpm lint:prettier`
- Prettier fix: `pnpm lint-fix:prettier`
- Run all linting checks: `pnpm ci:lint`

### Node.js Version
- Uses Node.js 22.15.0 (specified in `.node-version`)
- Use `nodenv install $(cat .node-version)` to install correct Node version

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.3.1 with React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with AWS Signature V4 interceptors
- **Calendar**: FullCalendar with RRULE support
- **Date Handling**: date-fns with timezone support

### Project Structure
- `src/app/` - Next.js App Router pages (signin, signup, events)
- `src/components/` - Component architecture following atomic design:
  - `ui/` - Base shadcn/ui components (button, form, calendar, etc.)
  - `organisms/shared/` - Reusable complex components (Calendar, DateTimePicker)
  - `organisms/specific/` - Feature-specific components organized by domain
  - `templates/` - Layout templates (DialogTemplate)
- `src/lib/` - Utilities and API layer:
  - `api/` - API clients with DTOs for type safety
  - `utils/aws-sig-v4/` - AWS Signature V4 implementation for API authentication
  - `types/` - TypeScript type definitions organized by domain
- `src/styles/` - Global CSS styles

### Key Features
- **Event Management**: Create, edit, and attend events with calendar integration
- **Authentication**: Sign in/up system with AWS Signature V4 API authentication
- **Calendar Integration**: FullCalendar with RRULE support for recurring events
- **Responsive UI**: shadcn/ui components with Tailwind CSS

### API Integration
- Backend API URL configured via `BACKEND_API_URL` environment variable
- AWS Signature V4 authentication implemented in axios interceptors
- API clients organized by domain (accounts, auth, events) with corresponding DTOs

### Code Conventions
- TypeScript with strict typing (explicit return types required)
- Component naming follows lowerCamelCase for files
- Function components with explicit return types
- shadcn/ui components excluded from ESLint checks
- Prettier with import organization and Tailwind class sorting