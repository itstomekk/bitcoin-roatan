interface SectionHeaderProps {
  id: string;
  title: string;
}

export function SectionHeader({ id, title }: SectionHeaderProps) {
  return (
    <h3 
      id={id} 
      className="text-lg font-semibold text-white py-2 -mx-2 px-2 rounded-lg transition-colors"
    >
      {title}
    </h3>
  );
}
