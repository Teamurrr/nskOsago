import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Paragraph, Title } = Typography

export function PolicyCreatePage() {
  const { t } = useTranslation()

  return (
    <Card>
      <Title level={2}>{t('pages.newPolicy.title')}</Title>
      <Paragraph>{t('pages.newPolicy.description')}</Paragraph>
    </Card>
  )
}