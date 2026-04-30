-- ============================================================
-- Add products for Adapters and Accessories categories
-- ============================================================

with cat_adapters as (select id from categories where slug = 'adapters'),
     cat_accessories as (select id from categories where slug = 'accessories')

insert into products (slug, title, short_description, description, category_id, price, compare_at_price, stock_quantity, sku, condition, badge, compatibility, specs_json, whats_in_box, is_featured, is_active)
values
  (
    'otg-adapter-usb-c',
    'USB-C to USB-A OTG Adapter — Fast Data Transfer',
    'High-speed OTG adapter for connecting USB devices to your phone.',
    '- USB-C to USB-A OTG adapter
- High-speed data transfer up to 480Mbps
- Plug and play — no drivers needed
- Compact and portable design
- Compatible with USB flash drives, keyboards, mice',
    (select id from cat_adapters),
    499, 799, 25, 'ADP-OTG-USB-C', 'New', 'New',
    'Samsung Galaxy, OnePlus, Xiaomi, and other USB-C phones',
    '{"Type": "USB-C to USB-A OTG", "Speed": "USB 2.0 (480Mbps)", "Plug and Play": "Yes", "Length": "15cm"}',
    '1x USB-C OTG Adapter',
    true, true
  ),
  (
    'usb-c-hub-4-port',
    '4-Port USB-C Hub — HDMI, USB 3.0, SD Card Reader',
    'Versatile USB-C hub for expanding your device connectivity.',
    '- 4 ports: 2x USB 3.0, HDMI, SD card reader
- HDMI supports 4K@30Hz output
- USB 3.0 supports 5Gbps data transfer
- Compact and portable design
- Compatible with laptops and phones',
    (select id from cat_adapters),
    1999, 2999, 10, 'HUB-4PORT-USB-C', 'New', 'Hot',
    'MacBook, Windows laptops, USB-C phones',
    '{"Ports": "4 (2x USB 3.0, HDMI, SD)", "HDMI": "4K@30Hz", "USB 3.0": "5Gbps", "Compact": "Yes"}',
    '1x USB-C Hub
1x User Manual',
    true, true
  ),
  (
    'phone-case-protective',
    'Protective Phone Case — Shock Absorbent',
    'Durable protective case with shock absorption technology.',
    '- 3-layer shock absorption design
- Raised edges to protect screen and camera
- Slim and lightweight profile
- Easy to install and remove
- Compatible with wireless charging',
    (select id from cat_accessories),
    799, 1299, 50, 'CASE-PROTECTIVE', 'New', 'Sale',
    'iPhone 12/13/14/15, Samsung Galaxy S21+/S22',
    '{"Type": "Silicone/TPU Hybrid", "Protection": "Shock Absorbent", "Wireless Charging": "Yes", "Color": "Black"}',
    '1x Protective Phone Case',
    true, true
  ),
  (
    'car-phone-holder',
    'Car Phone Holder — Vent Mount, 360° Rotation',
    'Secure vent mount phone holder with adjustable grip.',
    '- Vent mount design — no dashboard damage
- 360° rotation for any angle
- Strong silicone grip for secure hold
- Compatible with all phone sizes
- Easy one-handed operation',
    (select id from cat_accessories),
    1299, 1999, 30, 'HOLDER-CAR-VENT', 'New', 'New',
    'All smartphones — iPhone, Samsung, Xiaomi',
    '{"Mount Type": "Vent", "Rotation": "360°", "Grip": "Silicone", "Adjustable": "Yes"}',
    '1x Car Phone Holder
1x User Manual',
    true, true
  );

-- Product Images
insert into product_images (product_id, image_url, alt_text, sort_order)
select p.id, 'https://placehold.co/600x600/f3f4f6/374151?text=' || replace(p.title, ' ', '+'), p.title, 0
from products p
where not exists (select 1 from product_images pi where pi.product_id = p.id);
