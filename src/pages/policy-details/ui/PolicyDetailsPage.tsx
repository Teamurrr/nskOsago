import { Alert, Button, Card, Descriptions, Space, Spin, Tag, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'
import { usePolicyDetails } from '../model/usePolicyDetails'
import { InspectionUploadCard } from './InspectionUploadCard'

const { Title } = Typography

export function PolicyDetailsPage() {
  const { id } = useParams()
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
        message="Policy details"
        description={error ?? 'Policy not found.'}
        type="error"
        showIcon
        action={
          <Button onClick={() => navigate(routePaths.policies)}>
            Back to policies
          </Button>
        }
      />
    )
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Button onClick={() => navigate(routePaths.policies)}>Back to policies</Button>

          <Title level={2} style={{ margin: 0 }}>
            {policy.number}
          </Title>

          <Tag color={policy.status === 'ACTIVE' ? 'green' : 'gold'}>
            {policy.status}
          </Tag>
        </Space>
      </Card>

      <Card title="Vehicle">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Model">{policy.vehicle.model}</Descriptions.Item>
          <Descriptions.Item label="Registration number">
            {policy.vehicle.registrationNumber}
          </Descriptions.Item>
          <Descriptions.Item label="VIN">{policy.vehicle.vin}</Descriptions.Item>
          <Descriptions.Item label="Year">{policy.vehicle.year}</Descriptions.Item>
          <Descriptions.Item label="Power">{policy.vehicle.power}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Owner">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Full name">
            {policy.owner.firstName} {policy.owner.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Date of birth">
            {policy.owner.dateOfBirth}
          </Descriptions.Item>
          <Descriptions.Item label="Personal ID">
            {policy.owner.personalId}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Premium">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Total">{policy.premium.total} KGS</Descriptions.Item>
          <Descriptions.Item label="Start date">{policy.startsAt}</Descriptions.Item>
          <Descriptions.Item label="End date">{policy.endsAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      <InspectionUploadCard policyId={policy.id} />
    </Space>
  )
}   
