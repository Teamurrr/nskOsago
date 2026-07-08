import { Card, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import type { OsagoDictionaries } from '../../../entities/dictionary'
import type {
  PremiumCalculationInput,
  PremiumCalculationResult,
} from '../../../features/calculate-premium'

const { Text } = Typography

interface PremiumBreakdownCardProps {
  result: PremiumCalculationResult
  input: PremiumCalculationInput
  dictionaries: OsagoDictionaries
}

export function PremiumBreakdownCard({
  result,
  input,
  dictionaries,
}: PremiumBreakdownCardProps) {
  const { t, i18n } = useTranslation()
  const isRussian = i18n.language === 'ru'

  const region = dictionaries.regions.find((item) => item.id === input.regionId)
  const duration = dictionaries.durations.find((item) => item.id === input.durationId)
  const bonusMalus = dictionaries.bonusMalus.find(
    (item) => item.class === input.bonusMalusClass,
  )
  const powerTier = dictionaries.powerTiers.find(
    (item) => item.max === null || input.power <= item.max,
  )

  const powerTierLabel =
    powerTier?.max === null
      ? t('pages.calculator.result.powerTierAbove')
      : t('pages.calculator.result.powerTierUpTo', { value: powerTier?.max })

  const ageExperienceReason =
    input.driverAge < 25 && input.driverExperience < 3
      ? t('pages.calculator.result.ageExperienceYoungAndInexperienced')
      : input.driverAge < 25 || input.driverExperience < 3
        ? t('pages.calculator.result.ageExperiencePartialRisk')
        : t('pages.calculator.result.ageExperienceStandard')

  const driverAccessLabel =
    input.driverAccessType === 'NO_LIMITS'
      ? t('pages.calculator.form.driverAccessNoLimits')
      : t('pages.calculator.form.driverAccessLimited')

  const formula = [
    result.breakdown.baseTariff,
    result.breakdown.territoryCoefficient,
    result.breakdown.powerCoefficient,
    result.breakdown.ageExperienceCoefficient,
    result.breakdown.driverAccessCoefficient,
    result.breakdown.durationCoefficient,
    result.breakdown.bonusMalusCoefficient,
  ].join(' × ')

  return (
    <Card size="small" title={t('pages.calculator.result.title')}>
      <Space direction="vertical">
        <Text>
          {t('pages.calculator.result.baseTariff')}: {result.breakdown.baseTariff}
        </Text>

        <Text>
          {t('pages.calculator.result.territory')}: {isRussian ? region?.nameRu : region?.nameEn}{' '}
          → {result.breakdown.territoryCoefficient}
        </Text>

        <Text>
          {t('pages.calculator.result.power')}: {input.power} → {powerTierLabel} →{' '}
          {result.breakdown.powerCoefficient}
        </Text>

        <Text>
          {t('pages.calculator.result.ageExperience')}: {input.driverAge} /{' '}
          {input.driverExperience} → {ageExperienceReason} →{' '}
          {result.breakdown.ageExperienceCoefficient}
        </Text>

        <Text>
          {t('pages.calculator.result.driverAccess')}: {driverAccessLabel} →{' '}
          {result.breakdown.driverAccessCoefficient}
        </Text>

        <Text>
          {t('pages.calculator.result.duration')}: {isRussian ? duration?.nameRu : duration?.nameEn}{' '}
          → {result.breakdown.durationCoefficient}
        </Text>

        <Text>
          {t('pages.calculator.result.bonusMalus')}:{' '}
          {t('pages.calculator.form.bonusMalusClassValue', {
            value: bonusMalus?.class ?? input.bonusMalusClass,
          })}{' '}
          → {bonusMalus?.k ?? result.breakdown.bonusMalusCoefficient}
        </Text>

        <Text strong>
          {t('pages.calculator.result.formula')}: {formula} = {result.total}
        </Text>
      </Space>
    </Card>
  )
}
