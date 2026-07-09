import { Alert, Card, Form, Space, Spin, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { calculateAge, calculatePremium } from '../../../features/calculate-premium'
import type { CalculatorFormValues } from '../model/types'
import { useDictionaries } from '../model/useDictionaries'
import { CalculatorForm } from './CalculatorForm'
import { PremiumBreakdownCard } from './PremiumBreakdownCard'

const { Paragraph, Title } = Typography

export function CalculatorPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useDictionaries()
  const [form] = Form.useForm<CalculatorFormValues>()
  const values = Form.useWatch([], form)
  const currentValues = values ?? form.getFieldsValue()
  const hasValidationErrors = form.getFieldsError().some((field) => field.errors.length > 0)

  const calculationInput =
    !hasValidationErrors &&
    currentValues?.regionId &&
    currentValues.vehicleTypeId &&
    typeof currentValues.power === 'number' &&
    currentValues.ownerBirthDate &&
    typeof currentValues.driverExperience === 'number' &&
    currentValues.driverAccessType &&
    currentValues.durationId &&
    typeof currentValues.bonusMalusClass === 'number'
      ? {
          vehicleTypeId: currentValues.vehicleTypeId,
          regionId: currentValues.regionId,
          power: currentValues.power,
          driverAge: calculateAge(currentValues.ownerBirthDate.toDate()),
          driverExperience: currentValues.driverExperience,
          driverAccessType: currentValues.driverAccessType,
          durationId: currentValues.durationId,
          bonusMalusClass: currentValues.bonusMalusClass,
        }
      : null

  const calculationResult =
    data && calculationInput
      ? calculatePremium({
          input: calculationInput,
          dictionaries: data,
        })
      : null

  return (
    <Card>
      <Title level={2}>{t('pages.calculator.title')}</Title>
      <Paragraph>{t('pages.calculator.description')}</Paragraph>

      {isLoading && <Spin />}

      {error && <Alert title={error} type="error" showIcon />}

      {data && (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <CalculatorForm dictionaries={data} form={form} />

          {calculationResult && calculationInput && (
            <PremiumBreakdownCard
              result={calculationResult}
              input={calculationInput}
              dictionaries={data}
            />
          )}
        </Space>
      )}
    </Card>
  )
}
