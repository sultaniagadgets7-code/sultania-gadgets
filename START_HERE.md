# 🚀 START HERE - Sultania Gadgets Setup

## 📊 Current Status: 85% Complete

Your website is **LIVE** at https://sultaniagadgets.com but needs 3 final steps to be 100% functional.

---

## ✅ What's Already Done

- ✅ Website deployed to Vercel
- ✅ Domain connected (sultaniagadgets.com)
- ✅ All code fixed and building successfully
- ✅ Security hardening complete
- ✅ All SQL migration files ready
- ✅ Rate limiting implemented
- ✅ File upload validation added
- ✅ Admin authentication hardened

---

## 🎯 What You Need to Do (3 Steps)

### Step 1: Rotate Exposed Credentials (15 min) 🔴 CRITICAL

Your `.env.local` file was accidentally committed to git with sensitive keys. You must rotate them:

#### A. Supabase Service Role Key
1. Visit: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/settings/api
2. Click "Reset" on Service Role Key
3. Copy the new key
4. Go to Vercel: https://vercel.com/sultaniagadgets7-2791s-projects/sultania-gadgets/settings/environment-variables
5. Update `SUPABASE_SERVICE_ROLE_KEY` with new value

#### B. Resend API Key
1. Visit: https://resend.com/api-keys
2. Delete the old key: `re_fYDcUB3H_3kVzef7Mia3muFpJ3KctUdLv`
3. Create a new API key
4. Update `RESEND_API_KEY` in Vercel

#### C. Cloudflare R2 Keys
1. Go to your Cloudflare R2 dashboard
2. Regenerate your access keys
3. Update in Vercel:
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`

---

### Step 2: Run Database Migrations (10 min)

Open Supabase SQL Editor: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/sql/new

**Copy and paste each file content, then click "Run":**

1. `supabase/schema.sql` (if not already run)
2. `supabase/step1_add_columns.sql`
3. `supabase/step2_create_tables.sql`
4. `supabase/step3_indexes_constraints.sql`
5. `supabase/user_accounts.sql`
6. `supabase/admin_access.sql`
7. `supabase/step4_rpc_rls.sql`
8. `supabase/storage.sql`
9. `supabase/social_links.sql`

**Note:** If you see "already exists" errors, that's OK! It means that part was already done.

---

### Step 3: Create Admin User (2 min)

#### A. Get Your User ID
1. Go to: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/auth/users
2. Find your email: `sultaniagadgets7@gmail.com`
3. Click on it and copy the **User ID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

#### B. Run This SQL
In Supabase SQL Editor, run:

```sql
-- Replace YOUR-USER-ID with the UUID you copied above
INSERT INTO profiles (id, is_admin, full_name)
VALUES ('YOUR-USER-ID', TRUE, 'Admin Name')
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;
```

---

## 🎉 Done! Test Your Site

1. Visit: https://sultaniagadgets.com/admin
2. Login with your email
3. You should now have full admin access!

---

## 📚 Additional Documentation

- **`QUICK_CHECKLIST.md`** - Simple checkbox list
- **`DATABASE_MIGRATION_GUIDE.md`** - Detailed SQL execution guide
- **`COMPLETE_SETUP_STATUS.md`** - Full status report
- **`SECURITY_FIXES.md`** - Security audit details

---

## ⚠️ Known Issues (Not Critical)

### Tawk.to Live Chat Not Working
The chat widget has CORS errors. This is a Tawk.to configuration issue, not your code.

**To fix (optional):**
1. Login to Tawk.to dashboard
2. Ensure widget is "Published"
3. Add `sultaniagadgets.com` to allowed domains

**Status:** Can be fixed later, doesn't affect site functionality

---

## 📞 Quick Links

- **Your Website:** https://sultaniagadgets.com
- **Admin Panel:** https://sultaniagadgets.com/admin
- **Supabase Dashboard:** https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx
- **Vercel Dashboard:** https://vercel.com/sultaniagadgets7-2791s-projects
- **GitHub Repo:** https://github.com/sultaniagadgets7-code/sultania-gadgets

---

## 🆘 Need Help?

If you get stuck on any step, just ask! I'm here to help.

---

**Total Time Required:** ~30 minutes
**Difficulty:** Easy (just copy-paste and click)

Let's get your site to 100%! 🚀
