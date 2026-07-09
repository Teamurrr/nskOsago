import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getPolicies, type Policy } from '../../../entities/policy'

interface UsePoliciesListResult {
  data: Policy[]
  isLoading: boolean
  error: string | null
}

export function usePoliciesList(): UsePoliciesListResult {
  const { t } = useTranslation()
  const [data, setData] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadPolicies() {
      try {
        setIsLoading(true)
        setError(null)

        const policies = await getPolicies()

        if (isMounted) {
          setData(policies)
        }
      } catch {
        if (isMounted) {
          setError(t('common.errors.failedToLoadPolicies'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPolicies()

    return () => {
      isMounted = false
    }
  }, [t])

  return { data, isLoading, error }
}
