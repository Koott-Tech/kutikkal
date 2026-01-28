# Production Environment Variables Setup

This guide lists all environment variables needed for production deployment, including PostHog configuration.

## Required PostHog Environment Variables

### ✅ Already Set (Same for Dev & Production)
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_gzv7EhWHIuuDyceiYSHU6X9pae5KxjbzOGJpEkzIc5Z
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 🔧 Required for Production (Update These)

```env
# Production Backend URL (replace with your actual production backend)
NEXT_PUBLIC_BACKEND_URL=https://api.little.care/api
# OR if your backend is on a different domain:
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com/api
```

### 📋 Optional (Recommended for Production)

```env
# If your backend domain differs from NEXT_PUBLIC_BACKEND_URL, set this explicitly
# This ensures PostHog tracing headers work correctly
NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN=api.little.care
# OR just the domain without protocol:
NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN=your-backend-domain.com
```

## Complete Production Environment Variables Checklist

### PostHog Analytics
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_gzv7EhWHIuuDyceiYSHU6X9pae5KxjbzOGJpEkzIc5Z
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_BACKEND_URL=https://api.little.care/api
NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN=api.little.care  # Optional but recommended
```

### Application URLs
```env
NEXT_PUBLIC_APP_URL=https://www.little.care
FRONTEND_URL=https://www.little.care
NEXT_PUBLIC_BACKEND_URL=https://api.little.care/api
```

### Supabase (Keep same as dev)
```env
NEXT_PUBLIC_SUPABASE_URL=https://iylutfwntoqcnqnjdnnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Google OAuth (Update redirect URI for production)
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=975865953640-jkq9nnnislieekmoepvd6gij6ua9fgbs.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://www.little.care/auth/google-calendar/callback
```

### Environment
```env
NODE_ENV=production
```

## How PostHog Tracing Headers Work in Production

1. **Automatic Domain Extraction**: PostHog automatically extracts the backend domain from `NEXT_PUBLIC_BACKEND_URL`
   - Example: `https://api.little.care/api` → extracts `api.little.care`

2. **Additional Domain Support**: If you set `NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN`, it will be added to the tracing headers
   - Useful if you have multiple backend domains or subdomains

3. **Session ID Header**: PostHog will automatically add `X-PostHog-Session-ID` header to all requests to your backend domain(s)

## Example Production .env File

```env
# Environment
NODE_ENV=production

# Application URLs
NEXT_PUBLIC_APP_URL=https://www.little.care
FRONTEND_URL=https://www.little.care
NEXT_PUBLIC_BACKEND_URL=https://api.little.care/api

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_gzv7EhWHIuuDyceiYSHU6X9pae5KxjbzOGJpEkzIc5Z
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN=api.little.care

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://iylutfwntoqcnqnjdnnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=975865953640-jkq9nnnislieekmoepvd6gij6ua9fgbs.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://www.little.care/auth/google-calendar/callback

# App Name
NEXT_PUBLIC_APP_NAME=Little Care
```

## Vercel Deployment

If deploying to Vercel, add these in your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all variables listed above
3. Make sure to set them for **Production** environment
4. Optionally set for **Preview** and **Development** if needed

## Verification Steps

After deploying to production:

1. **Check PostHog Initialization**:
   - Open browser console on production site
   - Look for: `[PostHog] Backend domain for tracing: api.little.care` (or your domain)

2. **Verify Tracing Headers**:
   - Open Network tab in browser DevTools
   - Make an API request to your backend
   - Check request headers for `X-PostHog-Session-ID` header

3. **Check PostHog Dashboard**:
   - Visit your PostHog dashboard
   - Verify events are being captured
   - Check that session IDs are being tracked

## Troubleshooting

### PostHog not sending session IDs?
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check that the domain matches exactly (including subdomain)
- Ensure `NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN` is set if backend domain differs

### Backend not receiving headers?
- Verify CORS settings allow the `X-PostHog-Session-ID` header
- Check that your backend is on the domain specified in tracing headers
- Ensure backend can read custom headers

### Multiple backend domains?
- Set `NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN` with comma-separated domains
- Or update the code to support multiple domains in the array

## Notes

- All `NEXT_PUBLIC_*` variables are exposed to the browser (client-side)
- Never put sensitive keys in `NEXT_PUBLIC_*` variables
- PostHog key and host are safe to expose (they're public by design)
- Backend domain is extracted automatically, but you can override with `NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN`
