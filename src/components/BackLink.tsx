import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export function BackLink() {
  const { t } = useLanguage();
  
  return (
    <Link 
      to="/hub" 
      className="inline-flex items-center text-sm font-medium text-[hsl(210,40%,65%)] hover:text-white transition-colors tap-target"
    >
      {t('nav.back')}
    </Link>
  );
}
