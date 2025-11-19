import type { Item } from './Item';

type SectionProps = {
  title: string;
  items: React.ReactElement<Item>[];
  search: string;
} & React.HTMLAttributes<HTMLDivElement>;

const rarityArray = ['', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

export const Section = ({ title, items, search }: SectionProps) => {
  const itemsToShow = search
    ? items.filter(
        (item) =>
          item.props.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.props.rarity?.toLowerCase().includes(search.toLowerCase()) ||
          item.props.item_type?.toLowerCase().includes(search.toLowerCase()) ||
          item.props.loot_area?.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const itemsDOM = itemsToShow.sort((a, b) => {
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

  if (itemsToShow.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col flex-wrap gap-4 w-full">
      <span className="text-3xl text-neutral-400 font-bold border-b-2 border-cyan-500 pb-2 mb-6">
        {title} - ({itemsDOM.length})
      </span>
      {itemsDOM.length === 0 && search !== '' ? (
        <p className="text-neutral-500 italic">
          No results found in this section.
        </p>
      ) : (
        <div className="grid grid-flow-row-dense auto-rows-max [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 max-w-full">
          {itemsDOM}
        </div>
      )}
    </div>
  );
};
