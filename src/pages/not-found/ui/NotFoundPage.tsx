import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'

export function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title={t('pages.notFound.title')}
      subTitle={t('pages.notFound.description')}
      extra={
        <Button type="primary" onClick={() => navigate(routePaths.policies)}>
          {t('pages.notFound.action')}
        </Button>
      }
    />
  )
}