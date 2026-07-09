import { Card, Table, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import type { OsagoDictionaries } from '../../../entities/dictionary'
import type {
  PremiumCalculationInput,
  PremiumCalculationResult,
} from '../../../features/calculate-premium'

const { Text } = Typography

interface BreakdownRow {
  key: string
  component: string
  details: string
  value: number
}

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

  const rows: BreakdownRow[] = [
    {
      key: 'baseTariff',
      component: t('pages.calculator.result.baseTariff'),
      details: t('pages.calculator.result.baseTariff'),
      value: result.breakdown.baseTariff,
    },
    {
      key: 'territory',
      component: t('pages.calculator.result.territory'),
      details: isRussian ? (region?.nameRu ?? '-') : (region?.nameEn ?? '-'),
      value: result.breakdown.territoryCoefficient,
    },
    {
      key: 'power',
      component: t('pages.calculator.result.power'),
      details: t('pages.calculator.result.powerDetails', {
        power: input.power,
        tier: powerTierLabel,
      }),
      value: result.breakdown.powerCoefficient,
    },
    {
      key: 'ageExperience',
      component: t('pages.calculator.result.ageExperience'),
      details: t('pages.calculator.result.ageExperienceDetails', {
        age: input.driverAge,
        experience: input.driverExperience,
        reason: ageExperienceReason,
      }),
      value: result.breakdown.ageExperienceCoefficient,
    },
    {
      key: 'driverAccess',
      component: t('pages.calculator.result.driverAccess'),
      details: driverAccessLabel,
      value: result.breakdown.driverAccessCoefficient,
    },
    {
      key: 'duration',
      component: t('pages.calculator.result.duration'),
      details: isRussian ? (duration?.nameRu ?? '-') : (duration?.nameEn ?? '-'),
      value: result.breakdown.durationCoefficient,
    },
    {
      key: 'bonusMalus',
      component: t('pages.calculator.result.bonusMalus'),
      details: t('pages.calculator.form.bonusMalusClassValue', {
        value: bonusMalus?.class ?? input.bonusMalusClass,
      }),
      value: bonusMalus?.k ?? result.breakdown.bonusMalusCoefficient,
    },
  ]

  return (
    <Card size="small" title={t('pages.calculator.result.title')}>
      <Table<BreakdownRow>
        size="small"
        pagination={false}
        dataSource={rows}
        columns={[
          {
            title: t('pages.calculator.result.component'),
            dataIndex: 'component',
            key: 'component',
          },
          {
            title: t('pages.calculator.result.details'),
            dataIndex: 'details',
            key: 'details',
          },
          {
            title: t('pages.calculator.result.value'),
            dataIndex: 'value',
            key: 'value',
          },
        ]}
      />

      <Text strong style={{ display: 'block', marginTop: 16 }}>
        {t('pages.calculator.result.premium')} = {result.total} {t('common.currency')}
      </Text>
    </Card>
  )
}
