import { Alert, Button, Card } from 'antd'
import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

import { i18n } from '../../../../shared/config/i18n/i18n'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card style={{ margin: 24 }}>
          <Alert
            type="error"
            showIcon
            title={i18n.t('common.errorBoundary.title')}
            description={i18n.t('common.errorBoundary.description')}
            action={
              <Button onClick={this.handleReload}>
                {i18n.t('common.errorBoundary.reload')}
              </Button>
            }
          />
        </Card>
      )
    }

    return this.props.children
  }
}
