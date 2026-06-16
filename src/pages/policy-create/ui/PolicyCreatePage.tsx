import { Card, Typography } from 'antd'

const { Paragraph, Title } = Typography

export function PolicyCreatePage() {
  return (
    <Card>
      <Title level={2}>New Policy</Title>
      <Paragraph>This page will contain the multi-step policy creation wizard.</Paragraph>
    </Card>
  )
}
