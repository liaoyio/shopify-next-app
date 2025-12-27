'use client'
import {
  Layout,
  Card,
  Page,
  BlockStack,
  Text,
  InlineStack,
  Button,
} from '@shopify/polaris'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type DataFetcherResult = readonly [data: string, fetchData: () => Promise<void>]

const useDataFetcher = (
  initialState: string,
  url: string,
  options?: RequestInit
): DataFetcherResult => {
  const [data, setData] = useState(initialState)

  const fetchData = async () => {
    setData('loading...')
    const result = await (await fetch(url, options)).json()
    setData(result.text)
  }

  return [data, fetchData] as const
}

const DataCard = ({
  method,
  url,
  data,
  onRefetch,
}: {
  method: string
  url: string
  data: string
  onRefetch: () => void | Promise<void>
}) => (
  <Layout.Section>
    <Card>
      <BlockStack gap="200">
        <Text as="p">
          {method}
          {' '}
          <code>{url}</code>
          :
          {' '}
          {data}
        </Text>
        <InlineStack align="end">
          <Button variant="primary" onClick={onRefetch}>
            Refetch
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  </Layout.Section>
)

const GetData = () => {
  const router = useRouter()

  const postOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ text: 'Body of POST request 🤓' }),
  }

  const [responseData, fetchContent] = useDataFetcher('', '/api/apps/debug')
  const [responseDataPost, fetchContentPost] = useDataFetcher(
    '',
    '/api/apps/debug',
    postOptions
  )
  const [responseDataGQL, fetchContentGQL] = useDataFetcher(
    '',
    '/api/apps/debug/gql'
  )

  useEffect(() => {
    fetchContent()
    fetchContentPost()
    fetchContentGQL()
  }, [])

  return (
    <Page
      title="Data Fetching"
      subtitle="Make an authenticated GET, POST and GraphQL request to the apps backend"
      backAction={{ onAction: () => router?.back() }}
    >
      <Layout>
        <DataCard
          method="GET"
          url="/api/apps/debug"
          data={responseData as string}
          onRefetch={fetchContent}
        />
        <DataCard
          method="POST"
          url="/api/apps/debug"
          data={responseDataPost as string}
          onRefetch={fetchContentPost}
        />
        <DataCard
          method="GET"
          url="/api/apps/debug/gql"
          data={responseDataGQL as string}
          onRefetch={fetchContentGQL}
        />
      </Layout>
    </Page>
  )
}

export default GetData
