import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  t: (key: string, options?: Record<string, any>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = ['en', 'tr'];
const DEFAULT_LANGUAGE = 'en';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);
  const { getCurrentUser, updateUser } = useAuth();

  // Load translations for current language
  const loadTranslations = useCallback(async (lang: string) => {
    try {
      console.log('[LanguageContext] Loading translations for language:', lang);
      setIsLoading(true);

      // Load all namespace files
      const namespaces = ['common', 'auth', 'settings', 'dashboard', 'tasks', 'projects', 'workspace'];
      const loadedTranslations: Translations = {};

      for (const ns of namespaces) {
        try {
          const url = `/locales/${lang}/${ns}.json`;
          console.log('[LanguageContext] Fetching:', url);
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            loadedTranslations[ns] = data;
            console.log(`[LanguageContext] Loaded ${ns}.json successfully`);
          } else {
            console.warn(`Failed to load ${ns}.json for language ${lang}, status:`, response.status);
          }
        } catch (error) {
          console.error(`Error loading ${ns}.json:`, error);
        }
      }

      console.log('[LanguageContext] All translations loaded:', Object.keys(loadedTranslations));
      setTranslations(loadedTranslations);
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      console.log('[LanguageContext] Initializing language...');
      const user = getCurrentUser();
      console.log('[LanguageContext] Current user:', user);

      if (user?.language && SUPPORTED_LANGUAGES.includes(user.language)) {
        // Use user's saved language
        console.log('[LanguageContext] Using user saved language:', user.language);
        setCurrentLanguage(user.language);
      } else {
        // Check localStorage
        const savedLang = localStorage.getItem('userLanguage');
        console.log('[LanguageContext] Checking localStorage:', savedLang);
        if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
          console.log('[LanguageContext] Using localStorage language:', savedLang);
          setCurrentLanguage(savedLang);
        } else {
          // Detect browser language
          const browserLang = navigator.language.split('-')[0];
          const detectedLang = SUPPORTED_LANGUAGES.includes(browserLang)
            ? browserLang
            : DEFAULT_LANGUAGE;
          console.log('[LanguageContext] Using detected/default language:', detectedLang);
          setCurrentLanguage(detectedLang);
          localStorage.setItem('userLanguage', detectedLang);
        }
      }
    };

    initializeLanguage();
  }, [getCurrentUser]);

  // Load translations when language changes
  useEffect(() => {
    loadTranslations(language);
  }, [language, loadTranslations]);

  // Set language function
  const setLanguage = async (newLang: string) => {
    if (!SUPPORTED_LANGUAGES.includes(newLang)) {
      console.error(`Unsupported language: ${newLang}`);
      return;
    }

    try {
      console.log('[LanguageContext] Changing language to:', newLang);
      // Update local state immediately for instant feedback
      setCurrentLanguage(newLang);
      localStorage.setItem('userLanguage', newLang);
      console.log('[LanguageContext] Language state updated, localStorage saved');

      // Load translations immediately for the new language
      await loadTranslations(newLang);
      console.log('[LanguageContext] Translations loaded for:', newLang);

      // Update backend if user is logged in
      const user = getCurrentUser();
      if (user?.id) {
        console.log('[LanguageContext] Updating backend for user:', user.id);
        await updateUser(user.id, { language: newLang });
        console.log('[LanguageContext] Backend updated successfully');
      }
    } catch (error) {
      console.error('Failed to save language preference:', error);
      // Still keep the local change even if backend update fails
    }
  };

  // Translation function with nested key support
  const t = useCallback((key: string, options?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    // If translation not found, try to fallback to English
    if (value === undefined && language !== 'en') {
      console.warn(`[LanguageContext] Missing translation for key: ${key} in language: ${language}`);
      return key; // Return key as fallback
    }

    if (typeof value !== 'string') {
      console.warn(`[LanguageContext] Translation value is not a string: ${key}`);
      return key;
    }

    // Handle interpolation (e.g., {{userName}})
    if (options && typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return options[key]?.toString() || '';
      });
    }

    return value;
  }, [translations, language]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
