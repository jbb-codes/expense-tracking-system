# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.
- Categories are exposed via `GET /api/categories?userId=` (`server/src/routes/categories.js`) and the client `CategoryService` (`client/src/app/categories/category.service.ts`). Any expense form needing a category-name dropdown should reuse this service rather than adding a second implementation.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
