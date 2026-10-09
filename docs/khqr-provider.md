# KHQR Provider Integration Specification

## Overview
SN Top-Up integrates with third-party KHQR payment gateways to accept instantaneous payments across Cambodia (Bakong, ABA, Acleda, Canadia, Sathapana, etc.).

## Endpoints
- **Base URL:** `https://api.khqr.dev/v1`
- **Checkout Base:** `https://checkout.khqr.dev`
- **Authentication:** Bearer token via `KHQR_RBK_TOKEN`.

## Interface
Implemented via `PaymentProvider` interface in `apps/api/src/services/payment.interface.ts`.
- `createCharge(params)`: Generates QR string, MD5 hash, and checkout URL.
- `getStatus(providerRef)`: Queries gateway for payment settlement status (`paid`, `unpaid`, `expired`).
- `verifyWebhook(rawBody, headers)`: Validates HMAC signature using `KHQR_WEBHOOK_SECRET` and `crypto.timingSafeEqual`.

## TODO(verify)
When integrating with production KHQR gateway providers (e.g., Bakong Open API / Bakong KHQR SDK):
1. Verify exact webhook signature header name (e.g., `X-Signature` or `X-Bakong-Signature`).
2. Verify exact request/response json payload structure for QR code generation.
3. Confirm timeout and expiration handling rules.
