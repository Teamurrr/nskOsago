import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Input, InputNumber, Radio, Space, Typography } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'

const { Title } = Typography
const disabledHtmlFor = null as unknown as string

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
  const { t } = useTranslation()
  const driverAccessType = Form.useWatch('driverAccessType')

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card size="small">
        <Title level={4}>{t('pages.newPolicy.participants.owner')}</Title>

        <Form.Item
          label={t('pages.newPolicy.participants.firstName')}
          name={['owner', 'firstName']}
          rules={[{ required: true, message: t('pages.newPolicy.validation.enterFirstName') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('pages.newPolicy.participants.lastName')}
          name={['owner', 'lastName']}
          rules={[{ required: true, message: t('pages.newPolicy.validation.enterLastName') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('pages.newPolicy.participants.personalId')}
          name={['owner', 'personalId']}
          rules={[
            { required: true, message: t('pages.newPolicy.validation.enterPersonalId') },
            { pattern: /^\d{14}$/, message: t('pages.newPolicy.validation.personalIdFormat') },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('pages.newPolicy.participants.dateOfBirth')}
          name={['owner', 'dateOfBirth']}
          rules={[{ required: true, message: t('pages.newPolicy.validation.enterBirthDate') }]}
        >
          <DatePicker
            format="DD.MM.YYYY"
            disabledDate={(current) => current.isAfter(dayjs(), 'day')}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Card>

      <Card size="small">
        <Title level={4}>{t('pages.newPolicy.participants.driversAccess')}</Title>

        <Form.Item
          name="driverAccessType"
          htmlFor={disabledHtmlFor}
          rules={[{ required: true, message: t('pages.newPolicy.validation.selectAccessType') }]}
        >
          <Radio.Group
            options={[
              { label: t('pages.newPolicy.participants.limited'), value: 'LIMITED' },
              { label: t('pages.newPolicy.participants.noLimits'), value: 'NO_LIMITS' },
            ]}
          />
        </Form.Item>
      </Card>

      {driverAccessType !== 'NO_LIMITS' && (
        <Card size="small">
          <Title level={4}>{t('pages.newPolicy.participants.drivers')}</Title>

          <Form.List
            name="drivers"
            rules={[
              {
                validator: async (_, drivers: DriverStepValues[] | undefined) => {
                  if (!drivers || drivers.length < 1) {
                    throw new Error(t('pages.newPolicy.validation.minOneDriver'))
                  }

                  if (drivers.length > 4) {
                    throw new Error(t('pages.newPolicy.validation.maxFourDrivers'))
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    title={t('pages.newPolicy.participants.driver', { value: index + 1 })}
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
                      label={t('pages.newPolicy.participants.firstName')}
                      name={[field.name, 'firstName']}
                      rules={[
                        { required: true, message: t('pages.newPolicy.validation.enterFirstName') },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={t('pages.newPolicy.participants.lastName')}
                      name={[field.name, 'lastName']}
                      rules={[
                        { required: true, message: t('pages.newPolicy.validation.enterLastName') },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={t('pages.newPolicy.participants.personalId')}
                      name={[field.name, 'personalId']}
                      rules={[
                        { required: true, message: t('pages.newPolicy.validation.enterPersonalId') },
                        {
                          pattern: /^\d{14}$/,
                          message: t('pages.newPolicy.validation.personalIdFormat'),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={t('pages.newPolicy.participants.dateOfBirth')}
                      name={[field.name, 'dateOfBirth']}
                      rules={[
                        { required: true, message: t('pages.newPolicy.validation.enterBirthDate') },
                      ]}
                    >
                      <DatePicker
                        format="DD.MM.YYYY"
                        disabledDate={(current) => current.isAfter(dayjs(), 'day')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t('pages.newPolicy.participants.licenseNumber')}
                      name={[field.name, 'licenseNumber']}
                      rules={[
                        {
                          required: true,
                          message: t('pages.newPolicy.validation.enterLicenseNumber'),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={t('pages.newPolicy.participants.licenseIssuedAt')}
                      name={[field.name, 'licenseIssuedAt']}
                      rules={[
                        {
                          required: true,
                          message: t('pages.newPolicy.validation.enterLicenseIssuedAt'),
                        },
                      ]}
                    >
                      <DatePicker
                        format="DD.MM.YYYY"
                        disabledDate={(current) => current.isAfter(dayjs(), 'day')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t('pages.newPolicy.participants.bonusMalusClass')}
                      name={[field.name, 'bonusMalusClass']}
                      rules={[{ required: true, message: t('pages.newPolicy.validation.enterBonusMalus') }]}
                    >
                      <InputNumber min={0} max={13} style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>
                ))}

                {fields.length < 4 && (
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
                    {t('pages.newPolicy.participants.addDriver')}
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
