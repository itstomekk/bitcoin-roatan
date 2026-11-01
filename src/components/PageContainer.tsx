import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logo from '@/assets/bitcoin-roatan-logo.png';
import bg from '@/assets/roatan-bg.webp';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen relative", className)}>
      {/* Same look as the landing page: island footage still under the dark gradient */}
      <div className="fixed inset-0 z-0 bg-[hsl(210,60%,8%)]">
        <img src={bg} alt="" aria-hidden="true" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(25,90%,8%,0.78)] via-[hsl(25,80%,6%,0.82)] to-[hsl(210,60%,8%,0.9)]" />
      </div>

      {/* Floating Bitcoin symbols */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-[hsl(25,95%,55%)] opacity-[0.08] select-none"
            style={{
              fontSize: `${14 + (i % 4) * 6}px`,
              left: `${(i * 9.1) % 100}%`,
              animationName: 'floatBtc',
              animationDuration: `${16 + (i % 5) * 5}s`,
              animationDelay: `${(i * 2.1) % 12}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          >
            ₿
          </span>
        ))}
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-6 page-enter">
        <Link to="/" aria-label="Bitcoin Roatán home" className="block w-fit mx-auto mb-2">
          <img src={logo} alt="Bitcoin Roatán" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-2xl" />
        </Link>
        {children}
      </main>
    </div>
  );
}
