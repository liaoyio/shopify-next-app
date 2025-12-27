import { getGraphqlClient, jsonNoStore } from '../_utils'

export async function GET(req: Request) {
  try {
    const { client } = await getGraphqlClient(req, true)
    const { data, errors } = await client.request(/* GraphQL */ `
      {
        shop {
          name
        }
      }
    `)

    if (errors) {
      return jsonNoStore({ text: 'Bad request', errors }, { status: 400 })
    }

    const name = (data as any)?.shop?.name
    return jsonNoStore({ text: name ?? '' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('bearer') || message.includes('token')
      ? 401
      : 500
    return jsonNoStore({ text: 'Bad request', error: message }, { status })
  }
}
// EOF
