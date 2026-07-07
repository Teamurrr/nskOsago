import { Alert, Button, Card, Form, Select, Space, Spin, Steps, Typography } from 'antd'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type Policy,savePolicyDraft } from '../../../entities/policy'
import { calculateAge, calculatePremium } from '../../../features/calculate-premium'
import { useDictionaries } from '../../calculator/model/useDictionaries'
import { PremiumBreakdownCard } from '../../calculator/ui/PremiumBreakdownCard'
import { ConfirmationStep } from './ConfirmationPage'
import { ParticipantsStep, type ParticipantsStepValues } from './ParticipantStep'
import { VehicleStep, type VehicleStepValues } from './VehicleStep'

const { Paragraph, Title } = Typography

interface PolicyCreateFormValues extends VehicleStepValues, ParticipantsStepValues {
  durationId: string
}

function generatePolicyNumber() {
  const randomPart = Math.floor(Math.random() * 900000 + 100000)

  return `OSAGO-2026-${randomPart}`
}

function calculateYearsSince(date: Date, currentDate = new Date()) {
  return calculateAge(date, currentDate)
}

export function PolicyCreatePage() {
  const { t, i18n } = useTranslation()
  const { data: dictionaries, isLoading, error } = useDictionaries()
  const [form] = Form.useForm<PolicyCreateFormValues>()
  const [currentStep, setCurrentStep] = useState(0)
  const [createdPolicyNumber, setCreatedPolicyNumber] = useState<string | null>(null)
  const [savedValues, setSavedValues] = useState<Partial<PolicyCreateFormValues>>({})

  Form.useWatch([], form)

  const currentValues = {
    ...savedValues,
    ...form.getFieldsValue(true),
  } as PolicyCreateFormValues

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
            ? calculateYearsSince(calculationLicenseIssuedAt.toDate())
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
  const isRussian = i18n.language === 'ru'
  const steps = [
    {
      title: t('pages.newPolicy.steps.vehicle.title'),
      description: t('pages.newPolicy.steps.vehicle.description'),
    },
    {
      title: t('pages.newPolicy.steps.participants.title'),
      description: t('pages.newPolicy.steps.participants.description'),
    },
    {
      title: t('pages.newPolicy.steps.calculation.title'),
      description: t('pages.newPolicy.steps.calculation.description'),
    },
    {
      title: t('pages.newPolicy.steps.confirmation.title'),
      description: t('pages.newPolicy.steps.confirmation.description'),
    },
  ]
  const isLastStep = currentStep === steps.length - 1

  const saveCurrentFormValues = () => {
    setSavedValues((previousValues) => ({
      ...previousValues,
      ...form.getFieldsValue(true),
    }))
  }

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
      await form.validateFields(['owner', 'driverAccessType'])

      if (form.getFieldValue('driverAccessType') === 'LIMITED') {
        await form.validateFields(['drivers'])
      }
    }

    if (currentStep === 2) {
      await form.validateFields(['durationId'])
    }

    saveCurrentFormValues()
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    saveCurrentFormValues()
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  const handleCreateDraft = () => {
    if (!calculationResult) {
      return
    }

    const policyNumber = generatePolicyNumber()
    const startsAt = dayjs()
    const duration = dictionaries?.durations.find((item) => item.id === currentValues.durationId)
    const endsAt = startsAt.add(duration?.months ?? 12, 'month').subtract(1, 'day')
    const drivers =
      currentValues.driverAccessType === 'NO_LIMITS' ? [] : (currentValues.drivers ?? [])

    const policy: Policy = {
      id: nanoid(),
      number: policyNumber,
      status: 'DRAFT',
      createdAt: startsAt.format('YYYY-MM-DD'),
      startsAt: startsAt.format('YYYY-MM-DD'),
      endsAt: endsAt.format('YYYY-MM-DD'),
      vehicle: {
        brandId: currentValues.brandId,
        model: currentValues.model,
        registrationNumber: currentValues.registrationNumber,
        vin: currentValues.vin,
        year: currentValues.year,
        power: currentValues.power,
        regionId: currentValues.regionId,
      },
      owner: {
        firstName: currentValues.owner.firstName,
        lastName: currentValues.owner.lastName,
        dateOfBirth: currentValues.owner.dateOfBirth.format('YYYY-MM-DD'),
        personalId: currentValues.owner.personalId,
      },
      drivers: drivers.map((driver) => ({
        firstName: driver.firstName,
        lastName: driver.lastName,
        dateOfBirth: driver.dateOfBirth.format('YYYY-MM-DD'),
        personalId: driver.personalId,
        licenseNumber: driver.licenseNumber,
        licenseIssuedAt: driver.licenseIssuedAt.format('YYYY-MM-DD'),
        bonusMalusClass: driver.bonusMalusClass,
      })),
      driverAccessType: currentValues.driverAccessType,
      durationId: currentValues.durationId,
      premium: calculationResult,
    }

    savePolicyDraft(policy)
    setCreatedPolicyNumber(policyNumber)
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
        description={error ?? t('pages.newPolicy.loadingError')}
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
          preserve
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
                label={t('pages.newPolicy.calculation.duration')}
                name="durationId"
                rules={[
                  { required: true, message: t('pages.newPolicy.validation.selectDuration') },
                ]}
              >
                <Select
                  options={dictionaries.durations.map((duration) => ({
                    value: duration.id,
                    label: isRussian ? duration.nameRu : duration.nameEn,
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
            <ConfirmationStep
              values={currentValues}
              dictionaries={dictionaries}
              calculationInput={calculationInput}
              calculationResult={calculationResult}
              createdPolicyNumber={createdPolicyNumber}
              onCreateDraft={handleCreateDraft}
            />
          )}
        </Form>

        {!createdPolicyNumber && (
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Button disabled={isFirstStep} onClick={handlePrevious}>
              {t('pages.newPolicy.actions.back')}
            </Button>

            {!isLastStep && (
              <Button type="primary" onClick={handleNext}>
                {t('pages.newPolicy.actions.next')}
              </Button>
            )}
          </Space>
        )}
      </Space>
    </Card>
  )
}
