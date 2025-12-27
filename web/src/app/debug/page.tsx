'use client'

import {
  Button,
  Card,
  InlineStack,
  Page,
  Text,
  BlockStack,
} from '@shopify/polaris'
import { useRouter } from 'next/navigation'

const DebugPage = () => {
  const router = useRouter()

  return (
    <>
      <Page
        title="Debug Cards"
        subtitle="Interact and explore the current installation"
        backAction={{ onAction: () => router.back() }}
      >

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Scopes
              </Text>
              <div className="flex-1">
                <Text as="p">
                  Explore what scopes are registered and how to ask for optional
                  scopes
                </Text>
              </div>
              <InlineStack wrap={false} align="end">
                <Button
                  variant="primary"
                  onClick={() => {
                    router?.push('/debug/scopes')
                  }}
                >
                  Explore
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Data Fetching
              </Text>
              <Text as="p">
                Send GET, POST and GraphQL queries to your app's backend.
                <br />
                <br />
              </Text>
              <InlineStack wrap={false} align="end">
                <Button
                  variant="primary"
                  onClick={() => {
                    router?.push('/debug/data')
                  }}
                >
                  Explore
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Billing API
              </Text>
              <Text as="p">
                Subscribe merchant to a plan and explore existing plans.
              </Text>
              <InlineStack wrap={false} align="end">
                <Button
                  variant="primary"
                  onClick={() => {
                    router?.push('/debug/billing')
                  }}
                >
                  Cha-Ching
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resource Picker
              </Text>
              <Text as="p">See how to use AppBridge CDN's Resource Picker</Text>
              <InlineStack wrap={false} align="end">
                <Button
                  variant="primary"
                  onClick={() => {
                    router?.push('/debug/resource-picker')
                  }}
                >
                  Explore
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </div>

      </Page>
    </>
  )
}

export default DebugPage
