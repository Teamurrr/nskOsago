import { Form, Input, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import type { OsagoDictionaries } from '../../../entities/dictionary'

export interface VehicleStepValues {
  brandId: string
  model: string
  registrationNumber: string
  vin: string
  year: number
  power: number
  regionId: string
}

interface VehicleStepProps {
  dictionaries: OsagoDictionaries
}

export function VehicleStep({ dictionaries }: VehicleStepProps) {
  const { t, i18n } = useTranslation()
  const selectedBrandId = Form.useWatch('brandId')
  const selectedBrand = dictionaries.carBrands.find((brand) => brand.id === selectedBrandId)
  const isRussian = i18n.language === 'ru'

  return (
    <>
      <Form.Item
        label={t('pages.newPolicy.vehicle.brand')}
        name="brandId"
        rules={[{ required: true, message: t('pages.newPolicy.validation.selectBrand') }]}
      >
        <Select
          options={dictionaries.carBrands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t('pages.newPolicy.vehicle.model')}
        name="model"
        rules={[{ required: true, message: t('pages.newPolicy.validation.selectModel') }]}
      >
        <Select
          showSearch
          disabled={!selectedBrand}
          options={(selectedBrand?.models ?? []).map((model) => ({
            value: model,
            label: model,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t('pages.newPolicy.vehicle.registrationNumber')}
        name="registrationNumber"
        rules={[
          { required: true, message: t('pages.newPolicy.validation.enterRegistrationNumber') },
          {
            pattern: /^\d{2}KG\d{3}[A-Z]{3}$/,
            message: t('pages.newPolicy.validation.registrationNumberFormat'),
          },
        ]}
      >
        <Input placeholder="01KG123ABC" />
      </Form.Item>

      <Form.Item
        label="VIN"
        name="vin"
        rules={[
          { required: true, message: t('pages.newPolicy.validation.enterVin') },
          {
            pattern: /^[A-HJ-NPR-Z0-9]{17}$/,
            message: t('pages.newPolicy.validation.vinFormat'),
          },
        ]}
      >
        <Input placeholder="JTDBE32K020123456" />
      </Form.Item>

      <Form.Item
        label={t('pages.newPolicy.vehicle.year')}
        name="year"
        rules={[
          { required: true, message: t('pages.newPolicy.validation.enterYear') },
          {
            type: 'number',
            min: 1980,
            max: dayjs().year(),
            message: t('pages.newPolicy.validation.yearRange', { value: dayjs().year() }),
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={t('pages.newPolicy.vehicle.power')}
        name="power"
        rules={[
          { required: true, message: t('pages.newPolicy.validation.enterPower') },
          { type: 'number', min: 1, message: t('pages.newPolicy.validation.minPower') },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={t('pages.newPolicy.vehicle.region')}
        name="regionId"
        rules={[{ required: true, message: t('pages.newPolicy.validation.selectRegion') }]}
      >
        <Select
          options={dictionaries.regions.map((region) => ({
            value: region.id,
            label: isRussian ? region.nameRu : region.nameEn,
          }))}
        />
      </Form.Item>
    </>
  )
}
