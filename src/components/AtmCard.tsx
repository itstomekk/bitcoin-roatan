import { useLanguage } from '@/contexts/LanguageContext';
import type { AtmData } from '@/data/atms';
import { MapPin, ExternalLink } from 'lucide-react';

interface AtmCardProps {
  atm: AtmData;
}

export function AtmCard({ atm }: AtmCardProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-white">
              BTC ↔ {atm.currency}
            </span>
            <span className="text-xs text-white/40">
              ({t('use.atms.buy')} {atm.buyFee}% · {t('use.atms.sell')} {atm.sellFee}%)
            </span>
          </div>
          <a
            href={atm.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[hsl(210,40%,60%)] hover:text-white transition-colors group"
          >
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="underline-offset-2 group-hover:underline truncate">{atm.location}</span>
            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
