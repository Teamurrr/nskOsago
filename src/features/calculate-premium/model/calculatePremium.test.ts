import { describe, expect, it } from 'vitest'

import { dictionaries } from '../../../shared/config/mock-data/dictionaries'
import { calculatePremium } from './calculatePremium'
import type { PremiumCalculationInput } from './types'

const baseInput: PremiumCalculationInput = {
  vehicleTypeId: 'passenger_car',
  regionId: 'bishkek',
  power: 130,
  driverAge: 30,
  driverExperience: 5,
  driverAccessType: 'LIMITED',
  durationId: 'year',
  bonusMalusClass: 3,
}

describe('calculatePremium', () => {
  it('calculates a standard yearly limited-driver premium', () => {
    const result = calculatePremium({
      input: baseInput,
      dictionaries,
    })

    expect(result.total).toBe(1690)
    // expect(result.total).toBe(9999)

  })

  it('applies the young inexperienced driver coefficient', () => {
    const result = calculatePremium({
      input: {
        ...baseInput,
        driverAge: 22,
        driverExperience: 1,
      },
      dictionaries,
    })

    expect(result.total).toBe(3042)
    expect(result.breakdown.ageExperienceCoefficient).toBe(1.8)
  })

  it('applies the no-limits driver access coefficient', () => {
    const result = calculatePremium({
      input: {
        ...baseInput,
        driverAccessType: 'NO_LIMITS',
      },
      dictionaries,
    })

    expect(result.total).toBe(3042)
    
    expect(result.breakdown.driverAccessCoefficient).toBe(1.8)
  })

  it('applies short duration and bonus-malus discounts', () => {
    const result = calculatePremium({
      input: {
        ...baseInput,
        regionId: 'other',
        power: 90,
        durationId: 'quarter',
        bonusMalusClass: 13,
      },
      dictionaries,
    })

    expect(result.total).toBe(250)
  })
})