import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="Page not found."
      extra={
        <Button type="primary" onClick={() => navigate(routePaths.policies)}>
          Go to policies
        </Button>
      }
    />
  )
}
