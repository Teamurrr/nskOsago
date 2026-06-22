import { useEffect, useState } from 'react'

import { getDictionaries, type OsagoDictionaries } from '../../../entities/dictionary'

interface UseDictionariesResult {
  data: OsagoDictionaries | null
  isLoading: boolean
  error: string | null
}

export function useDictionaries(): UseDictionariesResult {
  const [data, setData] = useState<OsagoDictionaries | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDictionaries() {
      try {
        setIsLoading(true)
        setError(null)

        const dictionaries = await getDictionaries()

        if (isMounted) {
          setData(dictionaries)
        }
      } catch {
        if (isMounted) {
          setError('Failed to load dictionaries.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadDictionaries()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, isLoading, error }
}