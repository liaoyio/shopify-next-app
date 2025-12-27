import { ensureUrlWithScheme, getGraphqlClient, jsonNoStore } from '../_utils'

type Body = {
  planName?: string
  planPrice?: number
  test?: boolean
}

function getAppBaseUrl(req: Request) {
  const envUrl = process.env.SHOPIFY_APP_URL || process.env.HOST
  if (envUrl) return ensureUrlWithScheme(envUrl)
  return new URL(req.url).origin
}

export async function GET(req: Request) {
  return handle(req)
}

export async function POST(req: Request) {
  return handle(req)
}

async function handle(req: Request) {
  try {
    const { client, shop } = await getGraphqlClient(req, false)

    const body = (await req.json().catch(() => ({}))) as Body

    const returnUrl = `${getAppBaseUrl(req)}/?shop=${shop}`
    const planName = body.planName ?? '$10.25 plan'
    const planPrice = body.planPrice ?? 10.25 // Always a decimal
    const test = body.test ?? true

    const { data, errors } = await client.request(
      /* GraphQL */ `
        mutation CreateSubscription(
          $name: String!
          $lineItems: [AppSubscriptionLineItemInput!]!
          $returnUrl: URL!
          $test: Boolean
        ) {
          appSubscriptionCreate(
            name: $name
            returnUrl: $returnUrl
            lineItems: $lineItems
            test: $test
          ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
              status
            }
          }
        }
      `,
      {
        variables: {
          name: planName,
          returnUrl,
          test,
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: {
                    amount: planPrice,
                    currencyCode: 'USD',
                  },
                  interval: 'EVERY_30_DAYS',
                },
              },
            },
          ],
        },
      },
    )

    if (errors) {
      return jsonNoStore({ error: 'An error occured.', errors }, { status: 400 })
    }

    const userErrors = (data as any)?.appSubscriptionCreate?.userErrors ?? []
    if (Array.isArray(userErrors) && userErrors.length > 0) {
      console.error(`--> Error subscribing ${shop} to plan:`, userErrors)
      return jsonNoStore({ error: 'An error occured.', userErrors }, { status: 400 })
    }

    const confirmationUrl = (data as any)?.appSubscriptionCreate?.confirmationUrl
    return jsonNoStore({ confirmationUrl: `${confirmationUrl}` })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('bearer') || message.includes('token')
      ? 401
      : 500
    return jsonNoStore({ error: message }, { status })
  }
}
