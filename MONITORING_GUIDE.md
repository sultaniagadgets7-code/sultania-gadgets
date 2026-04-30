# Production Monitoring Guide

## Quick Health Check

### 1. Check Website Status
```bash
curl -I https://sultaniagadgets.com
# Should return: HTTP/2 200
```

### 2. Check Database Connections (Supabase Dashboard)
- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/database
- Check: Active connections < 50 (out of 60 max)
- Alert if: > 50 connections

### 3. Check Response Times (Vercel Dashboard)
- Go to: https://vercel.com/dashboard
- Check: Average response time < 2s
- Alert if: > 3s

## Critical Metrics to Monitor

### Database Metrics (Supabase)

#### Connection Count
```sql
-- Run in Supabase SQL Editor
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE state = 'active';
```
- **Good**: < 30 connections
- **Warning**: 30-50 connections
- **Critical**: > 50 connections

#### Slow Queries
```sql
-- Find queries taking > 1 second
SELECT 
  query,
  calls,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC
LIMIT 10;
```

#### Database Size
```sql
-- Check storage usage
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as size;
```
- **Free Tier Limit**: 500 MB
- **Alert if**: > 400 MB

#### Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Application Metrics (Vercel)

#### Response Times
- **Homepage**: < 1s
- **Product Pages**: < 1.5s
- **Checkout**: < 2s
- **API Routes**: < 500ms

#### Error Rate
- **Target**: < 1%
- **Alert if**: > 5%

#### Bandwidth Usage
- **Free Tier**: 100 GB/month
- **Alert if**: > 80 GB/month

### User Metrics (Google Analytics)

#### Conversion Funnel
1. **Homepage Views**: 100%
2. **Product Views**: ~60%
3. **Add to Cart**: ~30%
4. **Checkout Started**: ~15%
5. **Order Completed**: ~10%

#### Cart Abandonment
- **Target**: < 70%
- **Alert if**: > 80%

#### Page Load Time
- **Target**: < 3s
- **Alert if**: > 5s

## Monitoring Tools Setup

### 1. Vercel Analytics (Built-in)
Already enabled, check at:
https://vercel.com/dashboard/analytics

**Metrics**:
- Page views
- Unique visitors
- Response times
- Error rates

### 2. Supabase Dashboard
Check at:
https://supabase.com/dashboard/project/YOUR_PROJECT

**Metrics**:
- Database connections
- Query performance
- Storage usage
- API requests

### 3. Google Analytics (Recommended)
Add to `src/app/layout.tsx`:

```typescript
// Add Google Analytics
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### 4. Sentry (Error Tracking)
Install:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Configure in `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

## Alert Thresholds

### 🔴 Critical Alerts (Immediate Action)

1. **Database Connections > 55**
   - Action: Investigate connection leaks
   - Solution: Restart app, check for unclosed connections

2. **Error Rate > 10%**
   - Action: Check error logs
   - Solution: Rollback deployment if needed

3. **Response Time > 5s**
   - Action: Check database performance
   - Solution: Clear cache, optimize queries

4. **Website Down**
   - Action: Check Vercel status
   - Solution: Redeploy if needed

### 🟡 Warning Alerts (Monitor Closely)

1. **Database Connections > 40**
   - Action: Monitor connection usage
   - Solution: Consider upgrading plan

2. **Error Rate > 5%**
   - Action: Review error logs
   - Solution: Fix bugs in next deployment

3. **Response Time > 3s**
   - Action: Check slow queries
   - Solution: Optimize queries, add caching

4. **Storage > 400 MB**
   - Action: Clean up old data
   - Solution: Archive old orders, optimize images

### 🟢 Info Alerts (Good to Know)

1. **Traffic Spike**
   - Action: Monitor performance
   - Solution: Celebrate! 🎉

2. **New User Signup**
   - Action: Track conversion
   - Solution: Send welcome email

3. **Order Placed**
   - Action: Process order
   - Solution: Send confirmation

## Daily Checklist

