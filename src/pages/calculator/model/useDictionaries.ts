import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getDictionaries, type OsagoDictionaries } from '../../../entities/dictionary'

interface UseDictionariesResult {
  data: OsagoDictionaries | null
  isLoading: boolean
  error: string | null
}

export function useDictionaries(): UseDictionariesResult {
  const { t } = useTranslation()
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
          setError(t('common.errors.failedToLoadDictionaries'))
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
  }, [t])

  return { data, isLoading, error }
}
