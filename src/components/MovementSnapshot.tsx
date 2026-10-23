import { useLanguage } from '@/contexts/LanguageContext';

export function MovementSnapshot() {
  const { t } = useLanguage();

  const stats = [
    t('home.snapshot.merchants'),
    t('home.snapshot.atms'),
    t('home.snapshot.companies'),
    t('home.snapshot.events'),
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
      <h3 className="font-semibold text-white mb-4">
        {t('home.snapshot.title')}
      </h3>
      <ul className="space-y-2">
        {stats.map((stat, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(25,95%,55%)] mt-2 flex-shrink-0" />
            <span className="text-[hsl(210,40%,75%)]">{stat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
