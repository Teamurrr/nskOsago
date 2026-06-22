import { Alert, Card, Spin, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { useDictionaries } from '../model/useDictionaries'

const { Paragraph, Title } = Typography

export function CalculatorPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useDictionaries()

  return (
    <Card>
      <Title level={2}>{t('pages.calculator.title')}</Title>
      <Paragraph>{t('pages.calculator.description')}</Paragraph>

      {isLoading && <Spin />}

      {error && <Alert message={error} type="error" showIcon />}

      {data && (
        <Paragraph>
          Dictionaries loaded: {data.regions.length} regions, {data.carBrands.length} brands.
        </Paragraph>
      )}
    </Card>
  )
}