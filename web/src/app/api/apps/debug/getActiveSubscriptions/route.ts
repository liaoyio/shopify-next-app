import { getGraphqlClient, jsonNoStore } from '../_utils'

export async function GET(req: Request) {
  try {
    const { client } = await getGraphqlClient(req, false)
    const { data, errors } = await client.request(/* GraphQL */ `
      {
        appInstallation {
          activeSubscriptions {
            name
            status
            lineItems {
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    __typename
                    price {
                      amount
                      currencyCode
                    }
                    interval
                  }
                }
              }
            }
            test
          }
        }
      }
    `)

    return jsonNoStore({ data, errors: errors ?? null })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const status = message.includes('bearer') || message.includes('token')
      ? 401
      : 500
    return jsonNoStore({ error: message }, { status })
  }
}
