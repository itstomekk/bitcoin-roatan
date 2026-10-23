import { useLanguage } from '@/contexts/LanguageContext';
import { nowImportantItems, NowItem } from '@/data/nowImportant';
import { getStableRandomIndex } from '@/lib/stableRandom';

function getRelevantItems(): NowItem[] {
  const today = new Date().getDay();
  
  return nowImportantItems.filter(item => {
    const text = item.en.toLowerCase();
    if (text.includes('thursday')) return today === 3 || today === 4;
    if (text.includes('saturday')) return today === 5 || today === 6;
    return true;
  });
}

export function NowImportantBox() {
  const { language, t } = useLanguage();
  
  const relevantItems = getRelevantItems();
  const index = getStableRandomIndex(relevantItems.length);
  const item = relevantItems[index];
  const text = language === 'es' ? item.es : item.en;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-[hsl(25,95%,55%)] mt-2 flex-shrink-0" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            {t('now.title')}
          </span>
          <p className="text-sm text-[hsl(210,40%,75%)] mt-1">{text}</p>
        </div>
      </div>
    </div>
  );
}
