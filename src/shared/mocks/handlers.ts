import { delay, http, HttpResponse } from 'msw'

import type { InspectionPhotoPayload } from '../../entities/policy'
import { dictionaries } from '../config/mock-data/dictionaries'
import { policies } from '../config/mock-data/policies'

function getInspectionVerdict(confidence: number) {
  if (confidence >= 85) {
    return {
      status: 'APPROVED' as const,
      issues: ['Inspection approved automatically'],
    }
  }

  if (confidence < 35) {
    return {
      status: 'REJECTED' as const,
      issues: ['Inspection rejected automatically'],
    }
  }

  return {
    status: 'MANUAL_REVIEW' as const,
    issues: ['Inspection sent to manual review'],
  }
}

function calculateConfidence(photos: InspectionPhotoPayload[]) {
  const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0)
  const hasEnoughPhotos = photos.length >= 3
  const hasLargeEnoughFiles = totalSize > 150_000

  if (!hasEnoughPhotos) {
    return 28
  }

  if (!hasLargeEnoughFiles) {
    return 62
  }

  return 91
}

export const handlers = [
  http.get('/api/dictionaries', async () => {
    await delay(400)

    return HttpResponse.json(dictionaries)
  }),

  http.get('/api/policies', async () => {
    await delay(500)

    return HttpResponse.json(policies)
  }),

  http.get('/api/policies/:id', async ({ params }) => {
    await delay(300)

    const policy = policies.find((item) => item.id === params.id)

    if (!policy) {
      return HttpResponse.json({ message: 'Policy not found' }, { status: 404 })
    }

    return HttpResponse.json(policy)
  }),

  http.post('/api/policies/:id/inspection/verify', async ({ request }) => {
    await delay(1200)

    let photos: InspectionPhotoPayload[] = []

    try {
      const body = (await request.json()) as { photos?: InspectionPhotoPayload[] }
      photos = Array.isArray(body.photos) ? body.photos : []
    } catch {
      return HttpResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    if (photos.length === 0) {
      return HttpResponse.json(
        { message: 'At least one inspection photo is required' },
        { status: 400 },
      )
    }

    const confidence = calculateConfidence(photos)
    const verdict = getInspectionVerdict(confidence)

    return HttpResponse.json({
      confidence,
      ...verdict,
    })
  }),
]
