import { apiClient } from '../../../shared/api'
import type {
  InspectionPhotoPayload,
  InspectionVerificationResult,
} from '../model/types'

export async function verifyInspection(policyId: string, photos: InspectionPhotoPayload[]) {
  const response = await apiClient.post<InspectionVerificationResult>(
    `/policies/${policyId}/inspection/verify`,
    { photos },
  )

  return response.data
}