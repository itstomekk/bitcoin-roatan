import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/bitcoin-roatan-logo.png';
import { MessageCircle } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { BitcoinEventsBox } from '@/components/BitcoinEventsBox';
import { FeaturedEventBlock } from '@/components/FeaturedEventBlock';

const marketplaceLinks = [
  { name: 'Bitcoin Arena', desc: "The island's biggest gym — Bitcoin powered", url: 'https://maps.app.goo.gl/fupJRJCYShQ378Yr9', emoji: '🥊' },
  { name: 'Bitcoin District', desc: 'Bitcoin ecosystem within Próspera', url: 'https://thebitcoindistrict.com', emoji: '🏘️' },
  { name: 'BTCMap', desc: 'Find businesses that accept Bitcoin on the island', url: 'https://btcmap.org/map#12/16.34156/-86.41727', emoji: '🗺️' },
  { name: 'AmityAge', desc: 'Mining company doing education through Bitcoin Center', url: 'https://www.amityage.com/bitcoin-center-roatan', emoji: '⛏️' },
  { name: 'Orangeville', desc: 'Tropical neighborhood planned in Próspera', url: 'https://theorangeville.com', emoji: '🍊' },
  { name: 'Próspera', desc: 'Special economic zone focused on freedom, with Bitcoin as unit of account', url: 'https://prospera.co', emoji: '🏛️' },
  { name: 'Roatan Bitcoin Bar Poker', desc: 'Regular satoshi Texas Holdem — community and tournaments', url: 'https://www.rbbp.fun/', emoji: '🃏' },
  { name: 'Blink', desc: 'Custodial lightning wallet — your easiest entry to Bitcoin transactions', url: 'https://blink.sv', emoji: '⚡' },
  { name: 'Bitcoin Review Raffle', desc: 'Win BTC by improving merchants\' map', url: 'https://bitcoinreviewsraffle.com/', emoji: '🎟️' },
  { name: '.Place', desc: 'The digital agora for the island. Post & discuss useful notes.', url: 'https://prospera.place', emoji: '📌' },
  { name: 'Blazar Makerspace', desc: 'Community laboratory in Duna, Crawfish Rock. Bitcoin mined and accepted.', url: 'https://blazar.lat/', emoji: '🔬' },
];

const ComingSoon = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [badgeHovered, setBadgeHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: 'Error', description: 'Please enter your email address.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (data.already) {
        toast({ title: 'Already subscribed!', description: "You're already on the list." });
      } else {
        toast({ title: 'Subscribed!', description: "Thanks! We'll keep you posted." });
      }
      setEmail('');
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto no-scrollbar">
      <Seo page="home" />
      {/* Fixed background */}
      <div className="fixed inset-0 z-0">
        <iframe
          src="https://www.youtube.com/embed/94d0F-z7WNY?autoplay=1&mute=1&loop=1&playlist=94d0F-z7WNY&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3"
          className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ border: 'none' }}
          allow="autoplay; encrypted-media"
          title="Background video"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(25,90%,8%,0.65)] via-[hsl(25,80%,6%,0.7)] to-[hsl(210,60%,8%,0.8)]" />
      </div>

      {/* Flying Bitcoin logos */}
      <div className="fixed inset-0 z-[5] overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-[hsl(25,95%,55%)] opacity-[0.08] select-none"
            style={{
              fontSize: `${16 + (i % 4) * 8}px`,
              left: `${(i * 8.3) % 100}%`,
              animationName: 'floatBtc',
              animationDuration: `${14 + (i % 5) * 4}s`,
              animationDelay: `${(i * 1.7) % 10}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          >
            ₿
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-6 py-10">
        {/* Hero section */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center text-center pt-[12vh]">
          <img
            src={logo}
            alt="Bitcoin Roatán"
            width={208}
            height={208}
            fetchPriority="high"
            decoding="async"
            className="w-40 h-40 sm:w-52 sm:h-52 mb-4 drop-shadow-2xl cursor-pointer transition-transform duration-[2s] ease-in-out hover:animate-[breathe_2s_ease-in-out_infinite]"
          />

          <h1 className="sr-only">Bitcoin Roatán</h1>
          <p className="text-lg sm:text-xl text-[hsl(210,40%,75%)] font-light max-w-lg mx-auto leading-relaxed mb-6">
            Roatán — the most bitcoin island in the world.
          </p>

          <button
            onMouseEnter={() => setBadgeHovered(true)}
            onMouseLeave={() => setBadgeHovered(false)}
            onClick={() => setShowMarketplace(!showMarketplace)}
            className="inline-block px-5 py-2 rounded-full border border-[hsl(25,95%,55%,0.4)] bg-[hsl(25,95%,55%,0.1)] text-[hsl(25,95%,65%)] text-sm font-medium tracking-widest uppercase mb-6 cursor-pointer transition-all duration-300 hover:bg-[hsl(25,95%,55%,0.2)] hover:border-[hsl(25,95%,55%,0.7)]"
          >
            {badgeHovered ? 'Already came?' : 'Coming Soon'}
          </button>
        </div>

        {/* Minimarketplace */}
        <div
          className="w-full max-w-3xl overflow-hidden transition-all duration-700 ease-in-out"
          style={{
            maxHeight: showMarketplace ? '1000px' : '0',
            opacity: showMarketplace ? 1 : 0,
            marginBottom: showMarketplace ? '2rem' : '0',
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {marketplaceLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 flex flex-col gap-2 transition-all duration-300 hover:bg-white/[0.1] hover:border-[hsl(25,95%,55%,0.4)] hover:scale-[1.03]"
              >
                <span className="text-2xl">{link.emoji}</span>
                <span className="text-white/90 text-sm font-semibold leading-tight">{link.name}</span>
                <span className="text-white/75 text-xs leading-snug">{link.desc}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Email Signup */}
        <div className="w-full max-w-md mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-[hsl(25,95%,55%)] backdrop-blur-sm"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[hsl(25,95%,55%)] hover:bg-[hsl(25,95%,45%)] text-white font-semibold whitespace-nowrap"
            >
              {isLoading ? 'Sending...' : 'Notify Me'}
            </Button>
          </form>
        </div>
        <FeaturedEventBlock className="max-w-md mb-6" />
        <BitcoinEventsBox />

      </div>


      {/* WhatsApp FAB */}
      <a
        href="https://chat.whatsapp.com/FQ9Uu5WR6VOGgh5sPaSuFK"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] text-white shadow-lg shadow-[hsl(142,70%,40%,0.4)] transition-colors duration-200"
        aria-label="Join WhatsApp Group"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};

export default ComingSoon;
