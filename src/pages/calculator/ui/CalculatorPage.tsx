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
  const currentValues = values ?? form.getFieldsValue()
  const hasValidationErrors = form.getFieldsError().some((field) => field.errors.length > 0)

  const calculationResult =
    data &&
    !hasValidationErrors &&
    currentValues?.regionId &&
    typeof currentValues.power === 'number' &&
    typeof currentValues.driverAge === 'number' &&
    typeof currentValues.driverExperience === 'number' &&
    currentValues.driverAccessType &&
    currentValues.durationId &&
    typeof currentValues.bonusMalusClass === 'number'
      ? calculatePremium({
          input: {
            regionId: currentValues.regionId,
            power: currentValues.power,
            driverAge: currentValues.driverAge,
            driverExperience: currentValues.driverExperience,
            driverAccessType: currentValues.driverAccessType,
            durationId: currentValues.durationId,
            bonusMalusClass: currentValues.bonusMalusClass,
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