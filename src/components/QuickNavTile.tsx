import { Link } from 'react-router-dom';

interface QuickNavTileProps {
  to: string;
  label: string;
  variant: 'teal' | 'yellow' | 'navy';
}

const variantClasses = {
  teal: 'bg-[hsl(172,58%,39%,0.2)] border-[hsl(172,58%,39%,0.3)] text-[hsl(172,45%,70%)]',
  yellow: 'bg-[hsl(25,95%,55%,0.15)] border-[hsl(25,95%,55%,0.3)] text-[hsl(25,95%,70%)]',
  navy: 'bg-[hsl(213,55%,30%,0.25)] border-[hsl(213,55%,50%,0.3)] text-[hsl(210,40%,75%)]',
};

export function QuickNavTile({ to, label, variant }: QuickNavTileProps) {
  return (
    <Link
      to={to}
      className={`
        px-3 py-1.5 rounded-lg text-xs font-semibold uppercase border
        transition-all duration-200 hover:opacity-90 hover:scale-105
        backdrop-blur-sm
        ${variantClasses[variant]}
      `}
    >
      {label}
    </Link>
  );
}
