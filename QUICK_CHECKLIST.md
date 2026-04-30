# ✅ Quick Action Checklist

## 🔴 CRITICAL (Do First - 15 min)

### 1. Rotate Supabase Key
- [ ] Go to: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/settings/api
- [ ] Click "Reset" on Service Role Key
- [ ] Copy new key
- [ ] Update in Vercel environment variables: `SUPABASE_SERVICE_ROLE_KEY`

### 2. Rotate Resend Key
- [ ] Go to: https://resend.com/api-keys
- [ ] Delete old key: `re_fYDcUB3H_3kVzef7Mia3muFpJ3KctUdLv`
- [ ] Create new key
- [ ] Update in Vercel: `RESEND_API_KEY`

### 3. Rotate R2 Keys
- [ ] Go to Cloudflare R2 dashboard
- [ ] Regenerate access keys
- [ ] Update in Vercel: `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`

---

## 🗄️ DATABASE SETUP (Do Second - 10 min)

### Run SQL Files in Supabase SQL Editor
**URL:** https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/sql/new

Copy and paste each file content, then click "Run":

- [ ] 1. `schema.sql` (if not already run)
- [ ] 2. `step1_add_columns.sql`
- [ ] 3. `step2_create_tables.sql`
- [ ] 4. `step3_indexes_constraints.sql`
- [ ] 5. `user_accounts.sql`
- [ ] 6. `admin_access.sql`
- [ ] 7. `step4_rpc_rls.sql`
- [ ] 8. `storage.sql`
- [ ] 9. `social_links.sql`

---

## 👤 CREATE ADMIN (Do Third - 2 min)

### Get Your User ID
- [ ] Go to: https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/auth/users
- [ ] Find your email: `sultaniagadgets7@gmail.com`
- [ ] Click on it and copy the User ID (UUID format)

### Run This SQL
```sql
-- Replace YOUR-USER-ID with the UUID you copied
INSERT INTO profiles (id, is_admin, full_name)
VALUES ('YOUR-USER-ID', TRUE, 'Admin Name')
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;
```

---

## 🧪 TEST (Do Fourth - 5 min)

- [ ] Visit: https://sultaniagadgets.com/admin
- [ ] Login with your email
- [ ] Verify you can access admin panel
- [ ] Try creating a test product
- [ ] Check if images upload

---

## 🎉 DONE!

Your website is now 100% functional!

---

## ⚠️ Optional: Fix Tawk.to Chat

- [ ] Login to Tawk.to dashboard
- [ ] Go to Administration > Channels
- [ ] Ensure widget is "Published"
- [ ] Add `sultaniagadgets.com` to allowed domains
- [ ] Verify widget ID: `69df1b01e53add1c34b2fbf7/1jm7o3040`

---

## 📞 Quick Links

- **Website:** https://sultaniagadgets.com
- **Admin:** https://sultaniagadgets.com/admin
- **Supabase:** https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx
- **Vercel:** https://vercel.com/sultaniagadgets7-2791s-projects
- **GitHub:** https://github.com/sultaniagadgets7-code/sultania-gadgets

---

**Total Time:** ~30 minutes
**Status:** All files ready, just need to execute!
