import { Card, Typography } from 'antd'

const { Paragraph, Title } = Typography

export function PoliciesListPage() {
  return (
    <Card>
      <Title level={2}>Policies</Title>
      <Paragraph>This page will contain the list of issued and draft insurance policies.</Paragraph>
    </Card>
  )
}
