# Vercel Environment Variable Setup - URGENT

## Problem:
Admin panel kaam nahi kar raha kyunki `SUPABASE_SERVICE_ROLE_KEY` Vercel par missing hai.

## Solution:

### Option 1: Vercel Dashboard Se (Recommended)
1. https://vercel.com/sultaniagadgets7-2791s-projects/sultania-gadgets/settings/environment-variables
2. "Add New" button click karo
3. Key: `SUPABASE_SERVICE_ROLE_KEY`
4. Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibHZ4c2ZtY3FibHRpZm9xcm54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA5ODUwMCwiZXhwIjoyMDkxNjc0NTAwfQ.DIzZwcoF_CIU6_ONM6fy_A_31gt2N4hs`
5. Environments: **Production, Preview, Development** (sab select karo)
6. "Sensitive" checkbox check karo
7. Save karo
8. Redeploy karo

### Option 2: CLI Se
```bash
cd sultania-gadgets

# Production ke liye
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Preview ke liye  
vercel env add SUPABASE_SERVICE_ROLE_KEY preview

# Value paste karo jab puche:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibHZ4c2ZtY3FibHRpZm9xcm54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA5ODUwMCwiZXhwIjoyMDkxNjc0NTAwfQ.DIzZwcoF_CIU6_ONM6fy_A_31gt2N4hs
```

### After Adding:
```bash
# Redeploy
vercel --prod
```

## Verification:
After deployment, check:
- https://sultaniagadgets.com/admin/test-data (should show data)
- https://sultaniagadgets.com/admin/orders (should show orders)
- https://sultaniagadgets.com/admin/products (should show products)

## Why This Happened:
- Service role key pehle galat format mein thi (`sb_secret_...`)
- Sahi format JWT token hai (`eyJ...`)
- Vercel par yeh key add hi nahi thi
- Isliye admin queries fail ho rahi thi

## Current Status:
- ✅ Local `.env.local` fixed
- ✅ Code updated with better error handling
- ⚠️ **PENDING: Vercel environment variable add karna hai**
- ⚠️ **PENDING: Redeploy karna hai**
