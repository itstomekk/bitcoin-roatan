import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export function AboutLink() {
  const { t } = useLanguage();
  
  return (
    <Link 
      to="/about" 
      className="text-sm text-[hsl(210,40%,55%)] hover:text-[hsl(210,40%,75%)] transition-colors"
    >
      {t('home.about')}
    </Link>
  );
}
