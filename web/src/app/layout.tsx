import Providers from '@/components/providers'
import type { Metadata } from 'next'
import '@/css/globals.css'
import '@/css/tailwind.css'

export const metadata: Metadata = {
  title: 'Next.js Shopify App',
  other: {
    'shopify-api-key': process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '',
    'shopify-app-origins': process.env.NEXT_PUBLIC_HOST || '',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" />
        <script src="https://cdn.shopify.com/shopifycloud/polaris.js" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
