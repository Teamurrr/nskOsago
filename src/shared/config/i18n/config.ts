export const defaultLanguage = 'ru'
export const fallbackLanguage = 'en'

export const languages = ['ru', 'en'] as const

export type AppLanguage = (typeof languages)[number]

export const languageLabels: Record<AppLanguage, string> = {
  ru: 'RU',
  en: 'EN',
}