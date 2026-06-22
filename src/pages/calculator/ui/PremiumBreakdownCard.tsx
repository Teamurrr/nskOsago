import { Card, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import type { PremiumCalculationResult } from '../../../features/calculate-premium'

const { Text } = Typography

interface PremiumBreakdownCardProps {
  result: PremiumCalculationResult
}

export function PremiumBreakdownCard({ result }: PremiumBreakdownCardProps) {
  const { t } = useTranslation()

  return (
    <Card size="small" title={t('pages.calculator.result.title')}>
      <Space direction="vertical">
        <Text strong>
          {t('pages.calculator.result.total')}: {result.total} KGS
        </Text>
        <Text>
          {t('pages.calculator.result.baseTariff')}: {result.breakdown.baseTariff}
        </Text>
        <Text>
          {t('pages.calculator.result.territory')}: {result.breakdown.territoryCoefficient}
        </Text>
        <Text>{t('pages.calculator.result.power')}: {result.breakdown.powerCoefficient}</Text>
        <Text>
          {t('pages.calculator.result.ageExperience')}:{' '}
          {result.breakdown.ageExperienceCoefficient}
        </Text>
        <Text>
          {t('pages.calculator.result.driverAccess')}:{' '}
          {result.breakdown.driverAccessCoefficient}
        </Text>
        <Text>
          {t('pages.calculator.result.duration')}: {result.breakdown.durationCoefficient}
        </Text>
        <Text>
          {t('pages.calculator.result.bonusMalus')}: {result.breakdown.bonusMalusCoefficient}
        </Text>
      </Space>
    </Card>
  )
}