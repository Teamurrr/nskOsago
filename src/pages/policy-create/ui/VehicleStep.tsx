import { Form, Input, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'

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
  const selectedBrandId = Form.useWatch('brandId')
  const selectedBrand = dictionaries.carBrands.find((brand) => brand.id === selectedBrandId)

  return (
    <>
      <Form.Item
        label="Марка"
        name="brandId"
        rules={[{ required: true, message: 'Выберите марку' }]}
      >
        <Select
          options={dictionaries.carBrands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Модель"
        name="model"
        rules={[{ required: true, message: 'Выберите модель' }]}
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
        label="Госномер"
        name="registrationNumber"
        rules={[
          { required: true, message: 'Введите госномер' },
          {
            pattern: /^\d{2}KG\d{3}[A-Z]{3}$/,
            message: 'Формат: 01KG123ABC',
          },
        ]}
      >
        <Input placeholder="01KG123ABC" />
      </Form.Item>

      <Form.Item
        label="VIN"
        name="vin"
        rules={[
          { required: true, message: 'Введите VIN' },
          {
            pattern: /^[A-HJ-NPR-Z0-9]{17}$/,
            message: 'VIN: 17 символов, латиница и цифры, без I/O/Q',
          },
        ]}
      >
        <Input placeholder="JTDBE32K020123456" />
      </Form.Item>

      <Form.Item
        label="Год выпуска"
        name="year"
        rules={[
          { required: true, message: 'Введите год выпуска' },
          {
            type: 'number',
            min: 1980,
            max: dayjs().year(),
            message: `Год должен быть от 1980 до ${dayjs().year()}`,
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Мощность"
        name="power"
        rules={[
          { required: true, message: 'Введите мощность' },
          { type: 'number', min: 1, message: 'Мощность должна быть больше 0' },
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Регион"
        name="regionId"
        rules={[{ required: true, message: 'Выберите регион' }]}
      >
        <Select
          options={dictionaries.regions.map((region) => ({
            value: region.id,
            label: region.nameRu,
          }))}
        />
      </Form.Item>
    </>
  )
}
