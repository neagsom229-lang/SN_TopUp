import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load apps/api/.env and ensure DIRECT_URL is used without printing it
dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function verifyRls() {
  console.log('Verifying Row Level Security (RLS) status across all public tables...');
  try {
    const results: Array<{
      table_name: string;
      rls_enabled: boolean;
      policy_count: string | number;
    }> = await prisma.$queryRaw`
        SELECT
          c.relname AS table_name,
          c.relrowsecurity AS rls_enabled,
          COUNT(p.oid) AS policy_count
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_policy p ON p.polrelid = c.oid
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'
        GROUP BY c.relname, c.relrowsecurity
        ORDER BY c.relname;
      `;

    let hasError = false;
    const summary = results.map((r) => ({
      Table: r.table_name,
      'RLS Enabled': r.rls_enabled ? 'ON' : 'OFF',
      'Policy Count': Number(r.policy_count),
    }));

    console.table(summary);

    for (const r of results) {
      const pCount = Number(r.policy_count);
      if (!r.rls_enabled) {
        console.error(`[ERROR] Table "${r.table_name}" has RLS disabled!`);
        hasError = true;
      }
      if (r.table_name === 'promo_codes' && pCount > 0) {
        console.error(
          `[ERROR] Table "promo_codes" has ${pCount} policy/policies (must be 0; server-side API validation only)!`,
        );
        hasError = true;
      }
    }

    if (hasError) {
      console.error('❌ RLS verification FAILED: One or more security constraints violated.');
      process.exit(1);
    } else {
      console.log(
        '✅ RLS verification PASSED: All public tables have RLS enabled and promo_codes has 0 policies.',
      );
      process.exit(0);
    }
  } catch (error) {
    console.error(
      '❌ Error executing RLS verification query (is the database running / reachable?):',
      error,
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyRls();
