import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

// Mock Prisma client for unit testing against the mock DB
vi.mock('@prisma/client', () => {
  const mPrisma = {
    game: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'game-uuid',
          slug: 'mobile-legends',
          name: 'Mobile Legends',
          imageUrl: 'https://example.com/ml.jpg',
          active: true,
          products: [],
        },
      ]),
    },
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

describe('Order API & Flow - Focused Tests (Mock DB Environment)', () => {
  const app = createApp();

  it('GET /api/v1/games returns list of active games with status 200 (hitting mock DB)', async () => {
    const res = await request(app).get('/api/v1/games');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.games || res.body)).toBe(true);
  });
});
