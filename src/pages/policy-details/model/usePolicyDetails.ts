import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getPolicy, type Policy } from '../../../entities/policy'

interface UsePolicyDetailsResult {
  data: Policy | null
  isLoading: boolean
  error: string | null
}

export function usePolicyDetails(policyId: string | undefined): UsePolicyDetailsResult {
  const { t } = useTranslation()
  const [data, setData] = useState<Policy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadPolicy() {
      if (!policyId) {
        setError(t('common.errors.missingPolicyId'))
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const policy = await getPolicy(policyId)

        if (isMounted) {
          setData(policy)
        }
      } catch {
        if (isMounted) {
          setError(t('common.errors.failedToLoadPolicy'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPolicy()

    return () => {
      isMounted = false
    }
  }, [policyId, t])

  return { data, isLoading, error }
}
