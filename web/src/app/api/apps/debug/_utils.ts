import shopify from '@/server/shopify/initialize-context'
import { verifyRequest } from '@/server/shopify/verify'
import { NextResponse } from 'next/server'

export async function getGraphqlClient(req: Request, isOnline: boolean) {
  const { shop, session } = await verifyRequest(req, isOnline)
  const client = new shopify.clients.Graphql({ session })
  return { shop, session, client }
}

export function jsonNoStore<T>(data: T, init?: ResponseInit) {
  const headers = new Headers(init?.headers)
  headers.set('Cache-Control', 'no-store')
  return NextResponse.json(data, { ...init, headers })
}

export function ensureUrlWithScheme(url: string) {
  if (url.startsWith('https://') || url.startsWith('http://')) return url
  return `https://${url}`
}
// EOF
