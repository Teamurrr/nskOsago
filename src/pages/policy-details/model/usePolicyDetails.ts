import { useEffect, useState } from 'react'

import { getPolicy, type Policy } from '../../../entities/policy'

interface UsePolicyDetailsResult {
  data: Policy | null
  isLoading: boolean
  error: string | null
}

export function usePolicyDetails(policyId: string | undefined): UsePolicyDetailsResult {
  const [data, setData] = useState<Policy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadPolicy() {
      if (!policyId) {
        setError('Policy id is missing')
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
          setError('Failed to load policy.')
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
  }, [policyId])

  return { data, isLoading, error }
}