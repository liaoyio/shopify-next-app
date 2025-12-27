import '@shopify/shopify-api/adapters/web-api'
import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api'

const isDev = process.env.NODE_ENV === 'development'

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: process.env.SCOPES?.split(',') || ['write_products'],
  hostName: process.env.HOST?.replace(/https?:\/\//, '') || '',
  hostScheme: 'https',
  isEmbeddedApp: true,
  apiVersion: ApiVersion.October25,
  logger: {
    // LogSeverity.Debug
    level: isDev ? LogSeverity.Info : LogSeverity.Error,
  },
})

export default shopify
