import type { Item } from './Item';

type SectionProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  items: React.ReactElement<Item>[];
  search: string;
};

const rarityArray = ['', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

export const Section = ({
  title,
  subtitle,
  icon,
  items,
  search,
}: SectionProps) => {
  if (items.length === 0) return null;

  const filteredItems = search
    ? items.filter(
        (item) =>
          item.props.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.props.rarity?.toLowerCase().includes(search.toLowerCase()) ||
          item.props.item_type?.toLowerCase().includes(search.toLowerCase()) ||
          item.props.loot_area?.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  if (filteredItems.length === 0) return null;

  filteredItems.sort((a, b) => {
    if (search === '') {
      return a.props.name.localeCompare(b.props.name);
    }

    const aRarityIndex = rarityArray.indexOf(a.props.rarity);
    const bRarityIndex = rarityArray.indexOf(b.props.rarity);

    if (aRarityIndex === bRarityIndex) {
      return a.props.name.localeCompare(b.props.name);
    }

    return bRarityIndex - aRarityIndex;
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-white/5 pb-4 relative">
        <div className="absolute bottom-0 left-0 w-12 h-[1px] bg-gradient-to-r from-cyan-500 to-transparent"></div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          {icon && <span className="text-2xl drop-shadow-md">{icon}</span>}
          {title}
          <span className="text-sm font-normal text-neutral-500 ml-auto bg-neutral-900/50 px-3 py-1 rounded-full border border-white/5 shadow-inner">
            {filteredItems.length}
          </span>
        </h2>
        {subtitle && (
          <p className="text-neutral-400 text-sm pl-1">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
        {filteredItems}
      </div>
    </section>
  );
};
