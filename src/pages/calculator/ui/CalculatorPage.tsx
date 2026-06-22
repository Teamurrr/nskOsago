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
  const { t, i18n } = useTranslation()
  const { data, isLoading, error } = useDictionaries()
  const [form] = Form.useForm<PremiumCalculationInput>()
  const values = Form.useWatch([], form)
  const isRussian = i18n.language === 'ru'

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
            <Form.Item label={t('pages.calculator.form.region')} name="regionId">
              <Select
                options={data.regions.map((region) => ({
                  value: region.id,
                  label: isRussian ? region.nameRu : region.nameEn,
                }))}
              />
            </Form.Item>

            <Form.Item label={t('pages.calculator.form.power')} name="power">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label={t('pages.calculator.form.driverAge')} name="driverAge">
              <InputNumber min={18} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={t('pages.calculator.form.driverExperience')}
              name="driverExperience"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label={t('pages.calculator.form.driverAccess')}
              name="driverAccessType"
            >
              <Radio.Group
                options={[
                  {
                    label: t('pages.calculator.form.driverAccessLimited'),
                    value: 'LIMITED',
                  },
                  {
                    label: t('pages.calculator.form.driverAccessNoLimits'),
                    value: 'NO_LIMITS',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item label={t('pages.calculator.form.duration')} name="durationId">
              <Select
                options={data.durations.map((duration) => ({
                  value: duration.id,
                  label: isRussian ? duration.nameRu : duration.nameEn,
                }))}
              />
            </Form.Item>

            <Form.Item
              label={t('pages.calculator.form.bonusMalusClass')}
              name="bonusMalusClass"
            >
              <Select
                options={data.bonusMalus.map((item) => ({
                  value: item.class,
                  label: t('pages.calculator.form.bonusMalusClassValue', {
                    value: item.class,
                  }),
                }))}
              />
            </Form.Item>
          </Form>

          {calculationResult && (
            <Card size="small" title={t('pages.calculator.result.title')}>
              <Space direction="vertical">
                <Text strong>
                  {t('pages.calculator.result.total')}: {calculationResult.total} KGS
                </Text>
                <Text>
                  {t('pages.calculator.result.baseTariff')}:{' '}
                  {calculationResult.breakdown.baseTariff}
                </Text>
                <Text>
                  {t('pages.calculator.result.territory')}:{' '}
                  {calculationResult.breakdown.territoryCoefficient}
                </Text>
                <Text>
                  {t('pages.calculator.result.power')}:{' '}
                  {calculationResult.breakdown.powerCoefficient}
                </Text>
                <Text>
                  {t('pages.calculator.result.ageExperience')}:{' '}
                  {calculationResult.breakdown.ageExperienceCoefficient}
                </Text>
                <Text>
                  {t('pages.calculator.result.driverAccess')}:{' '}
                  {calculationResult.breakdown.driverAccessCoefficient}
                </Text>
                <Text>
                  {t('pages.calculator.result.duration')}:{' '}
                  {calculationResult.breakdown.durationCoefficient}
                </Text>
                <Text>
                  {t('pages.calculator.result.bonusMalus')}:{' '}
                  {calculationResult.breakdown.bonusMalusCoefficient}
                </Text>
              </Space>
            </Card>
          )}
        </Space>
      )}
    </Card>
  )
}