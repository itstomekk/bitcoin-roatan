import { PageContainer } from '@/components/PageContainer';
import { BackLink } from '@/components/BackLink';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Seo } from '@/components/Seo';

const About = () => {
  const { t } = useLanguage();

  return (
    <PageContainer>
      <Seo
        title="About Bitcoin Roatán — Mission & partners"
        description="About the Bitcoin Roatán project: who we are, our mission, and the partners helping build Bitcoin on the island."
        path="/about"
      />
      <header className="flex justify-between items-center mb-6">
        <BackLink />
        <LanguageToggle />
      </header>

      <h1 className="text-2xl font-bold text-white mb-6">
        {t('about.title')}
      </h1>

      <section className="mb-10">
        <p className="text-[hsl(210,40%,75%)] leading-relaxed whitespace-pre-line">
          {t('about.intro')}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          {t('about.partners')}
        </h2>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-medium text-white mb-1">
              {t('about.partner.bd')}
            </h3>
            <p className="text-sm text-[hsl(210,40%,65%)]">
              {t('about.partner.bd.desc')}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-medium text-white mb-1">
              {t('about.partner.aa')}
            </h3>
            <p className="text-sm text-[hsl(210,40%,65%)]">
              {t('about.partner.aa.desc')}
            </p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default About;
