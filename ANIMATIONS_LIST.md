# Website Animations List

## Animation Library Used

**Primary Library: Framer Motion v12.23.12**
- Package: `framer-motion`
- Location: `frontend/package.json`

---

## 1. Framer Motion Animations

### Payment Success Page (`/app/payment/success/page.js`)

#### Success Checkmark Animation
- **Type**: Scale + Opacity + Path Drawing
- **Components**: 
  - `motion.div` - Checkmark circle container (scale 0→1, opacity 0→1)
  - `motion.circle` - Outer circle (pathLength animation)
  - `motion.path` - Checkmark path (pathLength animation)
  - `motion.svg` - SVG container
- **Transition**: Spring animation (stiffness: 200, damping: 15)
- **Duration**: 0.6s for container, 0.4s for circle, 0.3s for checkmark

#### Confetti Particles Animation
- **Type**: Position + Scale + Opacity + Rotation
- **Components**: 20 `motion.div` particles
- **Animation**: 
  - Initial: x:0, y:0, scale:0, opacity:1, rotate:0
  - Animate: x/y movement, scale [0,1,0.8,0], opacity [1,1,0.8,0], rotate:360
- **Duration**: 0.8s with random delays (0-0.3s)
- **Easing**: easeOut

#### Sliding Success Animation
- **Type**: Position + Scale
- **Component**: `motion.div` sliding from center to top
- **Animation**: Fixed center → Fixed top (140px) with scale 0.8
- **Duration**: 0.6s
- **Easing**: Custom cubic-bezier [0.4, 0, 0.2, 1]

#### Content Fade-in Animations
- **Type**: Opacity + Y translation
- **Components**: Multiple `motion.div` elements
- **Delays**: 0.2s, 0.4s, 0.6s, 0.75s, 0.8s (staggered)
- **Duration**: 0.3s - 0.5s

#### Loading Spinner
- **Type**: CSS @keyframes rotation
- **Animation**: `spin 0.8s linear infinite`

---

### Therapist Profile Page (`/app/therapist-profile/page.js`)

#### Booking Loading Animation
- **Type**: Scale + Opacity + Path Drawing
- **Component**: Calendar icon with animated drawing
- **Features**:
  - Calendar box path drawing (0.6s)
  - Calendar hooks path drawing (0.3s each, staggered)
  - Pulsing circle (infinite reverse animation)
- **Duration**: Various (0.3s - 0.6s)

#### Animated Dots Loading
- **Type**: Opacity + Y translation
- **Component**: Three dots with staggered animation
- **Animation**: opacity [0.3, 1, 0.3], y [0, -8, 0]
- **Duration**: 1.2s infinite
- **Stagger**: 0.2s delay between dots

---

### Free Assessment Page (`/app/free-assessment/page.js`)

#### Success Animation (Same as Payment Success)
- **Type**: Checkmark + Confetti particles
- **Components**: Same as payment success page

---

## 2. CSS @keyframes Animations

### Loading Screen (`/components/LoadingScreen.jsx`)

#### Pulse Scale Animation
- **Name**: `pulseScale`
- **Type**: Scale + Opacity
- **Animation**: 
  - 0%: scale(1), opacity 0.9
  - 50%: scale(1.05), opacity 1
  - 100%: scale(1), opacity 0.9
