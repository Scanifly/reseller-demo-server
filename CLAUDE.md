# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A demo server for Scanifly resellers that shows how to integrate Scanifly's 3D design viewer into a third-party platform. It has two parts:

1. **Backend** (`app/`) — Node/Express API that authenticates against Scanifly's API, provisions companies/users/projects, signs JWTs, and proxies 3D viewer embed URLs.
2. **Frontend** (`client/`) — Minimal React/Vite UI that takes an email + project/design IDs, calls the backend for a signed embed URL, then renders the 3D viewer in an iframe.

## Commands

### Backend (repo root)

```bash
yarn local        # Dev server with nodemon auto-reload
yarn build        # Compile TypeScript to dist/app/
yarn start        # Run compiled server (requires prior build)
yarn routes       # Regenerate TSOA routes + swagger.json (run after controller changes)
yarn lint         # TypeScript + ESLint check
yarn prettier     # Format code
yarn open-3d      # CLI: sign a JWT and open the 3D viewer in the browser
```

### Frontend (`client/`)

The client is a standalone **Yarn 3** project with its own `yarn.lock` and `.yarnrc.yml` (separate from the backend's Yarn project at the repo root). Run yarn commands from inside `client/`.

```bash
cd client
yarn install      # First-time setup
yarn dev          # Vite dev server on port 5173 (proxies /scanifly → localhost:3002)
yarn build        # Type-check + Vite bundle to client/dist/
yarn preview      # Preview the production build
```

### Both at once

```bash
make dev          # mprocs: dockerized backend + Vite client in one view
```

### Docker

```bash
make up           # docker compose up (detached)
make build-up     # rebuild image then start
make down         # stop containers
make logs         # tail reseller-demo-server logs
```

## Architecture

### Singleton Services

All major backend services use a singleton pattern:

- `ConfigService` — reads `.env` and exposes typed getters for each env var
- `ScaniflyService` — wraps all Scanifly REST API calls. Reseller-admin operations (create company/user, purchase credits, update JWKS endpoint, look up the reseller's company ID) hit the `/api/v1/*` endpoints authenticated with an API key (`x-api-token` header, from `SCANIFLY_API_KEY`). Project/design creation and the 3D embed instead use the RS256 JWT signed by `AuthService`, against the non-versioned endpoints
- `AuthService` — signs RS256 JWTs using the private key from config
- `Server` — Express singleton; bootstraps middleware, TSOA routes, and shutdown handlers

### Request Flow (3D viewer embed)

1. Frontend POSTs `{ email, scaniflyProjectId, scaniflyDesignId, scaniflyCompanyId, scaniflyUserId?, newUser? }` to `POST /scanifly/3dUrl`
2. Controller calls `ScaniflyService.get3dEmbed()`, which constructs the base embed URL locally from `SCANIFLY_3D_URL` and the project/design IDs
3. `AuthService` signs a JWT (`iss`, `aud: "scanifly"`, `sub: email`, `iss_scanifly_company_id`, 1h expiry) plus the optimistic-creation claims below
4. The signed JWT is appended as a query param to the embed URL
5. Frontend renders the URL in an `<iframe>`
6. Scanifly validates the JWT by fetching the public JWKS from `/.well-known/jwks.json`

### Optimistic User Creation

`AuthService.getJwt()` takes two extra arguments beyond the reseller's own company ID:

- `companyIdInScaniflyForUser` → the `sub_scanifly_company_id` claim. This is the **target** company of the user being authenticated, distinct from `iss_scanifly_company_id` (the reseller's own company). Scanifly needs it to create a user it cannot resolve from `sub_scanifly_user_id` or `sub`.
- `newUser` (`OptimisticUserClaims`) → the `firstName` / `lastName` / `phone` / `position` claims, each optional with a Scanifly-side default. Read only at creation; ignored for an existing user.

Creation only happens when the target company has granted the reseller the `autoCreateUsers` permission; otherwise an unknown user is rejected exactly as before, so sending the claims is always safe.

Three call sites pass the target company: `get3dEmbed` (from the request body, with `newUser`), and `addProject` / `addDesign` (reusing the `scaniflyCompanyId` they already take). `addModuleLibrary` has no company in its request and does not.

User-facing detail lives in the README's "Optimistic User Creation" section; keep the two in sync.

### TSOA Route Generation

Controllers in `app/**/*.controller.ts` use TSOA decorators (`@Route`, `@Post`, `@Body`, etc.). After modifying a controller, run `yarn routes` to regenerate `app/routes/routes.ts` and `app/routes/swagger.json`. **Never hand-edit `routes.ts`** — it is overwritten on each `yarn routes` run.

### Environment Variables

Copy `_env` to `.env` before running locally. Key variables:

| Variable | Purpose |
|---|---|
| `PORT` | Backend listen port (no default; `_env` and docker-compose use 3002) |
| `SCANIFLY_ENDPOINT` | Scanifly API base URL |
| `SCANIFLY_API_KEY` | API key for an admin user of your reseller company; sent as `x-api-token` on `/api/v1` reseller calls |
| `SCANIFLY_3D_URL` | Base URL for 3D viewer |
| `JWKS_KEY_ID` | Must match `kid` in `app/jwks.json` |
| `JWKS_PRIVATE_KEY` | RSA private key (PEM, PKCS#8 format) |
| `CORS_ORIGIN` | Allowed origin for CORS (e.g. `http://localhost:5173`) |
| `JWT_ISSUER` | `iss` claim in signed JWTs (your domain) |

### JWKS Key Pair

`app/jwks.json` holds the **public** RSA key served at `/.well-known/jwks.json`. The corresponding private key lives only in `JWKS_PRIVATE_KEY` env var. The `kid` in both must match `JWKS_KEY_ID`. After registering a new JWKS endpoint with Scanifly use `PATCH /scanifly/reseller`.

### Vite Proxy

The Vite dev server (`client/vite.config.ts`) proxies all `/scanifly` requests to `http://localhost:3002`, so the frontend and backend can run on different ports in development without CORS issues.
