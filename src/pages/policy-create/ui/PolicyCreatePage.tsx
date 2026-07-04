import { Alert, Button, Card, Form, Select, Space, Spin, Steps, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { calculateAge, calculatePremium } from '../../../features/calculate-premium'
import { useDictionaries } from '../../calculator/model/useDictionaries'
import { PremiumBreakdownCard } from '../../calculator/ui/PremiumBreakdownCard'
import { ParticipantsStep, type ParticipantsStepValues } from './ParticipantStep'
import { VehicleStep, type VehicleStepValues } from './VehicleStep'

const { Paragraph, Text, Title } = Typography

interface PolicyCreateFormValues extends VehicleStepValues, ParticipantsStepValues {
  durationId: string
}

const steps = [
  {
    title: 'Авто',
    description: 'Данные автомобиля',
  },
  {
    title: 'Участники',
    description: 'Собственник и водители',
  },
  {
    title: 'Расчёт',
    description: 'Разбивка премии',
  },
  {
    title: 'Подтверждение',
    description: 'Создание черновика',
  },
]

export function PolicyCreatePage() {
  const { t } = useTranslation()
  const { data: dictionaries, isLoading, error } = useDictionaries()
  const [form] = Form.useForm<PolicyCreateFormValues>()
  const [currentStep, setCurrentStep] = useState(0)

  const formValues = Form.useWatch([], form)
  const currentValues = formValues ?? form.getFieldsValue()
  const firstDriver = currentValues.drivers?.[0]
  const calculationBirthDate = firstDriver?.dateOfBirth ?? currentValues.owner?.dateOfBirth
  const calculationLicenseIssuedAt = firstDriver?.licenseIssuedAt
  const calculationBonusMalusClass = firstDriver?.bonusMalusClass ?? 3

  const calculationInput =
    dictionaries &&
    currentValues.regionId &&
    currentValues.power &&
    currentValues.driverAccessType &&
    currentValues.durationId &&
    calculationBirthDate
      ? {
          vehicleTypeId: 'passenger_car',
          regionId: currentValues.regionId,
          power: currentValues.power,
          driverAge: calculateAge(calculationBirthDate.toDate()),
          driverExperience: calculationLicenseIssuedAt
            ? calculateAge(calculationLicenseIssuedAt.toDate())
            : 0,
          driverAccessType: currentValues.driverAccessType,
          durationId: currentValues.durationId,
          bonusMalusClass: calculationBonusMalusClass,
        }
      : null

  const calculationResult =
    dictionaries && calculationInput
      ? calculatePremium({
          input: calculationInput,
          dictionaries,
        })
      : null

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = async () => {
    if (currentStep === 0) {
      await form.validateFields([
        'brandId',
        'model',
        'registrationNumber',
        'vin',
        'year',
        'power',
        'regionId',
      ])
    }

    if (currentStep === 1) {
      await form.validateFields(['owner', 'driverAccessType', 'drivers'])
    }

    if (currentStep === 2) {
      await form.validateFields(['durationId'])
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  if (isLoading) {
    return (
      <Card>
        <Spin />
      </Card>
    )
  }

  if (error || !dictionaries) {
    return (
      <Alert
        message={t('pages.newPolicy.title')}
        description={error ?? 'Не удалось загрузить справочники'}
        type="error"
        showIcon
      />
    )
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>{t('pages.newPolicy.title')}</Title>
          <Paragraph>{t('pages.newPolicy.description')}</Paragraph>
        </div>

        <Steps current={currentStep} items={steps} />

        <Form<PolicyCreateFormValues>
          form={form}
          layout="vertical"
          initialValues={{
            brandId: dictionaries.carBrands[0]?.id,
            model: dictionaries.carBrands[0]?.models[0],
            registrationNumber: '01KG123ABC',
            vin: 'JTDBE32K020123456',
            year: 2020,
            power: 130,
            regionId: dictionaries.regions[0]?.id,
            durationId: dictionaries.durations[0]?.id,
            owner: {
              firstName: 'Azamat',
              lastName: 'Ibragimov',
              personalId: '12345678901234',
              dateOfBirth: dayjs().subtract(30, 'year'),
            },
            driverAccessType: 'LIMITED',
            drivers: [
              {
                firstName: 'Azamat',
                lastName: 'Ibragimov',
                personalId: '12345678901234',
                dateOfBirth: dayjs().subtract(30, 'year'),
                licenseNumber: 'KG1234567',
                licenseIssuedAt: dayjs().subtract(10, 'year'),
                bonusMalusClass: 3,
              },
            ],
          }}
        >
          {currentStep === 0 && <VehicleStep dictionaries={dictionaries} />}

          {currentStep === 1 && <ParticipantsStep />}

          {currentStep === 2 && (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Form.Item
                label="Срок страхования"
                name="durationId"
                rules={[{ required: true, message: 'Выберите срок страхования' }]}
              >
                <Select
                  options={dictionaries.durations.map((duration) => ({
                    value: duration.id,
                    label: duration.nameRu,
                  }))}
                />
              </Form.Item>

              {calculationResult && calculationInput && (
                <PremiumBreakdownCard
                  result={calculationResult}
                  input={calculationInput}
                  dictionaries={dictionaries}
                />
              )}
            </Space>
          )}

          {currentStep === 3 && (
            <Card size="small">
              <Title level={4}>Подтверждение</Title>
              <Text type="secondary">Здесь будет сводка и создание черновика.</Text>
            </Card>
          )}
        </Form>

        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Button disabled={isFirstStep} onClick={handlePrevious}>
            Назад
          </Button>

          <Button type="primary" onClick={handleNext}>
            {isLastStep ? 'Создать черновик' : 'Далее'}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}