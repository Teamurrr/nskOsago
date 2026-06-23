import type { Dayjs } from 'dayjs'

import type { PremiumCalculationInput } from '../../../features/calculate-premium'

export interface CalculatorFormValues extends Omit<PremiumCalculationInput, 'driverAge'> {
  ownerBirthDate: Dayjs
}
