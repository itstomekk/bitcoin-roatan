import { PageContainer } from '@/components/PageContainer';
import { NavigationTile } from '@/components/NavigationTile';
import { LanguageToggle } from '@/components/LanguageToggle';
import { MovementSnapshot } from '@/components/MovementSnapshot';
import { BTCMapEmbed } from '@/components/BTCMapEmbed';
import { NowImportantBox } from '@/components/NowImportantBox';
import { FeaturedEventBlock } from '@/components/FeaturedEventBlock';
import { AboutLink } from '@/components/AboutLink';
import { EmailSignup } from '@/components/EmailSignup';
import { useLanguage } from '@/contexts/LanguageContext';
import { Seo } from '@/components/Seo';

const EMAIL_WEBHOOK_URL = '';

const Index = () => {
  const { t } = useLanguage();

  return (
    <PageContainer>
      <Seo
        title="Bitcoin Roatán Hub — Guide to Bitcoin on the Island"
        description="Hub for using Bitcoin on Roatán: why it matters, how to use it, ATMs, merchants, and what's happening now."
        path="/hub"
      />
      <header className="flex justify-end mb-6">
        <LanguageToggle />
      </header>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {t('home.title')}
        </h1>
        <p className="text-[hsl(210,40%,65%)] text-lg">
          {t('home.subtitle')}
        </p>
      </div>

      <nav className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <NavigationTile to="/why" label={t('nav.why')} variant="teal" size="large" />
        <NavigationTile to="/use" label={t('nav.use')} variant="yellow" size="large" />
        <NavigationTile to="/whatsup" label={t('nav.whatsup')} variant="navy" size="large" />
      </nav>

      <section className="mb-10">
        <FeaturedEventBlock />
      </section>

      <section className="mb-8">
        <MovementSnapshot />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">
          {t('home.map.title')}
        </h2>
        <BTCMapEmbed />
      </section>

      <section className="mb-10">
        <NowImportantBox />
      </section>

      <section className="mb-10">
        <EmailSignup webhookUrl={EMAIL_WEBHOOK_URL || undefined} />
      </section>

      <footer className="pt-4 border-t border-white/10 text-center">
        <AboutLink />
      </footer>
    </PageContainer>
  );
};

export default Index;
