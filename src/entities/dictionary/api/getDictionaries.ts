import { apiClient } from '../../../shared/api'
import type { OsagoDictionaries } from '../model/types'

export async function getDictionaries() {
  const response = await apiClient.get<OsagoDictionaries>('/dictionaries')

  return response.data
}