- **Duration**: 2s
- **Timing**: ease-in-out infinite
- **Usage**: Logo pulsing animation
- **Library**: CSS @keyframes (no external library)
- **Component Details**:
  - Full-screen overlay (z-index: 9999)
  - White background (#ffffff)
  - Centered logo (`/mainlogo.webp`)
  - Optional message prop for custom text
  - Responsive: 240x79px (desktop), 200x66px (mobile)
- **Where Used**:
  1. **PageLoadingOverlay** (`/components/PageLoadingOverlay.jsx`)
     - Shows on every route change
     - Auto-hides after 600ms
     - Used globally in `app/layout.js`
  2. **Next.js Loading** (`/app/loading.js`)
     - Next.js built-in loading state
  3. **Psychologists Page** (`/app/psychologists/page.js`)
     - Shows while fetching psychologist data
  4. **Payment Success Page** (`/app/payment/success/page.js`)
     - Custom loading state management

---

### Click Burst Animation (`/components/ClickBurst.jsx`)

#### Click Burst Drift
- **Name**: `clickBurstDrift`
- **Type**: Position + Scale + Opacity
- **Animation**:
  - 0%: opacity 0.9, scale(1), translate(0,0)
  - 80%: opacity 0.35
  - 100%: opacity 0, scale(1.15), translate(dx, dy)
- **Duration**: 1150ms
- **Timing**: ease-out
- **Usage**: Click/touch burst effect with favicon icons

---

### Reviews Marquee (`/components/Reviews.jsx`)

#### Scroll Left Animation
- **Name**: `scroll-left`
- **Type**: Transform translateX
- **Animation**:
  - 0%: translateX(0)
  - 100%: translateX(-50%)
- **Duration**: 
  - Desktop: 90s
  - Mobile: 20s
- **Timing**: linear infinite
- **Usage**: Infinite horizontal scrolling marquee

---

### Logos Strip (`/components/LogosStrip.jsx`)

#### Scroll Left Animation
- **Name**: `scroll-left`
- **Type**: Transform translateX
- **Animation**:
  - 0%: translateX(0)
  - 100%: translateX(-50%)
- **Duration**: 20s
- **Timing**: linear infinite
- **Usage**: Logo marquee scrolling

---

### Testimonials (`/components/Testimonials.jsx`)

#### Testimonials Mobile Scroll
- **Name**: `testimonials-mobile-scroll`
- **Type**: Transform translateX
- **Animation**:
  - 0%: translateX(0)
  - 100%: translateX(-50%)
- **Duration**: 20s
- **Timing**: linear infinite
- **Usage**: Mobile testimonials marquee

---

### WhatsApp Widget (`/components/WhatsAppWidget.jsx`)

#### Slow Shake Animation
- **Name**: `whatsappSlowShake`
- **Type**: Transform + Rotation
- **Animation**: Gentle shake with rotation
  - 0%, 60%, 100%: translate3d(0,0,0) rotate(0deg)
  - 10%: translate3d(-3px,-2px,0) rotate(-2deg)
  - 20%: translate3d(3px,-1px,0) rotate(2deg)
  - 30%: translate3d(-2px,1px,0) rotate(-1.5deg)
  - 40%: translate3d(2px,2px,0) rotate(1.5deg)
- **Duration**: 6s
- **Timing**: ease-in-out infinite
- **Usage**: WhatsApp widget attention animation

---

### Doctor Modal (`/app/psychologists/page.js` & `/app/guide/page.js`)

#### Overlay Fade In/Out
- **Names**: `overlayFadeIn`, `overlayFadeOut`
- **Type**: Opacity
- **Animation**: 
  - FadeIn: opacity 0 → 1
  - FadeOut: opacity 1 → 0
- **Duration**: 200ms
- **Timing**: ease

#### Modal In/Out
- **Names**: `modalIn`, `modalOut`
- **Type**: Opacity + Transform
- **Animation**:
  - ModalIn: opacity 0→1, translateY(8px)→0, scale(0.98)→1
  - ModalOut: opacity 1→0, translateY(0)→8px, scale(1)→0.98
- **Duration**: 220ms (in), 200ms (out)
- **Timing**: ease

---

### Payment Success Spinner
- **Name**: `spin`
- **Type**: Rotation
- **Animation**: rotate(0deg) → rotate(360deg)
- **Duration**: 0.8s
- **Timing**: linear infinite
- **Usage**: Loading spinner

---

## 3. CSS Transitions

### Button Hover Effects
- **Type**: Background color transitions
- **Duration**: 0.2s - 0.3s
- **Usage**: 
  - Hero buttons (`Hero.jsx`)
  - Payment success buttons
  - Various interactive elements

### Underline Hover Effects
- **Type**: Width transition
- **Component**: "How does it work?" link
- **Animation**: width 0 → 100%
- **Duration**: 300ms
- **Timing**: ease-out

### General Transitions
- **Properties**: `transition-colors`, `transition-all`
- **Duration**: 200ms - 300ms
- **Usage**: Hover states, focus states, color changes

---

## Summary

### Animation Libraries:
1. **Framer Motion v12.23.12** - Primary animation library
   - Used for: Complex animations, page transitions, component animations
   - Components: `motion.div`, `motion.svg`, `AnimatePresence`

2. **CSS @keyframes** - Custom CSS animations
   - Used for: Simple animations, infinite loops, marquees
   - Animations: 8 custom @keyframes

3. **CSS Transitions** - Native CSS transitions
   - Used for: Hover effects, color changes, simple state changes

### Total Animations:
- **Framer Motion animations**: ~15+ unique animation patterns
- **CSS @keyframes**: 8 custom animations
- **CSS Transitions**: Multiple (hover, focus, color changes)

### Files Using Animations:
- Payment Success Page
- Therapist Profile Page
- Free Assessment Page
- Loading Screen Component
- Click Burst Component
- Reviews Component
- Logos Strip Component
- Testimonials Component
- WhatsApp Widget Component
- Doctor Modal (Psychologists & Guide pages)
- Hero Component (transitions)