### Morning Check (5 minutes)
- [ ] Check Vercel dashboard for errors
- [ ] Check Supabase connections
- [ ] Review overnight orders
- [ ] Check website loads correctly

### Weekly Check (15 minutes)
- [ ] Review error logs
- [ ] Check slow queries
- [ ] Review user feedback
- [ ] Check storage usage
- [ ] Review conversion rates

### Monthly Check (30 minutes)
- [ ] Review analytics trends
- [ ] Check bandwidth usage
- [ ] Review database size
- [ ] Plan optimizations
- [ ] Review upgrade needs

## Performance Benchmarks

### Current Performance (Baseline)
- **Homepage Load**: ~1.2s
- **Product Page Load**: ~1.5s
- **Checkout Load**: ~1.8s
- **Database Queries**: 9 on homepage
- **ISR Cache Hit Rate**: ~95%

### Target Performance
- **Homepage Load**: < 1s
- **Product Page Load**: < 1.5s
- **Checkout Load**: < 2s
- **Database Queries**: < 10 per page
- **ISR Cache Hit Rate**: > 90%

## Troubleshooting Guide

### Issue: Slow Page Loads

**Diagnosis**:
1. Check Vercel response times
2. Check database query times
3. Check ISR cache hit rate

**Solutions**:
- Clear ISR cache: Redeploy
- Optimize slow queries
- Add more caching
- Upgrade database plan

### Issue: High Error Rate

**Diagnosis**:
1. Check error logs in Vercel
2. Check Sentry for error details
3. Check database errors

**Solutions**:
- Fix bugs in code
- Add error handling
- Rollback deployment
- Check database connection

### Issue: Database Connection Errors

**Diagnosis**:
1. Check active connections
2. Check for connection leaks
3. Check query performance

**Solutions**:
- Close unused connections
- Add connection pooling
- Optimize queries
- Upgrade database plan

### Issue: Out of Storage

**Diagnosis**:
1. Check table sizes
2. Check image storage
3. Check old data

**Solutions**:
- Archive old orders
- Optimize images
- Clean up test data
- Upgrade storage plan

## Scaling Triggers

### When to Upgrade Supabase

**Trigger**: Any of these conditions
- Connections > 50 consistently
- Storage > 450 MB
- Bandwidth > 4.5 GB/month
- Query performance degrading

**Action**: Upgrade to Pro plan ($25/month)
- 500 connections
- 8 GB storage
- 250 GB bandwidth
- Better performance

### When to Upgrade Vercel

**Trigger**: Any of these conditions
- Bandwidth > 90 GB/month
- Need team collaboration
- Need advanced analytics

**Action**: Upgrade to Pro plan ($20/month)
- 1 TB bandwidth
- Team features
- Advanced analytics
- Priority support

### When to Add Redis/KV

**Trigger**: Any of these conditions
- Traffic > 1,000 users/day
- Database queries > 50,000/day
- Response times > 2s consistently

**Action**: Add Vercel KV ($10/month)
- Query caching
- Session storage
- Rate limiting
- Better performance

## Emergency Contacts

### Vercel Support
- Dashboard: https://vercel.com/support
- Status: https://vercel-status.com
- Docs: https://vercel.com/docs

### Supabase Support
- Dashboard: https://supabase.com/dashboard/support
- Status: https://status.supabase.com
- Docs: https://supabase.com/docs

### Community
- Vercel Discord: https://vercel.com/discord
- Supabase Discord: https://discord.supabase.com

## Summary

### Current Status: ✅ Healthy

Your app is well-monitored and ready for production with:
- Built-in Vercel analytics
- Supabase dashboard metrics
- Proper indexes for performance
- ISR caching reducing load

### Recommended Additions:
1. Google Analytics (user behavior)
2. Sentry (error tracking)
3. Uptime monitoring (UptimeRobot)
4. Performance monitoring (Lighthouse CI)

### When to Act:
- **Now**: Set up basic monitoring
- **Soon**: Add Google Analytics
- **Later**: Add Sentry for errors
- **As Needed**: Upgrade plans when limits reached

Monitor daily, review weekly, optimize monthly!
