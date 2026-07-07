import { Alert, Card, Empty, Spin, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import type { PolicyStatus } from '../../../entities/policy'
import { usePoliciesList } from '../model/usePoliciesList'

const { Paragraph, Text, Title } = Typography

const statusColors: Record<PolicyStatus, string> = {
  ACTIVE: 'green',
  DRAFT: 'gold',
  EXPIRED: 'default',
  PENDING_REVIEW: 'blue',
}

export function PoliciesListPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = usePoliciesList()

  if (isLoading) {
    return (
      <Card>
        <Spin />
      </Card>
    )
  }

  if (error) {
    return (
      <Alert
        message={t('pages.policies.title')}
        description={error}
        type="error"
        showIcon
      />
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <Title level={2}>{t('pages.policies.title')}</Title>
        <Empty description={t('pages.policies.empty')} />
      </Card>
    )
  }

  return (
    <Card>
      <Title level={2}>{t('pages.policies.title')}</Title>
      <Paragraph>{t('pages.policies.description')}</Paragraph>

      <div style={{ display: 'grid', gap: 16 }}>
        {data.map((policy) => (
          <Card key={policy.id} size="small">
            <Title level={4}>{policy.number}</Title>
            <Paragraph>
              {policy.vehicle.model} • {policy.vehicle.registrationNumber}
            </Paragraph>
            <Paragraph>
              <Tag color={statusColors[policy.status]}>{policy.status}</Tag>
              <Text>{policy.premium.total} KGS</Text>
            </Paragraph>
          </Card>
        ))}
      </div>
    </Card>
  )
}
