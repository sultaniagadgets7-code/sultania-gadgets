-- STEP 1: Add missing columns to existing tables
-- Run this first

-- Add columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes_internal TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cod_collected_by TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMPTZ;

-- Add columns to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10,2) DEFAULT 200;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS announcement_text TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_headline TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_subtext TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_whatsapp TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_facebook TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_instagram TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_tiktok TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_youtube TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_twitter TEXT;

-- Add emoji column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '📦';
