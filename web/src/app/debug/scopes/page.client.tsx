'use client'

/* eslint-disable no-alert */
import type { TableData } from '@shopify/polaris'
import { Card, DataTable, Layout, Page, Text } from '@shopify/polaris'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const OptionalScopes = () => {
  const router = useRouter()
  const [rows, setRows] = useState<TableData[][]>([])
  const [loading, setLoading] = useState(false)

  async function createRows() {
    const scopes = await window?.shopify?.scopes?.query()
    if (!scopes) return

    const rows: TableData[][] = [
      [<Text as="span" key="granted" fontWeight="bold">Granted</Text>, scopes.granted.join(', ')],
      [<Text as="span" key="required" fontWeight="bold">Required</Text>, scopes.required.join(', ')],
      [<Text as="span" key="optional" fontWeight="bold">Optional</Text>, scopes.optional.join(', ')],
    ]

    setRows(rows)
  }

  useEffect(() => {
    createRows()
  }, [])

  async function requestScopes() {
    setLoading(true)
    try {
      const response = await window?.shopify?.scopes?.request(
        JSON.parse('write_products, read_products, read_orders, read_customers, read_inventory, read_themes, read_content')?.split(',')
      ) // this comes from next.config.js so it's safe to use
      if (response?.result === 'granted-all') {
        createRows()
      } else if (response?.result === 'declined-all') {
        alert('Declined optional scopes')
      }
    } catch (e) {
      alert(
        'Error occured while requesting scopes. Is the scope declared in your env?'
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Page
        title="Scopes"
        primaryAction={{
          content: 'Request optional scopes',
          loading,
          onAction: () => {
            requestScopes()
          },
        }}
        backAction={{
          onAction: () => {
            router?.back()
          },
        }}
      >
        <Layout>
          <Layout.Section>
            <Card padding="0">
              <DataTable
                rows={rows as TableData[][]}
                columnContentTypes={['text', 'text']}
                headings={[
                  <Text key="type" as="span" fontWeight="bold">Type</Text>,
                  <Text key="scopes" as="span" fontWeight="bold">Scopes</Text>,
                ]}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  )
}

export default OptionalScopes
