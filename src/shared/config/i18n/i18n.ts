import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { defaultLanguage, en, fallbackLanguage, ru } from './index'

const resources = {
  ru,
  en,
}

void i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }