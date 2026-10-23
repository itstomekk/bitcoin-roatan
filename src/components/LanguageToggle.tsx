import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`
          px-2 py-1 rounded transition-colors tap-target
          ${language === 'en' 
            ? 'font-semibold text-white' 
            : 'text-white/40 hover:text-white/70'
          }
        `}
      >
        {t('lang.en')}
      </button>
      <span className="text-white/30">/</span>
      <button
        onClick={() => setLanguage('es')}
        className={`
          px-2 py-1 rounded transition-colors tap-target
          ${language === 'es' 
            ? 'font-semibold text-white' 
            : 'text-white/40 hover:text-white/70'
          }
        `}
      >
        {t('lang.es')}
      </button>
    </div>
  );
}
