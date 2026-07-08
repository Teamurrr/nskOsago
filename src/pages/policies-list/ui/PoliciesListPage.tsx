import { Alert, Button, Card, Empty, Spin, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'
import { usePoliciesList } from '../model/usePoliciesList'

const { Paragraph, Text, Title } = Typography

function getPolicyStatusColor(status: string) {
  if (status === 'ACTIVE') {
    return 'green'
  }

  if (status === 'DRAFT') {
    return 'blue'
  }

  if (status === 'PENDING_REVIEW') {
    return 'gold'
  }

  return 'default'
}

export function PoliciesListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
          <Card
            key={policy.id}
            size="small"
            extra={
              <Button
                type="link"
                onClick={() => navigate(routePaths.getPolicyDetails(policy.id))}
              >
                Open
              </Button>
            }
          >
            <Title level={4}>{policy.number}</Title>

            <Paragraph>
              {policy.vehicle.model} · {policy.vehicle.registrationNumber}
            </Paragraph>

            <Paragraph>
              <Tag color={getPolicyStatusColor(policy.status)}>{policy.status}</Tag>
              <Text>{policy.premium.total} KGS</Text>
            </Paragraph>
          </Card>
        ))}
      </div>
    </Card>
  )
}