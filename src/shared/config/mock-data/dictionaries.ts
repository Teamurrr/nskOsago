import type { OsagoDictionaries } from '../../../entities/dictionary'

export const dictionaries: OsagoDictionaries = {
  regions: [
    { id: 'bishkek', nameRu: 'Бишкек', nameEn: 'Bishkek', kt: 1.3 },
    { id: 'osh', nameRu: 'Ош', nameEn: 'Osh', kt: 1.2 },
    {
      id: 'region_center',
      nameRu: 'Областной центр',
      nameEn: 'Regional center',
      kt: 1.1,
    },
    { id: 'other', nameRu: 'Прочее', nameEn: 'Other', kt: 1.0 },
  ],
  powerTiers: [
    { max: 100, k: 1.0 },
    { max: 150, k: 1.3 },
    { max: null, k: 1.6 },
  ],
  durations: [
    { id: 'year', nameRu: '1 год', nameEn: '1 year', months: 12, k: 1.0 },
    { id: 'half', nameRu: '6 месяцев', nameEn: '6 months', months: 6, k: 0.7 },
    { id: 'quarter', nameRu: '3 месяца', nameEn: '3 months', months: 3, k: 0.5 },
  ],
  bonusMalus: [
    { class: 0, k: 2.45 },
    { class: 3, k: 1.0 },
    { class: 13, k: 0.5 },
  ],
  carBrands: [
    { id: 'toyota', name: 'Toyota', models: ['Camry', 'Corolla', 'Land Cruiser'] },
    { id: 'honda', name: 'Honda', models: ['Civic', 'CR-V', 'Fit'] },
    { id: 'mercedes', name: 'Mercedes-Benz', models: ['E 200', 'ML 320', 'Sprinter'] },
  ],
}