# mumu-admin

## Project Overview

`mumu-admin` is a modern administrative dashboard frontend built with **Vue 3**, **TypeScript**, and **Vuetify 3**. It utilizes **Vite** for fast development and building. The application interacts with a backend microservices architecture (likely Spring Boot based, given the response structures) including IAM, Storage, Genix, and Log services.

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **UI Component Library:** Vuetify 3
- **Build Tool:** Vite 7
- **Language:** TypeScript
- **Routing:** `vue-router` with `unplugin-vue-router` (File-based routing)
- **HTTP Client:** Axios (highly customized with interceptors)
- **Internationalization:** `vue-i18n`
- **Linting/Formatting:** ESLint, Prettier, Husky

## Project Structure

```text
src/
├── api/             # API definition modules
├── config/          # Global configuration (e.g., menu structure)
├── layouts/         # App layouts (Blank, Default)
├── pages/           # File-based routes (auto-generated)
├── plugins/         # Vue plugins (Vuetify, i18n)
├── router/          # Router configuration
├── styles/          # Global styles and SCSS variables
├── types/           # TypeScript type definitions
└── utils/           # Shared utilities (HTTP client, constants)
```

## Development Workflow

### Build & Run

- **Install Dependencies:** `pnpm install` (inferred from `pnpm-lock.yaml`)
- **Start Dev Server:** `pnpm dev` (Runs on `http://localhost:5173`)
- **Build for Production:** `pnpm build`
- **Type Check:** `pnpm type-check`
- **Lint:** `pnpm lint`

### HTTP Client & API Interaction

The project uses a specialized Axios instance located in `src/utils/http.ts`. **Do not use raw `axios` or `fetch` for backend calls.**

- **Base URL:** `/api/mumu` (Proxied to backend in dev)
- **Service Prefixes:**
  - `/iam`: Identity & Access Management
  - `/storage`: File storage
  - `/genix`: General extensions/services
  - `/log`: Logging
- **Request Signing:** All requests are automatically signed (HMAC-SHA256) with headers `X-Timestamp`, `X-Request-ID`, and `X-Signature`.
- **Authentication:** OAuth2 (Bearer Token). Auto-refresh logic is implemented in the response interceptor.
- **Response Format:**
  All API responses (except specific cases like OAuth token endpoint) follow this wrapper:
  ```typescript
  interface ResponseWrapper<T = any> {
    successful: boolean;
    code: string;
    message: string;
    data: T;
    traceId: string;
  }
  ```

### Routing

Routing is **file-based**, handled by `unplugin-vue-router`.

- Files in `src/pages/` automatically become routes.
- Example: `src/pages/auth/login.vue` -> `/auth/login`
- `src/pages/index.vue` -> `/`

### UI & Styling

- **Vuetify:** Primary UI library. Use Vuetify components (e.g., `v-btn`, `v-card`).
- **Icons:** Material Design Icons (`@mdi/font`).
- **Custom Styles:** Located in `src/styles/`. SCSS is supported.

## Conventions

- **TypeScript:** Strict typing is enforced. Use defined interfaces (e.g., `ResponseWrapper`, `PageResult`) from `src/types/api.ts`.
- **Async/Await:** Prefer `async/await` over raw Promises.
- **Composition API:** Use `<script setup lang="ts">`.
- **I18n:** Use `useI18n` composable for text.
