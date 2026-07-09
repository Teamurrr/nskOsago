import { Alert, Button, Card, Empty, Input, Pagination, Select, Space, Spin, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'
import type { PolicyStatus } from '../../../entities/policy'
import { usePoliciesList } from '../model/usePoliciesList'

const { Paragraph, Text, Title } = Typography

const pageSize = 5

function getPolicyStatusColor(status: PolicyStatus) {
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

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPolicies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return data.filter((policy) => {
      const matchesStatus = statusFilter === 'ALL' || policy.status === statusFilter

      const searchableText = [
        policy.number,
        policy.vehicle.model,
        policy.vehicle.registrationNumber,
        policy.owner.firstName,
        policy.owner.lastName,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        normalizedSearch.length === 0 || searchableText.includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [data, search, statusFilter])

  const paginatedPolicies = useMemo(() => {
    const start = (currentPage - 1) * pageSize

    return filteredPolicies.slice(start, start + pageSize)
  }, [filteredPolicies, currentPage])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: PolicyStatus | 'ALL') => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

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
        title={t('pages.policies.title')}
        description={error}
        type="error"
        showIcon
      />
    )
  }

  return (
    <Card>
      <Title level={2}>{t('pages.policies.title')}</Title>
      <Paragraph>{t('pages.policies.description')}</Paragraph>

      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input.Search
            allowClear
            placeholder="Search by policy, owner, vehicle, plate"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            style={{ width: 320 }}
          />

          <Select<PolicyStatus | 'ALL'>
            value={statusFilter}
            onChange={handleStatusChange}
            style={{ width: 220 }}
            options={[
              { value: 'ALL', label: 'All statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PENDING_REVIEW', label: 'Pending review' },
              { value: 'EXPIRED', label: 'Expired' },
            ]}
          />
        </Space>

        {filteredPolicies.length === 0 ? (
          <Empty description={t('pages.policies.empty')} />
        ) : (
          <>
            <div style={{ display: 'grid', gap: 16 }}>
              {paginatedPolicies.map((policy) => (
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
                    {policy.vehicle.model} - {policy.vehicle.registrationNumber}
                  </Paragraph>

                  <Paragraph>
                    {policy.owner.firstName} {policy.owner.lastName}
                  </Paragraph>

                  <Paragraph>
                    <Tag color={getPolicyStatusColor(policy.status)}>{policy.status}</Tag>
                    <Text>{policy.premium.total} KGS</Text>
                  </Paragraph>
                </Card>
              ))}
            </div>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPolicies.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </>
        )}
      </Space>
    </Card>
  )
}
