import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen relative", className)}>
      {/* Dark cinematic background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[hsl(25,90%,8%)] via-[hsl(210,60%,10%)] to-[hsl(210,60%,8%)]" />

      {/* Floating Bitcoin symbols */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-[hsl(25,95%,55%)] opacity-[0.06] select-none"
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
      <main className="relative z-10 max-w-xl mx-auto px-4 py-6 page-enter">
        {children}
      </main>
    </div>
  );
}
