import { PageContainer } from '@/components/PageContainer';
import { BackLink } from '@/components/BackLink';
import { LanguageToggle } from '@/components/LanguageToggle';
import { SubTile } from '@/components/SubTile';
import { SectionHeader } from '@/components/SectionHeader';
import { NowImportantBox } from '@/components/NowImportantBox';
import { FeaturedEventBlock } from '@/components/FeaturedEventBlock';
import { AboutLink } from '@/components/AboutLink';
import { QuickNavTile } from '@/components/QuickNavTile';
import { EventCard } from '@/components/EventCard';
import { CommunityLinkCard } from '@/components/CommunityLinkCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { events, eventsPageUrl } from '@/data/events';
import { communityLinks } from '@/data/community';
import { ExternalLink } from 'lucide-react';
import { Seo } from '@/components/Seo';

const WhatsUp = () => {
  const { t } = useLanguage();

  return (
    <PageContainer>
      <Seo page="whatsup" />
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BackLink />
            <div className="flex gap-2">
              <QuickNavTile to="/why" label={t('nav.why')} variant="teal" />
              <QuickNavTile to="/use" label={t('nav.use')} variant="yellow" />
            </div>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <div className="mb-6 pb-4 border-b border-[hsl(213,55%,40%,0.4)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {t('whatsup.title')}
        </h1>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8">
        <SubTile targetId="whatsup-community" label={t('whatsup.sub.community')} />
        <SubTile targetId="whatsup-events" label={t('whatsup.sub.events')} />
        <SubTile targetId="whatsup-links" label={t('whatsup.sub.links')} />
      </nav>

      <section className="mb-10">
        <FeaturedEventBlock className="mb-4" />
        <NowImportantBox />
      </section>

      <div className="space-y-10">
        <section>
          <SectionHeader id="whatsup-community" title={t('whatsup.community.title')} />
          <p className="text-[hsl(210,40%,75%)] leading-relaxed mb-4">
            {t('whatsup.community.intro')}
          </p>
          <div className="space-y-3 mb-4">
            {communityLinks.map((link) => (
              <CommunityLinkCard key={link.id} link={link} />
            ))}
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-white mb-2">
              {t('whatsup.community.howTitle')}
            </h4>
            <ul className="space-y-1.5 text-sm text-[hsl(210,40%,65%)] mb-3">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('whatsup.community.whatsapp')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('whatsup.community.telegram')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>{t('whatsup.community.eventsPage')}</span>
              </li>
            </ul>
            <p className="text-xs text-white/40 italic">
              {t('whatsup.community.disclaimer')}
            </p>
          </div>
        </section>

        <section>
          <SectionHeader id="whatsup-events" title={t('whatsup.events.title')} />
          <div className="space-y-3 mb-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <p className="text-sm text-[hsl(210,40%,65%)] mb-4 leading-relaxed">
            {t('whatsup.events.generalNote')}
          </p>
          <a
            href={eventsPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[hsl(25,95%,60%)] hover:text-[hsl(25,95%,70%)] hover:underline"
          >
            {t('whatsup.events.allEvents')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>

        <section>
          <SectionHeader id="whatsup-links" title={t('whatsup.links.title')} />
          <p className="text-[hsl(210,40%,75%)] leading-relaxed">
            {t('whatsup.links.text')}
          </p>
        </section>
      </div>

      <footer className="text-center pt-8 mt-12 border-t border-white/10">
        <AboutLink />
      </footer>
    </PageContainer>
  );
};

export default WhatsUp;
