import { Card, Typography } from 'antd'

const { Paragraph, Title } = Typography

export function CalculatorPage() {
  return (
    <Card>
      <Title level={2}>OSAGO Calculator</Title>
      <Paragraph>This page will contain the premium calculation form and breakdown.</Paragraph>
    </Card>
  )
}
