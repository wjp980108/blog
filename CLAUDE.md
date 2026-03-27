# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chinese personal blog built with VitePress + @sugarat/theme. Content is written in Markdown under `docs/`.

## Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server
pnpm build          # Build for production (output: docs/.vitepress/dist)
pnpm serve          # Preview production build
pnpm lint           # Lint with ESLint
pnpm lint:fix       # Lint and auto-fix
```

## Architecture

- **VitePress** site with `docs/` as the content root
- **@sugarat/theme** provides blog layout, article lists, hot articles, comments (Giscus), friend links, reading time, and Live2D models
- **Config split**: `docs/.vitepress/config.mts` handles VitePress core config (nav, search via Algolia, social links); `docs/.vitepress/blog-theme.ts` handles @sugarat/theme config (footer, comments, works, article settings)
- **Theme entry**: `docs/.vitepress/theme/index.ts` re-exports @sugarat/theme with custom SCSS overrides (`style.scss`)
- **Deployment**: GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main`, then SCPs dist to a Windows server

## Code Style

- ESLint via `@antfu/eslint-config` with semicolons enabled (`stylistic.semi: true`)
- Package manager: **pnpm**
- Node version: pinned in `.nvmrc` (v24)
- Language: Chinese (zh-cn) — all UI text and blog content is in Chinese

## Content Structure

Blog posts live under `docs/` organized by category:
- `technology/share/` — tech sharing articles
- `technology/notes/` — study notes
- `article/` — curated/featured articles
- Standalone pages: `index.md` (home), `about.md`, `works.md`

Each category directory has an `index.md` serving as its listing page. Articles use VitePress frontmatter for metadata (title, date, tags, etc.).
