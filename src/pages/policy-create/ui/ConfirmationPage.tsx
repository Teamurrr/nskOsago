import { Button, Card, Descriptions, Result, Space, Typography } from 'antd'

import type { OsagoDictionaries } from '../../../entities/dictionary'
import type {
  PremiumCalculationInput,
  PremiumCalculationResult,
} from '../../../features/calculate-premium'
import type { ParticipantsStepValues } from './ParticipantStep'
import type { VehicleStepValues } from './VehicleStep'

const { Text, Title } = Typography

interface ConfirmationStepProps {
  values: VehicleStepValues & ParticipantsStepValues & { durationId: string }
  dictionaries: OsagoDictionaries
  calculationInput: PremiumCalculationInput | null
  calculationResult: PremiumCalculationResult | null
  createdPolicyNumber: string | null
  onCreateDraft: () => void
}

export function ConfirmationStep({
  values,
  dictionaries,
  calculationInput,
  calculationResult,
  createdPolicyNumber,
  onCreateDraft,
}: ConfirmationStepProps) {
  const brand = dictionaries.carBrands.find((item) => item.id === values.brandId)
  const region = dictionaries.regions.find((item) => item.id === values.regionId)
  const duration = dictionaries.durations.find((item) => item.id === values.durationId)

  if (createdPolicyNumber) {
    return (
      <Result
        status="success"
        title="Черновик полиса создан"
        subTitle={`Номер полиса: ${createdPolicyNumber}`}
      />
    )
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card size="small">
        <Title level={4}>Автомобиль</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label="Марка">{brand?.name}</Descriptions.Item>
          <Descriptions.Item label="Модель">{values.model}</Descriptions.Item>
          <Descriptions.Item label="Госномер">{values.registrationNumber}</Descriptions.Item>
          <Descriptions.Item label="VIN">{values.vin}</Descriptions.Item>
          <Descriptions.Item label="Год выпуска">{values.year}</Descriptions.Item>
          <Descriptions.Item label="Мощность">{values.power}</Descriptions.Item>
          <Descriptions.Item label="Регион">{region?.nameRu}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small">
        <Title level={4}>Собственник</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label="Имя">{values.owner?.firstName}</Descriptions.Item>
          <Descriptions.Item label="Фамилия">{values.owner?.lastName}</Descriptions.Item>
          <Descriptions.Item label="ИНН">{values.owner?.personalId}</Descriptions.Item>
          <Descriptions.Item label="Дата рождения">
            {values.owner?.dateOfBirth?.format('DD.MM.YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small">
        <Title level={4}>Водители</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label="Тип допуска">
            {values.driverAccessType === 'NO_LIMITS' ? 'Без ограничений' : 'Ограниченный список'}
          </Descriptions.Item>

          {values.driverAccessType === 'LIMITED' && (
            <Descriptions.Item label="Количество водителей">
              {values.drivers?.length ?? 0}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card size="small">
        <Title level={4}>Расчёт</Title>

        <Descriptions column={1} size="small">
          <Descriptions.Item label="Срок">{duration?.nameRu}</Descriptions.Item>
          <Descriptions.Item label="Премия">
            {calculationResult ? `${calculationResult.total} KGS` : 'Не рассчитано'}
          </Descriptions.Item>
          <Descriptions.Item label="КБМ">
            {calculationInput?.bonusMalusClass ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button type="primary" size="large" onClick={onCreateDraft}>
        Создать черновик
      </Button>

      <Text type="secondary">
        После создания черновика будет сгенерирован демо-номер полиса.
      </Text>
    </Space>
  )
}