import { useLanguage } from '@/contexts/language-context';

/**
 * Custom hook for translations with namespace support
 * @param namespace - Optional namespace to prefix all translation keys (e.g., 'auth', 'common')
 * @returns Translation function and language controls
 *
 * @example
 * // Without namespace
 * const { t } = useTranslation();
 * t('auth.login.title'); // "Welcome back"
 *
 * // With namespace
 * const { t } = useTranslation('auth');
 * t('login.title'); // "Welcome back"
 */
export function useTranslation(namespace?: string) {
  const { language, setLanguage, t: translateFn, isLoading } = useLanguage();

  const t = (key: string, options?: Record<string, any>): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return translateFn(fullKey, options);
  };

  return {
    t,
    language,
    setLanguage,
    isLoading,
  };
}
