-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
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

-- Games: public can view active games
CREATE POLICY "Public games are viewable by everyone" ON games
  FOR SELECT USING (active = true);

-- Products: public can view active products
CREATE POLICY "Public products are viewable by everyone" ON products
  FOR SELECT USING (active = true);

-- Orders: authenticated customers can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Payments: users can view payments for their own orders
CREATE POLICY "Users can view payments for their own orders" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

-- Promo codes: public can view active promo codes
CREATE POLICY "Public active promo codes are viewable" ON promo_codes
  FOR SELECT USING (active = true AND expires_at > NOW());
