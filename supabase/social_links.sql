-- Add social media links to site_settings
alter table site_settings add column if not exists social_whatsapp text;
alter table site_settings add column if not exists social_facebook text;
alter table site_settings add column if not exists social_instagram text;
alter table site_settings add column if not exists social_tiktok text;
alter table site_settings add column if not exists social_youtube text;
alter table site_settings add column if not exists social_twitter text;
