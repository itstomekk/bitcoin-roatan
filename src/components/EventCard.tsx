import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, ExternalLink } from 'lucide-react';
import type { EventData } from '@/data/events';

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const { t } = useLanguage();

  const scheduleLabel = {
    weekly: t('events.schedule.weekly'),
    monthly: t('events.schedule.monthly'),
    once: t('events.schedule.once'),
  }[event.schedule];

  const detailKey = event.detailKey ? t(event.detailKey) : null;
  const isPastEvent = event.schedule === 'once' && detailKey?.toLowerCase().includes('past');

  const content = (
    <div className="flex items-start gap-3">
      <Calendar className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="font-medium text-white">{t(event.titleKey)}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">
            {scheduleLabel}
          </span>
          {isPastEvent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30">
              Past
            </span>
          )}
        </div>
        <p className="text-sm text-[hsl(210,40%,65%)]">{t(event.descriptionKey)}</p>
        {detailKey && (
          <p className="text-xs text-white/40 mt-2 leading-relaxed italic">
            {detailKey}
          </p>
        )}
      </div>
      {event.url && (
        <ExternalLink className="w-4 h-4 text-white/30 flex-shrink-0" />
      )}
    </div>
  );

  if (event.url) {
    return (
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[hsl(25,95%,55%,0.3)] transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      {content}
    </div>
  );
}
