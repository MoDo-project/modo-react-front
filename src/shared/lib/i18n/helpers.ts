import { useTranslation } from 'react-i18next'

/**
 * 언어 토글 Hook
 */
export const useLanguageToggle = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(newLang)
  }

  return {
    toggleLanguage,
    currentLanguage: i18n.language,
  }
}
