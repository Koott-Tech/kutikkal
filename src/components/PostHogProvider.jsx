'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

export function PostHogProvider({ children }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize PostHog only on client side
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      // Extract backend domain(s) for tracing headers
      const getBackendDomains = () => {
        const domains = new Set() // Use Set to avoid duplicates
        
        // Get backend URL from environment
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        
        if (backendUrl) {
          try {
            // Remove /api suffix if present and extract domain
            const urlWithoutApi = backendUrl.replace(/\/api\/?$/, '')
            const url = new URL(urlWithoutApi)
            // Add domain (hostname:port or just hostname)
            const domain = url.port ? `${url.hostname}:${url.port}` : url.hostname
            domains.add(domain)
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[PostHog] Backend domain for tracing:', domain)
            }
          } catch (error) {
            console.warn('[PostHog] Failed to parse backend URL:', error)
          }
        }
        
        // Add production backend domain from environment if set
        // You can set NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN in production
        const productionBackendDomain = process.env.NEXT_PUBLIC_POSTHOG_BACKEND_DOMAIN
        if (productionBackendDomain) {
          domains.add(productionBackendDomain)
        }
        
        // Convert Set to Array
        return Array.from(domains)
      }

      const backendDomains = getBackendDomains()

      const posthogConfig = {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        // Enable automatic pageview tracking
        capture_pageview: true,
        // Capture pageleave automatically
        capture_pageleave: true,
        // Enable tracing headers to send session ID on requests to backend
        ...(backendDomains.length > 0 && {
          __add_tracing_headers: backendDomains
        }),
        // Callback when PostHog is loaded
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[PostHog] Initialized with tracing headers for:', backendDomains)
          }
        },
      }

      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, posthogConfig)
    }
  }, [])

  useEffect(() => {
    // Track pageviews on route changes
    if (pathname && typeof window !== 'undefined') {
      // Wait a bit for PostHog to be ready
      const timer = setTimeout(() => {
        if (posthog.__loaded) {
          let url = window.origin + pathname
          if (searchParams && searchParams.toString()) {
            url = url + `?${searchParams.toString()}`
          }
          posthog.capture('$pageview', {
            $current_url: url,
          })
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return children
}
