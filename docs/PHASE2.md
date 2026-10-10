# SN Top-Up — Phase 2 Enhancement Specification

This document outlines the scope for the Phase 2 Enhancement Pass (Sections A to E).

## Section A: Telegram Notification Service

- Implement a notification service (`apps/api/src/services/notification.service.ts`) to send alerts (order created, payment received, fulfillment delivered) via Telegram Bot API when `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are configured.

## Section B: Rate Limiting & Security Hardening

- Add Express rate limiting middleware (`express-rate-limit` or custom sliding window) on sensitive API endpoints (`POST /api/v1/orders`, `POST /api/v1/webhooks/khqr`, `POST /api/v1/players/check`).

## Section C: Redis Caching Layer / Idempotency Cache

- Implement a lightweight Redis helper / caching wrapper for game catalog and webhook idempotency tracking in `apps/api/src/services/cache.service.ts`.

## Section D: Admin API Analytics Endpoints

- Add read-only admin analytics and order monitoring endpoints (`GET /api/v1/admin/metrics`, `GET /api/v1/admin/orders`) with server-side role checks (`user.role === 'admin'`).

## Section E: End-to-End Integration Tests & CI Workflow

- Add comprehensive vitest integration test suites covering notifications, rate limiting, and admin analytics endpoints. Ensure `npm run test:ci`, `npm run lint`, `npm run format:check`, and `npm run build` pass cleanly.
