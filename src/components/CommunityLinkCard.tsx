import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, ExternalLink } from 'lucide-react';
import type { CommunityLink } from '@/data/community';

interface CommunityLinkCardProps {
  link: CommunityLink;
}

export function CommunityLinkCard({ link }: CommunityLinkCardProps) {
  const { t } = useLanguage();

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block border rounded-xl p-4 transition-colors ${
        link.isPrimary 
          ? 'bg-[hsl(25,95%,55%,0.1)] border-[hsl(25,95%,55%,0.25)] hover:bg-[hsl(25,95%,55%,0.15)]' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-3">
        <MessageCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          link.isPrimary ? 'text-[hsl(25,95%,60%)]' : 'text-white/40'
        }`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium mb-1 ${
            link.isPrimary ? 'text-[hsl(25,95%,65%)]' : 'text-white'
          }`}>
            {t(link.titleKey)}
          </h4>
          <p className="text-sm text-[hsl(210,40%,65%)]">{t(link.descriptionKey)}</p>
        </div>
        <ExternalLink className={`w-4 h-4 flex-shrink-0 ${
          link.isPrimary ? 'text-[hsl(25,95%,55%)]' : 'text-white/30'
        }`} />
      </div>
    </a>
  );
}
