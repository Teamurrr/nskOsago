import { DatePicker, Form, InputNumber, Radio, Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'

import type { OsagoDictionaries } from '../../../entities/dictionary'
import { calculateAge } from '../../../features/calculate-premium'
import type { CalculatorFormValues } from '../model/types'

const disabledHtmlFor = null as unknown as string

interface CalculatorFormProps {
  dictionaries: OsagoDictionaries
  form: ReturnType<typeof Form.useForm<CalculatorFormValues>>[0]
}

export function CalculatorForm({ dictionaries, form }: CalculatorFormProps) {
  const { t, i18n } = useTranslation()
  const isRussian = i18n.language === 'ru'

  return (
    <Form<CalculatorFormValues>
      form={form}
      layout="vertical"
      initialValues={{
        regionId: dictionaries.regions[0]?.id,
        vehicleTypeId: dictionaries.vehicleTypes[0]?.id,
        power: 100,
        ownerBirthDate: dayjs().subtract(30, 'year'),
        driverExperience: 5,
        driverAccessType: 'LIMITED',
        durationId: dictionaries.durations[0]?.id,
        bonusMalusClass: 3,
      }}
    >
      <Form.Item
        label={t('pages.calculator.form.region')}
        name="regionId"
        rules={[{ required: true, message: t('pages.calculator.validation.required') }]}
      >
        <Select
          options={dictionaries.regions.map((region) => ({
            value: region.id,
            label: isRussian ? region.nameRu : region.nameEn,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t('pages.calculator.form.vehicleType')}
        name="vehicleTypeId"
        rules={[{ required: true, message: t('pages.calculator.validation.required') }]}
      >
        <Select
          options={dictionaries.vehicleTypes.map((vehicleType) => ({
            value: vehicleType.id,
            label: isRussian ? vehicleType.nameRu : vehicleType.nameEn,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t('pages.calculator.form.power')}
        name="power"
        rules={[
          { required: true, message: t('pages.calculator.validation.required') },
          {
            type: 'number',
            min: 1,
            message: t('pages.calculator.validation.minPower', { value: 1 }),
          },
        ]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={t('pages.calculator.form.ownerBirthDate')}
        name="ownerBirthDate"
        rules={[
          { required: true, message: t('pages.calculator.validation.required') },
          {
            validator: (_, value: Dayjs | undefined) => {
              if (!value || calculateAge(value.toDate()) >= 18) {
                return Promise.resolve()
              }

              return Promise.reject(
                new Error(t('pages.calculator.validation.minOwnerAge', { value: 18 })),
              )
            },
          },
        ]}
      >
        <DatePicker
          disabledDate={(current) => current.isAfter(dayjs(), 'day')}
          format="DD.MM.YYYY"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label={t('pages.calculator.form.driverExperience')}
        name="driverExperience"
        dependencies={['ownerBirthDate']}
        rules={[
          { required: true, message: t('pages.calculator.validation.required') },
          {
            validator: (_, value: number | null | undefined) => {
              if (value === null || value === undefined) {
                return Promise.resolve()
              }

              if (value < 0) {
                return Promise.reject(
                  new Error(t('pages.calculator.validation.minDriverExperience')),
                )
              }

              const ownerBirthDate = form.getFieldValue('ownerBirthDate')

              if (!ownerBirthDate) {
                return Promise.resolve()
              }

              const ownerAge = calculateAge(ownerBirthDate.toDate())
              const maxExperience = Math.max(ownerAge - 17, 0)

              if (value > maxExperience) {
                return Promise.reject(
                  new Error(
                    t('pages.calculator.validation.maxDriverExperience', {
                      value: maxExperience,
                    }),
                  ),
                )
              }

              return Promise.resolve()
            },
          },
        ]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={t('pages.calculator.form.driverAccess')}
        name="driverAccessType"
        htmlFor={disabledHtmlFor}
        rules={[{ required: true, message: t('pages.calculator.validation.required') }]}
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

      <Form.Item
        label={t('pages.calculator.form.duration')}
        name="durationId"
        rules={[{ required: true, message: t('pages.calculator.validation.required') }]}
      >
        <Select
          options={dictionaries.durations.map((duration) => ({
            value: duration.id,
            label: isRussian ? duration.nameRu : duration.nameEn,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t('pages.calculator.form.bonusMalusClass')}
        name="bonusMalusClass"
        rules={[{ required: true, message: t('pages.calculator.validation.required') }]}
      >
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
