# Deep Diagnosis: Checkout & Account Creation Glitches

## Critical Issues Found

### 1. **Race Condition in Login Page** ⚠️ CRITICAL
**Location**: `src/app/auth/login/page.tsx`

**Problem**: 
- `useEffect` dependency array is empty `[]` but uses `next` from searchParams
- This causes stale closure - the redirect URL might be outdated
- Can cause redirect to wrong page or loop

**Fix**: Add dependencies or use router.push with current searchParams

### 2. **Profile Check Happens Twice** ⚠️ HIGH
**Location**: `src/app/auth/login/page.tsx`

**Problem**:
- Profile is checked in `useEffect` on mount
- Profile is checked again in `handleLogin`
- Double database calls, potential race condition
- Can cause glitches if profile changes between calls

**Fix**: Consolidate profile checking logic

### 3. **Router.replace During Loading** ⚠️ HIGH
**Location**: `src/app/auth/login/page.tsx` - lines 95, 127, 161

**Problem**:
- Using `router.replace(next)` while component is still mounted
- Can cause "Cannot update component while rendering" errors
- Loading state not properly managed during navigation

**Fix**: Use `router.push` or ensure component unmounts cleanly

### 4. **Checkout Page Server-Side Redirect** ⚠️ MEDIUM
**Location**: `src/app/checkout/page.tsx`

**Problem**:
- Server component redirects unauthenticated users
- Client-side cart state might not be preserved
- Can cause cart to appear empty after login

**Fix**: Add client-side cart persistence check

### 5. **Cart Clear Timing Issue** ⚠️ MEDIUM
**Location**: `src/app/checkout/CartCheckout.tsx`

**Problem**:
- Cart clears with 100ms setTimeout
- If user navigates away quickly, cart might not clear
- Or cart might clear before success screen fully renders

**Fix**: Clear cart synchronously after navigation or use proper state management

### 6. **No Loading State Between Login and Checkout** ⚠️ MEDIUM
**Problem**:
- After login, user is redirected to checkout
- Checkout page loads profile from server
- Brief moment where profile might not be loaded yet
- Can show empty form then populate it (glitch)

**Fix**: Add loading state or use client-side profile fetch

### 7. **Form State Not Reset on Error** ⚠️ LOW
**Location**: `src/app/checkout/CartCheckout.tsx`

**Problem**:
- When order fails, lock.current is set to false
- But form state remains in error state
- User might see stale error messages

**Fix**: Add error state cleanup

### 8. **Missing Error Boundaries** ⚠️ MEDIUM
**Problem**:
- No error boundaries around auth/checkout flows
- If Supabase call fails, entire page crashes
- User sees blank screen or error page

**Fix**: Add error boundaries with fallback UI

### 9. **Supabase Session Not Refreshed** ⚠️ HIGH
**Problem**:
- Login page checks session once on mount
- If session expires during checkout, user gets kicked out
- No session refresh logic

**Fix**: Add session refresh or handle expired sessions gracefully

### 10. **Google OAuth Redirect Loop** ⚠️ MEDIUM
**Location**: `src/app/auth/login/page.tsx` - line 165

**Problem**:
- Google OAuth redirects to `/auth/login?next=...`
- Login page checks session and might redirect again
- Can create redirect loop if profile is incomplete

**Fix**: Add OAuth callback handler that bypasses session check

## Flow Analysis

### Current Login Flow (with issues):
```
1. User clicks "Login to Continue"
2. → /auth/login?next=/checkout
3. LoginPage mounts
4. useEffect runs → checks session (might be stale)
5. If logged in → checks profile → redirects
6. User fills form → submits
7. handleLogin → checks profile again (duplicate)
8. router.replace(next) → while component mounted
9. → /checkout (server component)
10. Checkout loads profile from server (3rd time!)
11. Might show empty form briefly
12. Form populates → glitch visible
```

### Issues in Flow:
- **3 profile checks** (useEffect, handleLogin, checkout page)
- **2 redirects** (router.replace, server redirect)
- **Race conditions** between profile checks
- **Stale closures** in useEffect
- **Loading states** not properly managed

### Current Checkout Flow (with issues):
```
1. User on /checkout
2. Fills form → submits
3. setState('loading')
4. createOrderWithCoupon (server action)
5. If success:
   - setOrderId
   - setFinalTotal
   - setState('success')
   - setTimeout(() => clearCart(), 100)
6. Success screen renders
7. Cart clears after 100ms
```

### Issues in Flow:
- **setTimeout** is unreliable
- **Cart might clear** before user sees success
- **No error recovery** if order succeeds but cart clear fails
- **Lock not released** properly on all error paths

## Recommended Fixes

### Priority 1 (Critical - Fix Immediately):
1. ✅ Fix useEffect dependencies in login page
2. ✅ Remove duplicate profile checks
3. ✅ Fix router.replace timing issues
4. ✅ Add session refresh logic

### Priority 2 (High - Fix Soon):
5. ✅ Consolidate profile checking
6. ✅ Add proper loading states
7. ✅ Fix cart clear timing
8. ✅ Add error boundaries

### Priority 3 (Medium - Fix Later):
9. ✅ Improve OAuth flow
10. ✅ Add better error messages
11. ✅ Add retry logic for failed requests

## Testing Scenarios to Reproduce Glitches

### Scenario 1: Login Redirect Loop
1. Add item to cart
2. Click checkout (not logged in)
3. Redirected to login
4. Login with incomplete profile
5. Fill address form
6. Submit
7. **GLITCH**: Might redirect to home or loop back to login

### Scenario 2: Cart Disappears
1. Add items to cart
2. Click checkout (not logged in)
3. Login
4. **GLITCH**: Cart appears empty briefly
5. Refresh page
6. Cart items reappear

### Scenario 3: Form Flashing
1. Login with complete profile
2. Go to checkout
3. **GLITCH**: Form shows empty then populates
4. Visual flash/jump

### Scenario 4: Order Success Glitch
1. Place order
2. **GLITCH**: Success screen shows briefly
3. Cart clears
4. Screen jumps/flashes

### Scenario 5: Session Expired
1. Add items to cart
2. Wait 1 hour (session expires)
3. Click checkout
4. **GLITCH**: Redirected but cart state lost
5. Have to start over

## Root Causes

1. **Too many redirects** - Login → Address → Checkout
2. **Multiple profile fetches** - Client + Server
3. **State management issues** - Cart, auth, form state not synchronized
4. **Timing issues** - setTimeout, router.replace, async operations
5. **No error recovery** - Failed operations leave app in bad state

## Solution Architecture

### Proposed Flow (Fixed):
```
1. User clicks "Login to Continue"
2. → /auth/login?next=/checkout
3. LoginPage mounts
4. Check session ONCE with proper dependencies
5. If logged in + complete profile → redirect immediately (no render)
6. If logged in + incomplete → show address form (no redirect)
7. User submits → save profile → redirect to next
8. Checkout page (client component)
9. Fetch profile client-side (cached)
10. Pre-fill form (no flash)
11. Submit order
12. On success → navigate to order page (cart clears on unmount)
```

### Benefits:
- **1 profile check** instead of 3
- **1 redirect** instead of 2
- **No race conditions**
- **Proper loading states**
- **No visual glitches**
