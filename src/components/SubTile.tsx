interface SubTileProps {
  targetId: string;
  label: string;
}

export function SubTile({ targetId, label }: SubTileProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.classList.add('section-highlight');
      setTimeout(() => {
        element.classList.remove('section-highlight');
      }, 1200);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="
        px-4 py-2 rounded-full text-sm font-medium
        bg-white/5 border border-white/10
        text-[hsl(210,40%,75%)]
        hover:bg-white/10 hover:border-white/20
        transition-all duration-200
        tap-target
      "
    >
      {label}
    </button>
  );
}
