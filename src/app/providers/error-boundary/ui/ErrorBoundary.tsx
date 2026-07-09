import { Alert, Button, Card } from 'antd'
import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

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
            title="Something went wrong"
            description="Reload the page and try again. If the problem repeats, check the console details."
            action={<Button onClick={this.handleReload}>Reload</Button>}
          />
        </Card>
      )
    }

    return this.props.children
  }
}
