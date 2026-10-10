-- Additive migration: product metadata fields
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "package_type" TEXT NOT NULL DEFAULT 'currency';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "badge" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "bonus_label" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unit_amount" INTEGER;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unit_label" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "group_label" TEXT;
