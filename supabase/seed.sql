-- ============================================================
-- Sultania Gadgets — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Site Settings
insert into site_settings (whatsapp_number, support_text, shipping_text, cod_enabled, store_city)
values ('923001234567', 'Fast WhatsApp support available', 'Delivery across Pakistan in 2-4 days', true, 'Karachi')
on conflict do nothing;

-- Categories
insert into categories (name, slug, description, sort_order) values
  ('Chargers', 'chargers', 'Fast chargers, wall adapters, and charging solutions', 1),
  ('Earbuds', 'earbuds', 'Wireless and wired earbuds for all devices', 2),
  ('Cables', 'cables', 'USB-C, Lightning, and data cables', 3),
  ('Power Banks', 'power-banks', 'Portable power banks for on-the-go charging', 4),
  ('Adapters', 'adapters', 'OTG adapters, converters, and hubs', 5),
  ('Accessories', 'accessories', 'Phone cases, holders, and other accessories', 6)
on conflict (slug) do nothing;

-- Products
with cat_chargers as (select id from categories where slug = 'chargers'),
     cat_earbuds as (select id from categories where slug = 'earbuds'),
     cat_cables as (select id from categories where slug = 'cables'),
     cat_powerbanks as (select id from categories where slug = 'power-banks')

insert into products (slug, title, short_description, description, category_id, price, compare_at_price, stock_quantity, sku, condition, badge, compatibility, specs_json, whats_in_box, is_featured, is_active)
values
  (
    '65w-gan-charger',
    '65W GaN Fast Charger — USB-C',
    'Compact 65W GaN charger with USB-C PD. Charges laptops, phones, and tablets.',
    '- 65W GaN technology for fast, efficient charging
- Supports USB-C Power Delivery (PD)
- Compact design — smaller than standard chargers
- Smart chip prevents overcharging
- Works with laptops, phones, tablets',
    (select id from cat_chargers),
    2499, 3200, 15, 'CHG-65W-GAN', 'New', 'Hot',
    'iPhone 12/13/14/15, Samsung Galaxy S21+, MacBook Air M1/M2, iPad Pro',
    '{"Output": "65W Max", "Connector": "USB-C PD", "Input": "100-240V", "Size": "Compact GaN", "Safety": "OVP, OCP, OTP"}',
    '1x 65W GaN Charger
1x User Manual',
    true, true
  ),
  (
    'anker-nano-20w',
    '20W USB-C Fast Charger — Compact',
    'Pocket-sized 20W USB-C charger. Perfect for iPhones and Android phones.',
    '- 20W USB-C Power Delivery
- Compact nano design fits in any pocket
- Compatible with iPhone 12 and above for fast charging
- Foldable plug for easy travel
- Safe charging with temperature control',
    (select id from cat_chargers),
    899, 1200, 30, 'CHG-20W-NANO', 'New', 'New',
    'iPhone 12/13/14/15, Samsung, Xiaomi, OnePlus',
    '{"Output": "20W", "Connector": "USB-C", "Input": "100-240V", "Plug": "Foldable"}',
    '1x 20W Charger',
    true, true
  ),
  (
    'tws-pro-earbuds',
    'TWS Pro Wireless Earbuds — Active Noise Cancellation',
    'True wireless earbuds with ANC, 30hr battery, and premium sound.',
    '- Active Noise Cancellation (ANC)
- 30 hours total battery (6hr buds + 24hr case)
- Bluetooth 5.3 for stable connection
- IPX5 water resistant
- Touch controls
- Clear call quality with dual microphones',
    (select id from cat_earbuds),
    3499, 4500, 8, 'EAR-TWS-PRO', 'New', 'Hot',
    'All Bluetooth devices — iPhone, Samsung, Xiaomi, OnePlus',
    '{"Battery": "30 hours total", "Bluetooth": "5.3", "ANC": "Yes", "Water Resistance": "IPX5", "Driver": "10mm Dynamic"}',
    '1x Left Earbud
1x Right Earbud
1x Charging Case
1x USB-C Cable
3x Ear Tips (S/M/L)',
    true, true
  ),
  (
    'usb-c-to-lightning-cable-1m',
    'USB-C to Lightning Cable — 1 Meter, Fast Charge',
    'MFi-certified USB-C to Lightning cable for fast charging iPhones.',
    '- MFi certified — works perfectly with all iPhones
- Supports 20W fast charging
- Braided nylon for durability
- 1 meter length
- Compatible with all Lightning devices',
    (select id from cat_cables),
    699, 950, 50, 'CAB-UCL-1M', 'New', null,
    'iPhone 5 through iPhone 14, iPad, AirPods',
    '{"Length": "1 Meter", "Connector 1": "USB-C", "Connector 2": "Lightning", "Charging": "20W Fast Charge", "Material": "Braided Nylon"}',
    '1x USB-C to Lightning Cable',
    true, true
  ),
  (
    '10000mah-power-bank',
    '10000mAh Power Bank — Dual USB, Fast Charge',
    'Slim 10000mAh power bank with dual USB output and fast charging.',
    '- 10000mAh capacity — charges most phones 2-3 times
- Dual USB-A output
- USB-C input for fast recharging
- LED battery indicator
- Slim and lightweight design
- Airline safe',
    (select id from cat_powerbanks),
    2199, 2800, 12, 'PB-10K-DUAL', 'New', 'Sale',
    'All smartphones and small devices',
    '{"Capacity": "10000mAh", "Output": "2x USB-A 5V/2.4A", "Input": "USB-C 5V/2A", "Weight": "220g", "LED Indicator": "Yes"}',
    '1x Power Bank
1x USB-C Charging Cable
1x User Manual',
    true, true
  );

