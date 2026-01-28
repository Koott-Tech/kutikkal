/**
 * PostHog utility functions
 * Use this to access PostHog throughout your application
 */

import posthog from 'posthog-js'

/**
 * Check if PostHog is loaded and available
 */
export function isPostHogLoaded() {
  return typeof window !== 'undefined' && posthog.__loaded
}

/**
 * Capture a custom event
 * @param {string} eventName - Name of the event
 * @param {object} properties - Additional properties to send with the event
 */
export function captureEvent(eventName, properties = {}) {
  if (isPostHogLoaded()) {
    posthog.capture(eventName, properties)
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[PostHog] Event not captured (PostHog not loaded):', eventName, properties)
  }
}

/**
 * Identify a user
 * @param {string} distinctId - Unique identifier for the user
 * @param {object} properties - User properties
 */
export function identifyUser(distinctId, properties = {}) {
  if (isPostHogLoaded()) {
    posthog.identify(distinctId, properties)
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[PostHog] User not identified (PostHog not loaded):', distinctId, properties)
  }
}

/**
 * Reset user identification (on logout)
 */
export function resetUser() {
  if (isPostHogLoaded()) {
    posthog.reset()
  }
}

/**
 * Set user properties
 * @param {object} properties - Properties to set
 */
export function setUserProperties(properties) {
  if (isPostHogLoaded()) {
    posthog.setPersonProperties(properties)
  }
}

/**
 * Get PostHog instance (use with caution)
 */
export function getPostHog() {
  if (isPostHogLoaded()) {
    return posthog
  }
  return null
}
