import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Paragraph, Title } = Typography

export function PoliciesListPage() {
  const { t } = useTranslation()

  return (
    <Card>
      <Title level={2}>{t('pages.policies.title')}</Title>
      <Paragraph>{t('pages.policies.description')}</Paragraph>
    </Card>
  )
}