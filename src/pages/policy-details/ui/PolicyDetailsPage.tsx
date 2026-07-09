import { Alert, Button, Card, Descriptions, Space, Spin, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'
import { usePolicyDetails } from '../model/usePolicyDetails'
import { InspectionUploadCard } from './InspectionUploadCard'

const { Title } = Typography

export function PolicyDetailsPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: policy, isLoading, error } = usePolicyDetails(id)

  if (isLoading) {
    return (
      <Card>
        <Spin />
      </Card>
    )
  }

  if (error || !policy) {
    return (
      <Alert
        title={t('pages.policyDetails.title')}
        description={error ?? t('pages.policyDetails.notFound')}
        type="error"
        showIcon
        action={
          <Button onClick={() => navigate(routePaths.policies)}>
            {t('pages.policyDetails.backToPolicies')}
          </Button>
        }
      />
    )
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Button onClick={() => navigate(routePaths.policies)}>
            {t('pages.policyDetails.backToPolicies')}
          </Button>

          <Title level={2} style={{ margin: 0 }}>
            {policy.number}
          </Title>

          <Tag color={policy.status === 'ACTIVE' ? 'green' : 'gold'}>
            {t(`pages.policies.statuses.${policy.status}`)}
          </Tag>
        </Space>
      </Card>

      <Card title={t('pages.policyDetails.vehicle')}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label={t('pages.policyDetails.model')}>
            {policy.vehicle.model}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.policyDetails.registrationNumber')}>
            {policy.vehicle.registrationNumber}
          </Descriptions.Item>
          <Descriptions.Item label="VIN">{policy.vehicle.vin}</Descriptions.Item>
          <Descriptions.Item label={t('pages.policyDetails.year')}>
            {policy.vehicle.year}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.policyDetails.power')}>
            {policy.vehicle.power}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('pages.policyDetails.owner')}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label={t('pages.policyDetails.fullName')}>
            {policy.owner.firstName} {policy.owner.lastName}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.policyDetails.dateOfBirth')}>
            {policy.owner.dateOfBirth}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.policyDetails.personalId')}>
            {policy.owner.personalId}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('pages.policyDetails.premium')}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label={t('pages.policyDetails.total')}>
            {policy.premium.total} {t('common.currency')}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.policyDetails.startDate')}>
            {policy.startsAt}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.policyDetails.endDate')}>
            {policy.endsAt}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <InspectionUploadCard policyId={policy.id} />
    </Space>
  )
}   
