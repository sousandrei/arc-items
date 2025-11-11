type SectionProps = {
  title: string;
  items: React.ReactElement[];
  search: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Section = ({ title, items, search }: SectionProps) => {
  const itemsDOM = items.filter((item) =>
    item.key?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <span className="text-2xl text-white font-bold">{title} - ({items.length})</span>
      <div className="flex flex-wrap gap-4">{itemsDOM}</div>
    </div>
  );
};