-- Product Images (using placeholder images — replace with real ones)
insert into product_images (product_id, image_url, alt_text, sort_order)
select p.id, 'https://placehold.co/600x600/f3f4f6/374151?text=' || replace(p.title, ' ', '+'), p.title, 0
from products p
where not exists (select 1 from product_images pi where pi.product_id = p.id);

-- FAQ Items
insert into faq_items (question, answer, product_id, sort_order, is_active) values
  ('Do you offer Cash on Delivery?', 'Yes! We offer Cash on Delivery (COD) across all major cities in Pakistan. You pay when you receive your order.', null, 1, true),
  ('How long does delivery take?', 'Delivery typically takes 2–4 business days. Karachi, Lahore, and Islamabad usually receive orders in 1–2 days.', null, 2, true),
  ('Are the products genuine?', 'Yes. Every product we sell is genuine and tested before dispatch. We do not sell fake or counterfeit items.', null, 3, true),
  ('What if I receive a defective product?', 'Contact us on WhatsApp within 3 days of delivery with a photo or video. We will arrange an exchange at no extra cost.', null, 4, true),
  ('Can I order via WhatsApp?', 'Absolutely! You can place orders directly on WhatsApp. Just send us the product name and your delivery details.', null, 5, true),
  ('What is the delivery fee?', 'We charge a flat delivery fee of Rs. 200 for all orders across Pakistan.', null, 6, true);

-- Testimonials
insert into testimonials (customer_name, quote, location, is_featured) values
  ('Ahmed Raza', 'Received exactly what was shown. The 65W charger works perfectly with my MacBook. Fast delivery to Karachi!', 'Karachi', true),
  ('Fatima Khan', 'The earbuds sound amazing and the ANC actually works. Ordered on WhatsApp and got it in 2 days.', 'Lahore', true),
  ('Usman Ali', 'Tested before dispatch is real — my cable came with a note saying it was checked. Great service!', 'Islamabad', true),
  ('Sara Malik', 'COD made it easy to trust the store. Product was exactly as described. Will order again.', 'Rawalpindi', true),
  ('Hassan Tariq', 'Power bank is slim and charges my phone twice. Good quality for the price.', 'Faisalabad', true),
  ('Zainab Hussain', 'WhatsApp support is very responsive. They helped me choose the right charger for my phone.', 'Multan', true);
