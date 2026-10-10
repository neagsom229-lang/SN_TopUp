-- Migration: 20261009000001_remove_promo_public_rls
-- Revoke public SELECT on promo_codes so promo validation occurs server-side through the API only.

-- Guard for non-Supabase shadow DBs (ensures auth schema and auth.uid() exist if tested locally/shadow DB)
CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
BEGIN
  RETURN NULL;
EXCEPTION
  WHEN undefined_table OR invalid_schema_name THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP POLICY IF EXISTS "Public active promo codes are viewable" ON promo_codes;

-- Ensure default deny is enforced for promo_codes under anon role
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Note: For Supabase production environments, use prisma migrate deploy.
