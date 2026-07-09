import { apiClient } from '../../../shared/api'
import { getPolicyDrafts } from '../model/draftStorage'
import type { Policy } from '../model/types'

export async function getPolicy(id: string) {
  const draft = getPolicyDrafts().find((policy) => policy.id === id)

  if (draft) {
    return draft
  }

  const response = await apiClient.get<Policy>(`/policies/${id}`)

  return response.data
}
