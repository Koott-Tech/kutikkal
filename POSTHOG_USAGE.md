# PostHog Integration Guide

PostHog has been successfully integrated into your Next.js application. This guide shows you how to use it.

## Basic Usage

### Import PostHog utilities

```javascript
import { captureEvent, identifyUser, resetUser, setUserProperties } from '@/lib/posthog'
```

### Capture Custom Events

```javascript
'use client'

import { captureEvent } from '@/lib/posthog'

export default function CheckoutPage() {
  function handlePurchase() {
    captureEvent('purchase_completed', { 
      amount: 99,
      currency: 'INR',
      product_id: 'session_package'
    })
  }

  return <button onClick={handlePurchase}>Complete purchase</button>
}
```

### Identify Users

When a user logs in, identify them:

```javascript
import { identifyUser } from '@/lib/posthog'

// After successful login
identifyUser(user.id, {
  email: user.email,
  name: user.name,
  role: user.role
})
```

### Reset User (on Logout)

```javascript
import { resetUser } from '@/lib/posthog'

// On logout
resetUser()
```

### Set User Properties

```javascript
import { setUserProperties } from '@/lib/posthog'

// Update user properties
setUserProperties({
  subscription_plan: 'premium',
  last_login: new Date().toISOString()
})
```

## Direct PostHog Access

If you need direct access to PostHog:

```javascript
'use client'

import posthog from 'posthog-js'

export default function MyComponent() {
  function handleClick() {
    if (posthog.__loaded) {
      posthog.capture('button_clicked', { button_name: 'cta' })
    }
  }

  return <button onClick={handleClick}>Click me</button>
}
```

## Automatic Tracking

PostHog automatically tracks:
- ✅ Pageviews (on route changes)
- ✅ Page leaves
- ✅ Clicks (if enabled)
- ✅ Form submissions (if enabled)

## Environment Variables

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_gzv7EhWHIuuDyceiYSHU6X9pae5KxjbzOGJpEkzIc5Z
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001/api
```

### Optional: Production Backend Domain

For production, you can optionally set a specific backend domain for tracing headers:

```
NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN=api.little.care
```

This is useful if your production backend domain differs from the development backend URL.

## Session ID Tracing

PostHog is configured to automatically send session IDs on requests to your backend. The backend domain is automatically extracted from `NEXT_PUBLIC_BACKEND_URL`. 

The session ID will be sent in HTTP headers on every request to your backend, allowing you to:
- Correlate frontend events with backend events
- Track user journeys across frontend and backend
- Debug issues by tracing requests end-to-end

### Backend Integration

To extract the session ID in your backend, look for the `X-PostHog-Session-ID` header in incoming requests.

## Common Use Cases

### Track Button Clicks

```javascript
import { captureEvent } from '@/lib/posthog'

<button onClick={() => captureEvent('cta_clicked', { location: 'hero' })}>
  Book Session
</button>
```

### Track Form Submissions

```javascript
import { captureEvent } from '@/lib/posthog'

const handleSubmit = async (data) => {
  captureEvent('form_submitted', {
    form_name: 'contact_form',
    form_location: 'footer'
  })
  // ... rest of form logic
}
```

### Track Conversions

```javascript
import { captureEvent } from '@/lib/posthog'

const handleBookingComplete = () => {
  captureEvent('session_booked', {
    psychologist_id: session.psychologist_id,
    session_type: session.type,
    amount: session.price
  })
}
```

## Testing

In development mode, PostHog will log to console when events are captured. Check your browser console to verify events are being sent.

## PostHog Dashboard

Visit your PostHog dashboard to see:
- Real-time events
- User sessions
- Funnels
- Feature flags
- A/B tests
