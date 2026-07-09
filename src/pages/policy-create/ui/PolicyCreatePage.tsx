import {
  Alert,
  Button,
  Card,
  Descriptions,
  Form,
  Select,
  Space,
  Spin,
  Steps,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type Policy, savePolicyDraft } from '../../../entities/policy'
import {
  calculateAge,
  calculatePremium,
  type PremiumCalculationInput,
  type PremiumCalculationResult,
} from '../../../features/calculate-premium'
import { useDictionaries } from '../../calculator/model/useDictionaries'
import { PremiumBreakdownCard } from '../../calculator/ui/PremiumBreakdownCard'
import { ConfirmationStep } from './ConfirmationPage'
import { ParticipantsStep, type ParticipantsStepValues } from './ParticipantStep'
import { VehicleStep, type VehicleStepValues } from './VehicleStep'

const { Paragraph, Title } = Typography

interface PolicyCreateFormValues extends VehicleStepValues, ParticipantsStepValues {
  durationId: string
}

interface SelectedCalculationDriver {
  fullName: string
  age: number
  experience: number
  bonusMalusClass: number
}

interface PremiumCalculationCandidate {
  input: PremiumCalculationInput
  selectedDriver: SelectedCalculationDriver | null
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

  const canCalculatePremium =
    dictionaries &&
    currentValues.regionId &&
    currentValues.power &&
    currentValues.driverAccessType &&
    currentValues.durationId

  const driverCalculationCandidates: PremiumCalculationCandidate[] =
    canCalculatePremium &&
    currentValues.driverAccessType === 'LIMITED' &&
    currentValues.drivers?.length
      ? currentValues.drivers
          .filter((driver): driver is NonNullable<typeof driver> => Boolean(driver?.dateOfBirth))
          .map((driver, index) => {
            const age = calculateAge(driver.dateOfBirth.toDate())
            const experience = driver.licenseIssuedAt
              ? calculateYearsSince(driver.licenseIssuedAt.toDate())
              : 0
            const bonusMalusClass = driver.bonusMalusClass ?? 3
            const fullName = `${driver.firstName ?? ''} ${driver.lastName ?? ''}`.trim()

            return {
              input: {
                vehicleTypeId: 'passenger_car',
                regionId: currentValues.regionId,
                power: currentValues.power,
                driverAge: age,
                driverExperience: experience,
                driverAccessType: currentValues.driverAccessType,
                durationId: currentValues.durationId,
                bonusMalusClass,
              },
              selectedDriver: {
                fullName:
                  fullName ||
                  t('pages.newPolicy.calculation.driverFallback', { value: index + 1 }),
                age,
                experience,
                bonusMalusClass,
              },
            }
          })
      : []

  const fallbackBirthDate =
    currentValues.drivers?.[0]?.dateOfBirth ?? currentValues.owner?.dateOfBirth
  const fallbackLicenseIssuedAt = currentValues.drivers?.[0]?.licenseIssuedAt

  const fallbackAge = fallbackBirthDate ? calculateAge(fallbackBirthDate.toDate()) : null
  const fallbackExperience = fallbackLicenseIssuedAt
    ? calculateYearsSince(fallbackLicenseIssuedAt.toDate())
    : 0
  const fallbackBonusMalusClass = currentValues.drivers?.[0]?.bonusMalusClass ?? 3
  const fallbackCalculationCandidate: PremiumCalculationCandidate | null =
    canCalculatePremium && fallbackBirthDate
      ? {
          input: {
            vehicleTypeId: 'passenger_car',
            regionId: currentValues.regionId,
            power: currentValues.power,
            driverAge: fallbackAge ?? 0,
            driverExperience: fallbackExperience,
            driverAccessType: currentValues.driverAccessType,
            durationId: currentValues.durationId,
            bonusMalusClass: fallbackBonusMalusClass,
          },
          selectedDriver:
            currentValues.driverAccessType === 'LIMITED' && currentValues.drivers?.[0]
              ? {
                  fullName:
                    `${currentValues.drivers[0].firstName ?? ''} ${
                      currentValues.drivers[0].lastName ?? ''
                    }`.trim() || t('pages.newPolicy.calculation.driverFallback', { value: 1 }),
                  age: fallbackAge ?? 0,
                  experience: fallbackExperience,
                  bonusMalusClass: fallbackBonusMalusClass,
                }
              : null,
        }
      : null

  const calculationCandidates =
    driverCalculationCandidates.length > 0
      ? driverCalculationCandidates
      : fallbackCalculationCandidate
        ? [fallbackCalculationCandidate]
        : []

  const calculation = dictionaries
    ? calculationCandidates.reduce<{
        input: PremiumCalculationInput
        result: PremiumCalculationResult
        selectedDriver: SelectedCalculationDriver | null
      } | null>((bestCalculation, candidate) => {
        const result = calculatePremium({
          input: candidate.input,
          dictionaries,
        })

        if (!bestCalculation || result.total > bestCalculation.result.total) {
          return {
            input: candidate.input,
            result,
            selectedDriver: candidate.selectedDriver,
          }
        }

        return bestCalculation
      }, null)
    : null

  const calculationInput = calculation?.input ?? null
  const calculationResult = calculation?.result ?? null
  const selectedCalculationDriver = calculation?.selectedDriver ?? null

  const isFirstStep = currentStep === 0
  const isRussian = i18n.language === 'ru'
  const steps = [
    {
      title: t('pages.newPolicy.steps.vehicle.title'),
      content: t('pages.newPolicy.steps.vehicle.description'),
    },
    {
      title: t('pages.newPolicy.steps.participants.title'),
      content: t('pages.newPolicy.steps.participants.description'),
    },
    {
      title: t('pages.newPolicy.steps.calculation.title'),
      content: t('pages.newPolicy.steps.calculation.description'),
    },
    {
      title: t('pages.newPolicy.steps.confirmation.title'),
      content: t('pages.newPolicy.steps.confirmation.description'),
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
        title={t('pages.newPolicy.title')}
        description={error ?? t('pages.newPolicy.loadingError')}
        type="error"
        showIcon
      />
    )
  }

  return (
    <Card>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>{t('pages.newPolicy.title')}</Title>
          <Paragraph>{t('pages.newPolicy.description')}</Paragraph>
        </div>

        <Steps current={currentStep} items={steps} />

        <Form<PolicyCreateFormValues>
          form={form}
          layout="vertical"
          preserve
          onSubmitCapture={(event) => event.preventDefault()}
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
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
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
                <>
                  {selectedCalculationDriver && (
                    <Card size="small" title={t('pages.newPolicy.calculation.selectedDriver')}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label={t('pages.newPolicy.calculation.fullName')}>
                          {selectedCalculationDriver.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('pages.newPolicy.calculation.age')}>
                          {selectedCalculationDriver.age}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('pages.newPolicy.calculation.experience')}>
                          {selectedCalculationDriver.experience}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t('pages.newPolicy.participants.bonusMalusClass')}
                        >
                          {selectedCalculationDriver.bonusMalusClass}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('pages.newPolicy.confirmation.premium')}>
                          {calculationResult.total} {t('common.currency')}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  )}

                  <PremiumBreakdownCard
                    result={calculationResult}
                    input={calculationInput}
                    dictionaries={dictionaries}
                  />
                </>
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
