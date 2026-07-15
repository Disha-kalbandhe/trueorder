# TrueOrder - Antigravity Project Rules

## Product

TrueOrder is a hackathon-grade B2B order automation system.
It converts incoming customer emails and attachments (PDF, scan, spreadsheet) into structured digital orders.

## Core differentiator

TrueOrder does not just parse the attachment.
It performs contextual fusion:

- It reads both the email body and the attachment.
- If the email contains a correction or override, email intent wins.
- The UI must make this transparent and auditable.

## Tech stack

- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Flask
- API client: axios
- Current deployment: frontend on Vercel, backend on Render

## Existing routes

- / -> Dashboard
- /order/:id -> Order detail
- /repair/:id -> Exception repair flow

## Existing backend endpoints

- GET /health
- GET /api/orders
- GET /api/orders/:id
- PATCH /api/orders/:id/status

## Source of truth

- backend/schemas.py defines data models and must remain aligned with frontend usage.

## Design principles

- Enterprise operations product, not a chatbot toy
- Minimal, premium, trustworthy UI
- Explainability over gimmicks
- Every important decision should be auditable
- Responsive layout
- Tailwind only, no component libraries unless explicitly requested

## Code constraints

- Do not add unnecessary dependencies
- Do not refactor unrelated files
- Do not rename existing routes or endpoints unless explicitly asked
- Do not introduce TypeScript
- Do not add placeholder comments like "implement later"
- Prefer small reusable components over giant files
- Keep code readable and production-style without over-engineering

## Development style

When given a task:

1. First inspect relevant files.
2. Then propose a short plan.
3. Then implement only the requested scope.
4. Then summarize changed files and any manual follow-up steps.
