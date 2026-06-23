import { useTranslation } from 'react-i18next';

export function useDirection() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const direction = isRtl ? 'rtl' : 'ltr';

  return {
    isRtl,
    direction,
    drawerAnchor: isRtl ? 'right' as const : 'left' as const,
    arrowFlip: isRtl ? 'scaleX(-1)' : 'none',
  };
}
