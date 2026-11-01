import { Link } from 'react-router-dom';

interface NavigationTileProps {
  to: string;
  label: string;
  variant: 'teal' | 'yellow' | 'navy';
  size?: 'default' | 'large';
}

const variantClasses = {
  teal: 'bg-white/[0.06] border-white/15 text-white/85 hover:bg-white/[0.12] hover:border-[hsl(25,95%,55%,0.4)]',
  yellow: 'bg-[hsl(25,95%,55%,0.2)] border-[hsl(25,95%,55%,0.4)] text-[hsl(25,95%,70%)] hover:bg-[hsl(25,95%,55%,0.3)]',
  navy: 'bg-white/[0.06] border-white/15 text-white/85 hover:bg-white/[0.12] hover:border-[hsl(25,95%,55%,0.4)]',
};

const sizeClasses = {
  default: 'py-8 px-6 text-xl',
  large: 'py-14 sm:py-16 px-8 text-2xl sm:text-3xl',
};

export function NavigationTile({ to, label, variant, size = 'default' }: NavigationTileProps) {
  return (
    <Link
      to={to}
      className={`
        block w-full rounded-2xl text-center border
        font-bold tracking-wider uppercase
        transform transition-all duration-200
        hover:scale-[1.02] hover:shadow-xl
        active:scale-[0.98]
        backdrop-blur-sm
        tap-target
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      {label}
    </Link>
  );
}
