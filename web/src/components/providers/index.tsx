'use client'

import { AppProvider } from '@shopify/polaris'
import '@shopify/polaris/build/esm/styles.css'
import translations from '@shopify/polaris/locales/en.json'
import { NavMenu } from '@shopify/app-bridge-react'
import Link from 'next/link'
import SessionProvider from './session-provider'
import { TanstackProvider } from './tanstack-provider'
import AppBridgeProvider from './app-bridge-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={translations}>
      <AppBridgeProvider>
        <NavMenu>
          <Link href="/debug">Debug Page</Link>
          <Link href="/new">New Page</Link>
        </NavMenu>
        <TanstackProvider>
          <SessionProvider>{children}</SessionProvider>
        </TanstackProvider>
      </AppBridgeProvider>
    </AppProvider>
  )
}
