# Sultania Gadgets — Production eCommerce MVP

A trust-first, mobile-first eCommerce store for tech accessories in Pakistan.

## Stack
- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL, Auth, RLS)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.local` and fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Set up Supabase database
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Run `supabase/seed.sql` to populate sample data
4. Create an admin user in **Authentication → Users**

### 4. Run development server
```bash
npm run dev
```

## Routes

### Public
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/shop` | Product listing with filters |
| `/category/[slug]` | Category page |
| `/product/[slug]` | Product detail + COD order form |
| `/faq` | FAQ page |
| `/contact` | Contact / WhatsApp |
| `/shipping-policy` | Shipping policy |
| `/exchange-policy` | Exchange policy |

### Admin (requires Supabase Auth)
| Route | Description |
|-------|-------------|
| `/admin/login` | Admin sign in |
| `/admin` | Dashboard with stats |
| `/admin/orders` | Order management |
| `/admin/products` | Product list |
| `/admin/products/new` | Create product |
| `/admin/products/[id]/edit` | Edit product |

## Key Features
- **COD order flow** — no account required, form → confirmation
- **WhatsApp integration** — prefilled messages throughout
- **Trust signals** — tested before dispatch, honest specs, COD
- **Admin panel** — order status management, product CRUD
- **SEO** — metadata, sitemap, robots.txt, OG tags
- **Mobile-first** — sticky CTA bar on product pages

## Deployment
Deploy to Vercel:
```bash
vercel --prod
```
Set all environment variables in Vercel dashboard.

## Extending
- Add Supabase Storage for image uploads in admin
- Add order SMS notifications via Twilio
- Add analytics via Vercel Analytics
- Add product reviews table
