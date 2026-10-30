import { PageContainer } from '@/components/PageContainer';
import { BackLink } from '@/components/BackLink';
import { LanguageToggle } from '@/components/LanguageToggle';
import { SubTile } from '@/components/SubTile';
import { SectionHeader } from '@/components/SectionHeader';
import { MerchantMap } from '@/components/MerchantMap';
import { AtmCard } from '@/components/AtmCard';
import { AboutLink } from '@/components/AboutLink';
import { QuickNavTile } from '@/components/QuickNavTile';
import { GettingStartedChecklist } from '@/components/GettingStartedChecklist';
import { useLanguage } from '@/contexts/LanguageContext';
import { Seo } from '@/components/Seo';
import { atms } from '@/data/atms';

const Use = () => {
  const { t } = useLanguage();

  return (
    <PageContainer>
      <Seo page="use" />
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BackLink />
            <div className="flex gap-2">
              <QuickNavTile to="/why" label={t('nav.why')} variant="teal" />
              <QuickNavTile to="/whatsup" label={t('nav.whatsup')} variant="navy" />
            </div>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <div className="mb-6 pb-4 border-b border-[hsl(25,95%,55%,0.3)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {t('use.title')}
        </h1>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8">
        <SubTile targetId="use-map" label={t('use.sub.map')} />
        <SubTile targetId="use-atms" label={t('use.sub.atms')} />
        <SubTile targetId="use-exchange" label={t('use.sub.exchange')} />
        <SubTile targetId="use-accept" label={t('use.sub.accept')} />
        <SubTile targetId="use-checklist" label={t('use.sub.checklist')} />
      </nav>

      <section className="mb-8 p-4 rounded-xl bg-[hsl(25,95%,55%,0.08)] border border-[hsl(25,95%,55%,0.2)]">
        <h3 className="text-sm font-semibold text-[hsl(25,95%,65%)] mb-3">
          {t('use.quick.title')}
        </h3>
        <ul className="space-y-2 text-sm text-[hsl(210,40%,80%)]">
          <li className="flex items-start gap-2">
            <span className="text-[hsl(25,95%,65%)] font-bold mt-0.5">1.</span>
            <span>{t('use.quick.wallet')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[hsl(25,95%,65%)] font-bold mt-0.5">2.</span>
            <span>{t('use.quick.arrive')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[hsl(25,95%,65%)] font-bold mt-0.5">3.</span>
            <span>{t('use.quick.pay')}</span>
          </li>
        </ul>
      </section>

      <div className="space-y-10">
        <section>
          <SectionHeader id="use-map" title={t('use.map.title')} />
          <MerchantMap />
        </section>

        <section>
          <SectionHeader id="use-atms" title={t('use.atms.title')} />
          <div className="grid gap-2 sm:grid-cols-2 mb-2">
            {atms.map((atm) => (
              <AtmCard key={atm.id} atm={atm} />
            ))}
          </div>
          <p className="text-xs text-[hsl(210,40%,55%)]">
            {t('use.atms.note')}
          </p>
        </section>

        <section>
          <SectionHeader id="use-exchange" title={t('use.exchange.title')} />
          <p className="text-[hsl(210,40%,75%)] leading-relaxed mb-4">
            {t('use.exchange.intro')}
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-white mb-3">
              {t('use.exchange.howTitle')}
            </h4>
            <ul className="space-y-2 text-sm text-[hsl(210,40%,75%)] mb-4">
              <li className="flex items-start gap-2">
                <span className="text-[hsl(25,95%,60%)]">•</span>
                <span>{t('use.exchange.atms')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(25,95%,60%)]">•</span>
                <span>{t('use.exchange.p2p')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(25,95%,60%)]">•</span>
                <span>{t('use.exchange.wallet')}</span>
              </li>
            </ul>

            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              <div className="bg-white/5 rounded-lg p-3">
                <h5 className="text-xs font-semibold text-white mb-1">
                  {t('use.exchange.forVisitors')}
                </h5>
                <p className="text-xs text-[hsl(210,40%,65%)] leading-relaxed">
                  {t('use.exchange.visitorsText')}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h5 className="text-xs font-semibold text-white mb-1">
                  {t('use.exchange.forLocals')}
                </h5>
                <p className="text-xs text-[hsl(210,40%,65%)] leading-relaxed">
                  {t('use.exchange.localsText')}
                </p>
              </div>
            </div>
          </div>

          <div className="border-l-2 border-[hsl(25,95%,55%,0.4)] pl-3">
            <h5 className="text-xs font-semibold text-white mb-1">
              {t('use.exchange.safetyTitle')}
            </h5>
            <p className="text-xs text-[hsl(210,40%,65%)] leading-relaxed">
              {t('use.exchange.safetyText')}
            </p>
          </div>
        </section>

        <section>
          <SectionHeader id="use-accept" title={t('use.accept.title')} />
          <p className="text-[hsl(210,40%,75%)] leading-relaxed whitespace-pre-line">
            {t('use.accept.text')}
          </p>
        </section>

        <section>
          <SectionHeader id="use-checklist" title={t('use.checklist.title')} />
          <p className="text-sm text-[hsl(210,40%,65%)] mb-4">
            {t('use.checklist.intro')}
          </p>
          <GettingStartedChecklist />
        </section>
      </div>

      <footer className="text-center pt-8 mt-12 border-t border-white/10">
        <AboutLink />
      </footer>
    </PageContainer>
  );
};

export default Use;
