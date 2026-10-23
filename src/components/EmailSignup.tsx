import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface EmailSignupProps {
  webhookUrl?: string;
}

export function EmailSignup({ webhookUrl }: EmailSignupProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({ title: t('email.error'), description: t('email.errorEmpty'), variant: "destructive" });
      return;
    }

    if (!webhookUrl) {
      toast({ title: t('email.success'), description: t('email.successMessage') });
      setEmail('');
      return;
    }

    setIsLoading(true);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({ email, timestamp: new Date().toISOString(), source: 'bitcoinroatan.info' }),
      });
      toast({ title: t('email.success'), description: t('email.successMessage') });
      setEmail('');
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({ title: t('email.error'), description: t('email.errorMessage'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-2">
        {t('email.title')}
      </h3>
      <p className="text-[hsl(210,40%,65%)] text-sm mb-4">
        {t('email.description')}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder={t('email.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-[hsl(25,95%,55%)]"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[hsl(25,95%,55%)] hover:bg-[hsl(25,95%,45%)] text-white font-semibold whitespace-nowrap"
        >
          {isLoading ? t('email.sending') : t('email.submit')}
        </Button>
      </form>
      <p className="text-xs text-white/30 mt-3">
        {t('email.privacy')}
      </p>
    </div>
  );
}
