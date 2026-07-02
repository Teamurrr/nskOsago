import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Input, InputNumber, Radio, Space, Typography } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'

const { Title } = Typography

export interface PersonStepValues {
  firstName: string
  lastName: string
  dateOfBirth: Dayjs
  personalId: string
}

export interface DriverStepValues extends PersonStepValues {
  licenseNumber: string
  licenseIssuedAt: Dayjs
  bonusMalusClass: number
}

export interface ParticipantsStepValues {
  owner: PersonStepValues
  driverAccessType: 'LIMITED' | 'NO_LIMITS'
  drivers: DriverStepValues[]
}

export function ParticipantsStep() {
  const driverAccessType = Form.useWatch('driverAccessType')

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card size="small">
        <Title level={4}>Собственник</Title>

        <Form.Item
          label="Имя"
          name={['owner', 'firstName']}
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Фамилия"
          name={['owner', 'lastName']}
          rules={[{ required: true, message: 'Введите фамилию' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ИНН"
          name={['owner', 'personalId']}
          rules={[
            { required: true, message: 'Введите ИНН' },
            { pattern: /^\d{14}$/, message: 'ИНН должен содержать 14 цифр' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Дата рождения"
          name={['owner', 'dateOfBirth']}
          rules={[{ required: true, message: 'Введите дату рождения' }]}
        >
          <DatePicker
            format="DD.MM.YYYY"
            disabledDate={(current) => current.isAfter(dayjs(), 'day')}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Card>

      <Card size="small">
        <Title level={4}>Допуск водителей</Title>

        <Form.Item
          name="driverAccessType"
          rules={[{ required: true, message: 'Выберите тип допуска' }]}
        >
          <Radio.Group
            options={[
              { label: 'Ограниченный список', value: 'LIMITED' },
              { label: 'Без ограничений', value: 'NO_LIMITS' },
            ]}
          />
        </Form.Item>
      </Card>

      {driverAccessType !== 'NO_LIMITS' && (
        <Card size="small">
          <Title level={4}>Водители</Title>

          <Form.List
            name="drivers"
            rules={[
              {
                validator: async (_, drivers: DriverStepValues[] | undefined) => {
                  if (!drivers || drivers.length < 1) {
                    throw new Error('Добавьте минимум одного водителя')
                  }

                  if (drivers.length > 4) {
                    throw new Error('Можно добавить максимум 4 водителей')
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    title={`Водитель ${index + 1}`}
                    extra={
                      fields.length > 1 ? (
                        <Button
                          danger
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      ) : null
                    }
                  >
                    <Form.Item
                      label="Имя"
                      name={[field.name, 'firstName']}
                      rules={[{ required: true, message: 'Введите имя' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Фамилия"
                      name={[field.name, 'lastName']}
                      rules={[{ required: true, message: 'Введите фамилию' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="ИНН"
                      name={[field.name, 'personalId']}
                      rules={[
                        { required: true, message: 'Введите ИНН' },
                        { pattern: /^\d{14}$/, message: 'ИНН должен содержать 14 цифр' },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Дата рождения"
                      name={[field.name, 'dateOfBirth']}
                      rules={[{ required: true, message: 'Введите дату рождения' }]}
                    >
                      <DatePicker
                        format="DD.MM.YYYY"
                        disabledDate={(current) => current.isAfter(dayjs(), 'day')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Номер прав"
                      name={[field.name, 'licenseNumber']}
                      rules={[{ required: true, message: 'Введите номер прав' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Дата выдачи прав"
                      name={[field.name, 'licenseIssuedAt']}
                      rules={[{ required: true, message: 'Введите дату выдачи прав' }]}
                    >
                      <DatePicker
                        format="DD.MM.YYYY"
                        disabledDate={(current) => current.isAfter(dayjs(), 'day')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="КБМ"
                      name={[field.name, 'bonusMalusClass']}
                      rules={[{ required: true, message: 'Введите КБМ' }]}
                    >
                      <InputNumber min={0} max={13} style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>
                ))}

                {fields.length < 4 && (
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
                    Добавить водителя
                  </Button>
                )}

                <Form.ErrorList errors={errors} />
              </Space>
            )}
          </Form.List>
        </Card>
      )}
    </Space>
  )
}