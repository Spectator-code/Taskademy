import { useApp } from "../contexts/AppContext";
import { translations, TranslationKey } from "../utils/translations";

export function useTranslation() {
  const { language } = useApp();
  
  const t = (key: TranslationKey): string => {
    const lang = (language as keyof typeof translations) || "en";
    return translations[lang][key] || translations.en[key] || key;
  };

  return { t, language };
}
