import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useRTL = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language, isRTL]);

  return { isRTL, toggleLanguage: () => {
    i18n.changeLanguage(isRTL ? 'en' : 'ar');
  }};
};