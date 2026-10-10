-- Enable Row Level Security on all 12 tables (idempotent)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Default deny all for anon role unless explicitly permitted by policies
-- Note: The service_role (used by Express API via Prisma) bypasses RLS completely.

-- Helper guard for auth schema and auth.uid() in shadow / non-Supabase DBs
CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
BEGIN
  RETURN NULL;
EXCEPTION
  WHEN undefined_table OR invalid_schema_name THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Game Categories: public can view active categories (idempotent)
DROP POLICY IF EXISTS "Public game categories are viewable by everyone" ON game_categories;
CREATE POLICY "Public game categories are viewable by everyone" ON game_categories
  FOR SELECT USING (active = true);

-- Games: public can view active games (idempotent)
DROP POLICY IF EXISTS "Public games are viewable by everyone" ON games;
CREATE POLICY "Public games are viewable by everyone" ON games
  FOR SELECT USING (active = true);

-- Products: public can view active products (idempotent)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" ON products
  FOR SELECT USING (active = true);

-- Orders: authenticated customers can view their own orders (idempotent, cast auth.uid()::text to match user_id text column)
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id);

-- Payments: users can view payments for their own orders (idempotent, cast auth.uid()::text)
DROP POLICY IF EXISTS "Users can view payments for their own orders" ON payments;
CREATE POLICY "Users can view payments for their own orders" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()::text
    )
  );

-- Promo codes: No public policy (server-side validation only via API)
DROP POLICY IF EXISTS "Public active promo codes are viewable" ON promo_codes;
