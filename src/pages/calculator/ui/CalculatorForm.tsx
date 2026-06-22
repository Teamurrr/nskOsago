import { Form, InputNumber, Radio, Select } from 'antd'
import { useTranslation } from 'react-i18next'

import type { OsagoDictionaries } from '../../../entities/dictionary'
import type { PremiumCalculationInput } from '../../../features/calculate-premium'

interface CalculatorFormProps {
  dictionaries: OsagoDictionaries
  form: ReturnType<typeof Form.useForm<PremiumCalculationInput>>[0]
}

export function CalculatorForm({ dictionaries, form }: CalculatorFormProps) {
  const { t, i18n } = useTranslation()
  const isRussian = i18n.language === 'ru'

  return (
    <Form<PremiumCalculationInput>
      form={form}
      layout="vertical"
      initialValues={{
        regionId: dictionaries.regions[0]?.id,
        power: 100,
        driverAge: 30,
        driverExperience: 5,
        driverAccessType: 'LIMITED',
        durationId: dictionaries.durations[0]?.id,
        bonusMalusClass: 3,
      }}
    >
      <Form.Item label={t('pages.calculator.form.region')} name="regionId">
        <Select
          options={dictionaries.regions.map((region) => ({
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

      <Form.Item label={t('pages.calculator.form.driverExperience')} name="driverExperience">
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label={t('pages.calculator.form.driverAccess')} name="driverAccessType">
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
          options={dictionaries.durations.map((duration) => ({
            value: duration.id,
            label: isRussian ? duration.nameRu : duration.nameEn,
          }))}
        />
      </Form.Item>

      <Form.Item label={t('pages.calculator.form.bonusMalusClass')} name="bonusMalusClass">
        <Select
          options={dictionaries.bonusMalus.map((item) => ({
            value: item.class,
            label: t('pages.calculator.form.bonusMalusClassValue', {
              value: item.class,
            }),
          }))}
        />
      </Form.Item>
    </Form>
  )
}