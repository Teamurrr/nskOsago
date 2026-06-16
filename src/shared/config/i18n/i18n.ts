import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  type AppLanguage,
  defaultLanguage,
  en,
  fallbackLanguage,
  i18nStorageKey,
  languages,
  ru,
} from './index'

const savedLanguage = localStorage.getItem(i18nStorageKey)

const initialLanguage: AppLanguage =
  savedLanguage !== null && languages.includes(savedLanguage as AppLanguage)
    ? (savedLanguage as AppLanguage)
    : defaultLanguage

const resources = {
  ru,
  en,
}

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }