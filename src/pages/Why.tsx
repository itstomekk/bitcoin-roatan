import { PageContainer } from '@/components/PageContainer';
import { BackLink } from '@/components/BackLink';
import { LanguageToggle } from '@/components/LanguageToggle';
import { SubTile } from '@/components/SubTile';
import { SectionHeader } from '@/components/SectionHeader';
import { AboutLink } from '@/components/AboutLink';
import { QuickNavTile } from '@/components/QuickNavTile';
import { useLanguage } from '@/contexts/LanguageContext';
import { Seo } from '@/components/Seo';

const Why = () => {
  const { t } = useLanguage();

  return (
    <PageContainer>
      <Seo page="why" />
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BackLink />
            <div className="flex gap-2">
              <QuickNavTile to="/use" label={t('nav.use')} variant="yellow" />
              <QuickNavTile to="/whatsup" label={t('nav.whatsup')} variant="navy" />
            </div>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <div className="mb-6 pb-4 border-b border-[hsl(172,58%,39%,0.3)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {t('why.title')}
        </h1>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8">
        <SubTile targetId="why-roatan" label={t('why.sub.roatan')} />
        <SubTile targetId="why-guide" label={t('why.sub.guide')} />
      </nav>

      <section className="mb-8 p-4 rounded-xl bg-[hsl(172,58%,39%,0.08)] border border-[hsl(172,58%,39%,0.2)]">
        <h3 className="text-sm font-semibold text-[hsl(172,45%,60%)] mb-3">
          {t('why.quick.title')}
        </h3>
        <ul className="space-y-2 text-sm text-[hsl(210,40%,80%)]">
          <li className="flex items-start gap-2">
            <span className="text-[hsl(172,45%,60%)] mt-0.5">•</span>
            <span>{t('why.quick.merchants')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[hsl(172,45%,60%)] mt-0.5">•</span>
            <span>{t('why.quick.infrastructure')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[hsl(172,45%,60%)] mt-0.5">•</span>
            <span>{t('why.quick.prospera')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[hsl(172,45%,60%)] mt-0.5">•</span>
            <span>{t('why.quick.culture')}</span>
          </li>
        </ul>
      </section>

      <div className="space-y-8">
        <section>
          <SectionHeader id="why-roatan" title={t('why.roatan.title')} />
          <div className="space-y-4 text-[hsl(210,40%,75%)] leading-relaxed">
            <p className="text-lg font-medium text-white">
              {t('why.roatan.intro')}
            </p>
            <p className="whitespace-pre-line">{t('why.roatan.text')}</p>
            <p>{t('why.roatan.opportunity')}</p>
          </div>
        </section>

        <section className="p-4 rounded-xl bg-[hsl(25,95%,55%,0.08)] border border-[hsl(25,95%,55%,0.2)]">
          <h3 className="text-sm font-semibold text-[hsl(25,95%,65%)] mb-2">
            {t('why.important.title')}
          </h3>
          <p className="text-sm text-[hsl(210,40%,75%)] leading-relaxed">
            {t('why.important.text')}
          </p>
        </section>

        <section>
          <SectionHeader id="why-guide" title={t('why.guide.title')} />
          <p className="text-[hsl(210,40%,75%)] leading-relaxed whitespace-pre-line">
            {t('why.guide.text')}
          </p>
        </section>
      </div>

      <footer className="text-center pt-8 mt-12 border-t border-white/10">
        <AboutLink />
      </footer>
    </PageContainer>
  );
};

export default Why;
