import { delay,http, HttpResponse } from 'msw'

import { dictionaries } from '../config/mock-data/dictionaries'
import { policies } from '../config/mock-data/policies'

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
]