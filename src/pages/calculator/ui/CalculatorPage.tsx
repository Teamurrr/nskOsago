import { Alert, Card, Form, Space, Spin, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import {
  calculatePremium,
  type PremiumCalculationInput,
} from '../../../features/calculate-premium'
import { useDictionaries } from '../model/useDictionaries'
import { CalculatorForm } from './CalculatorForm'
import { PremiumBreakdownCard } from './PremiumBreakdownCard'

const { Paragraph, Title } = Typography

export function CalculatorPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useDictionaries()
  const [form] = Form.useForm<PremiumCalculationInput>()
  const values = Form.useWatch([], form)

  const calculationResult =
    data &&
    values?.regionId &&
    typeof values.power === 'number' &&
    typeof values.driverAge === 'number' &&
    typeof values.driverExperience === 'number' &&
    values.driverAccessType &&
    values.durationId &&
    typeof values.bonusMalusClass === 'number'
      ? calculatePremium({
          input: {
            regionId: values.regionId,
            power: values.power,
            driverAge: values.driverAge,
            driverExperience: values.driverExperience,
            driverAccessType: values.driverAccessType,
            durationId: values.durationId,
            bonusMalusClass: values.bonusMalusClass,
          },
          dictionaries: data,
        })
      : null

  return (
    <Card>
      <Title level={2}>{t('pages.calculator.title')}</Title>
      <Paragraph>{t('pages.calculator.description')}</Paragraph>

      {isLoading && <Spin />}

      {error && <Alert message={error} type="error" showIcon />}

      {data && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <CalculatorForm dictionaries={data} form={form} />
          {calculationResult && <PremiumBreakdownCard result={calculationResult} />}
        </Space>
      )}
    </Card>
  )
}