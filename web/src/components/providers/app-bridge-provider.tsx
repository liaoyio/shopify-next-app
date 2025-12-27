import React from 'react'

export default function AppBridgeProvider({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    const shop = window?.shopify?.config?.shop
    if (!shop) {
      return <p>No Shop Provided</p>
    }
  }
  return <>{children}</>
}
