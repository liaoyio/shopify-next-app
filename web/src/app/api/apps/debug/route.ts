import { jsonNoStore } from './_utils'

export async function GET() {
  return jsonNoStore({
    text: 'This text is coming from `/api/apps/debug` route',
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  return jsonNoStore(body ?? { text: 'Bad request in POST 😉' }, { status: body ? 200 : 400 })
}
