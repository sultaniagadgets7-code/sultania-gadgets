-- Add emoji column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '📦';

-- Update existing categories with their emojis
UPDATE categories SET emoji = '⚡' WHERE slug = 'chargers';
UPDATE categories SET emoji = '🎧' WHERE slug = 'earbuds';
UPDATE categories SET emoji = '🔗' WHERE slug = 'cables';
UPDATE categories SET emoji = '📱' WHERE slug = 'accessories';
UPDATE categories SET emoji = '🔋' WHERE slug = 'power-banks';
UPDATE categories SET emoji = '🔄' WHERE slug = 'adapters';

SELECT id, name, slug, emoji FROM categories ORDER BY sort_order;
