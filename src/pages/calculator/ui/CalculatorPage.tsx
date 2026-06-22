import {
  Alert,
  Card,
  Form,
  InputNumber,
  Radio,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'

import {
  calculatePremium,
  type PremiumCalculationInput,
} from '../../../features/calculate-premium'
import { useDictionaries } from '../model/useDictionaries'

const { Paragraph, Text, Title } = Typography

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
          <Form<PremiumCalculationInput>
            form={form}
            layout="vertical"
            initialValues={{
              regionId: data.regions[0]?.id,
              power: 100,
              driverAge: 30,
              driverExperience: 5,
              driverAccessType: 'LIMITED',
              durationId: data.durations[0]?.id,
              bonusMalusClass: 3,
            }}
          >
            <Form.Item label="Region" name="regionId">
              <Select
                options={data.regions.map((region) => ({
                  value: region.id,
                  label: region.nameEn,
                }))}
              />
            </Form.Item>

            <Form.Item label="Power" name="power">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Driver age" name="driverAge">
              <InputNumber min={18} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Driver experience" name="driverExperience">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Driver access" name="driverAccessType">
              <Radio.Group
                options={[
                  { label: 'Limited', value: 'LIMITED' },
                  { label: 'No limits', value: 'NO_LIMITS' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Duration" name="durationId">
              <Select
                options={data.durations.map((duration) => ({
                  value: duration.id,
                  label: duration.nameEn,
                }))}
              />
            </Form.Item>

            <Form.Item label="Bonus-malus class" name="bonusMalusClass">
              <Select
                options={data.bonusMalus.map((item) => ({
                  value: item.class,
                  label: `Class ${item.class}`,
                }))}
              />
            </Form.Item>
          </Form>

          {calculationResult && (
            <Card size="small" title="Premium result">
              <Space direction="vertical">
                <Text strong>Total: {calculationResult.total} KGS</Text>
                <Text>Base tariff: {calculationResult.breakdown.baseTariff}</Text>
                <Text>Territory: {calculationResult.breakdown.territoryCoefficient}</Text>
                <Text>Power: {calculationResult.breakdown.powerCoefficient}</Text>
                <Text>
                  Age/experience: {calculationResult.breakdown.ageExperienceCoefficient}
                </Text>
                <Text>
                  Driver access: {calculationResult.breakdown.driverAccessCoefficient}
                </Text>
                <Text>Duration: {calculationResult.breakdown.durationCoefficient}</Text>
                <Text>
                  Bonus-malus: {calculationResult.breakdown.bonusMalusCoefficient}
                </Text>
              </Space>
            </Card>
          )}
        </Space>
      )}
    </Card>
  )
}