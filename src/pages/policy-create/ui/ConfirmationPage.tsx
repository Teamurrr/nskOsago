import { Button, Card, Descriptions, Result, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import type { OsagoDictionaries } from '../../../entities/dictionary'
import type {
  PremiumCalculationInput,
  PremiumCalculationResult,
} from '../../../features/calculate-premium'
import type { ParticipantsStepValues } from './ParticipantStep'
import type { VehicleStepValues } from './VehicleStep'

const { Text, Title } = Typography

interface ConfirmationStepProps {
  values: VehicleStepValues & ParticipantsStepValues & { durationId: string }
  dictionaries: OsagoDictionaries
  calculationInput: PremiumCalculationInput | null
  calculationResult: PremiumCalculationResult | null
  createdPolicyNumber: string | null
  onCreateDraft: () => void
}

export function ConfirmationStep({
  values,
  dictionaries,
  calculationInput,
  calculationResult,
  createdPolicyNumber,
  onCreateDraft,
}: ConfirmationStepProps) {
  const { t, i18n } = useTranslation()
  const isRussian = i18n.language === 'ru'
  const brand = dictionaries.carBrands.find((item) => item.id === values.brandId)
  const region = dictionaries.regions.find((item) => item.id === values.regionId)
  const duration = dictionaries.durations.find((item) => item.id === values.durationId)

  if (createdPolicyNumber) {
    return (
      <Result
        status="success"
        title={t('pages.newPolicy.confirmation.successTitle')}
        subTitle={t('pages.newPolicy.confirmation.policyNumber', {
          value: createdPolicyNumber,
        })}
      />
    )
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card size="small">
        <Title level={4}>{t('pages.newPolicy.confirmation.vehicle')}</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label={t('pages.newPolicy.vehicle.brand')}>
            {brand?.name}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.vehicle.model')}>
            {values.model}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.vehicle.registrationNumber')}>
            {values.registrationNumber}
          </Descriptions.Item>
          <Descriptions.Item label="VIN">{values.vin}</Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.vehicle.year')}>
            {values.year}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.vehicle.power')}>
            {values.power}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.vehicle.region')}>
            {isRussian ? region?.nameRu : region?.nameEn}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small">
        <Title level={4}>{t('pages.newPolicy.confirmation.owner')}</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label={t('pages.newPolicy.participants.firstName')}>
            {values.owner?.firstName}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.participants.lastName')}>
            {values.owner?.lastName}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.participants.personalId')}>
            {values.owner?.personalId}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.participants.dateOfBirth')}>
            {values.owner?.dateOfBirth?.format('DD.MM.YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small">
        <Title level={4}>{t('pages.newPolicy.confirmation.drivers')}</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label={t('pages.newPolicy.confirmation.accessType')}>
            {values.driverAccessType === 'NO_LIMITS'
              ? t('pages.newPolicy.participants.noLimits')
              : t('pages.newPolicy.participants.limited')}
          </Descriptions.Item>

          {values.driverAccessType === 'LIMITED' && (
            <Descriptions.Item label={t('pages.newPolicy.confirmation.driversCount')}>
              {values.drivers?.length ?? 0}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card size="small">
        <Title level={4}>{t('pages.newPolicy.confirmation.calculation')}</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label={t('pages.newPolicy.confirmation.duration')}>
            {isRussian ? duration?.nameRu : duration?.nameEn}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.confirmation.premium')}>
            {calculationResult
              ? `${calculationResult.total} KGS`
              : t('pages.newPolicy.confirmation.notCalculated')}
          </Descriptions.Item>
          <Descriptions.Item label={t('pages.newPolicy.participants.bonusMalusClass')}>
            {calculationInput?.bonusMalusClass ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button type="primary" size="large" onClick={onCreateDraft}>
        {t('pages.newPolicy.actions.createDraft')}
      </Button>

      <Text type="secondary">{t('pages.newPolicy.confirmation.hint')}</Text>
    </Space>
  )
}
