import { Link } from 'react-router-dom';

interface QuickNavTileProps {
  to: string;
  label: string;
  variant: 'teal' | 'yellow' | 'navy';
}

const variantClasses = {
  teal: 'bg-white/[0.06] border-white/15 text-white/85',
  yellow: 'bg-[hsl(25,95%,55%,0.15)] border-[hsl(25,95%,55%,0.3)] text-[hsl(25,95%,70%)]',
  navy: 'bg-white/[0.06] border-white/15 text-white/85',
};

export function QuickNavTile({ to, label, variant }: QuickNavTileProps) {
  return (
    <Link
      to={to}
      className={`
        px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold uppercase border
        transition-all duration-200 hover:opacity-90 hover:scale-105
        backdrop-blur-sm
        ${variantClasses[variant]}
      `}
    >
      {label}
    </Link>
  );
}
