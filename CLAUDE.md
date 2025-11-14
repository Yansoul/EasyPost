# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Guidelines

**IMPORTANT**: All responses and communications with users must be in **Chinese (中文)**. This includes:
- All explanatory text and descriptions
- Error messages and warnings
- Status updates and progress reports
- Code comments when adding new files
- Commit messages

Code itself (variable names, function names, etc.) should still follow standard English naming conventions for maintainability.

## Project Overview

Media Auto Demo is a Next.js 15 application built with TypeScript and Tailwind CSS. This is a standard Next.js App Router project with minimal configuration.

## Package Manager

This project uses **pnpm** (version 9.0.0). Always use `pnpm` commands instead of npm or yarn.

## Development Commands

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```
Starts the Next.js development server at http://localhost:3000 with hot reload enabled.

### Build
```bash
pnpm build
```
Creates an optimized production build.

### Production Server
```bash
pnpm start
```
Runs the production server (requires `pnpm build` first).

### Linting
```bash
pnpm lint
```
Runs ESLint with Next.js configuration.

## Project Structure

- **App Router**: Uses Next.js 15 App Router (not Pages Router)
- **Root Layout**: `app/layout.tsx` - Contains root HTML structure, metadata, and font configuration (Geist Sans and Geist Mono from Google Fonts)
- **Home Page**: `app/page.tsx` - Main landing page
- **Styles**: `app/globals.css` - Global styles with Tailwind directives
- **Import Alias**: `@/*` maps to the root directory (configured in tsconfig.json)

## Tech Stack

- **Next.js 15.0.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety with strict mode enabled
- **Tailwind CSS 4** - Utility-first CSS framework
- **HeroUI 2.8.5** - React component library (formerly NextUI)
- **Framer Motion** - Animation library (required by HeroUI)
- **ESLint** - Code linting with Next.js config

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` for root directory imports
- Target: ES2017
- Module resolution: bundler (Next.js optimized)

## HeroUI Component Library

This project uses **HeroUI** (formerly NextUI) as the primary UI component library. All frontend components should be built using HeroUI components whenever possible.

### Key Configuration

- **Provider**: `HeroUIProvider` is set up in `app/providers.tsx` and wrapped around the app in `app/layout.tsx`
- **Tailwind Integration**: HeroUI plugin is configured in `tailwind.config.ts` with dark mode support
- **Dark Mode**: Uses class-based dark mode strategy (`darkMode: "class"`)
- **pnpm Configuration**: `.npmrc` includes `public-hoist-pattern[]=*@heroui/*` for proper package resolution

### Using HeroUI Components

Import components from `@heroui/react`:

```tsx
import { Button, Input, Card } from "@heroui/react";
```

### Documentation

- HeroUI Docs: https://heroui.com
- Component Reference: https://heroui.com/docs/components
- Theming Guide: https://heroui.com/docs/customization/theme
