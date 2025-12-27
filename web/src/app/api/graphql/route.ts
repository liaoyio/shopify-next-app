import shopify from '@/server/shopify/initialize-context'
import { verifyRequest } from '@/server/shopify/verify'
import { NextResponse } from 'next/server'

type GraphQLProxyBody = {
  query: string
  variables?: Record<string, unknown>
}

export async function POST(req: Request) {
  try {
    const { session } = await verifyRequest(req, true)

    const body = (await req.json()) as Partial<GraphQLProxyBody>
    if (!body?.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Missing `query` (string) in request body.' },
        { status: 400 },
      )
    }

    const client = new shopify.clients.Graphql({ session })
    const { data, errors } = await client.request(body.query, {
      variables: body.variables,
    })

    return NextResponse.json(
      { data, errors: errors ?? null },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('bearer') || message.includes('token')
      ? 401
      : 500
    return NextResponse.json({ error: message }, { status })
  }
}
