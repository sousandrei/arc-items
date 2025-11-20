const RaiderCoinIcon =
  'https://cdn.metaforge.app/arc-raiders/icons/raider-coin.webp';
const WeightIcon = 'https://cdn.metaforge.app/arc-raiders/icons/weightKg.webp';

export type Item = {
  id: string;
  name: string;
  description: string;
  item_type: string;
  icon: string;
  rarity: string;
  value: number;
  flavor_text: string;
  subcategory: string;
  shield_type: string;
  loot_area: string;
  ammo_type: string;
  stat_block: Record<string, number | string>;
};

export function ItemCard(item: Item): React.ReactElement<Item> | null {
  if (!item.icon) {
    console.log('Missing icon for item:', item);
    return null;
  }

  return (
    <div
      className={`flex flex-col transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20 shadow-lg shadow-black/40 min-h-[250px] min-w-[160px] max-w-[200px]
      bg-gradient-to-br ${rarityBackgroundGradient(item.rarity)} to-neutral-900/90 to-60% backdrop-blur-sm
      ${rarityBorderColor(item.rarity)} border rounded-xl overflow-hidden relative group
      `}
      {...item}
    >
      <div className="relative flex flex-col gap-2 rounded-t-lg p-2">
        <img
          className="h-15 w-full object-contain"
          src={item.icon}
          alt={item.name || 'Item image'}
        />
        <div
          className="
          flex justify-end align-bottom items-center
          text-neutral-400"
        >
          <img
            className="w-3 h-3 inline-block mr-1 invert mr-2"
            src={RaiderCoinIcon}
            alt="Raider Coin"
          />
          <span className="text-xs">{item.value}</span>
          <img
            className="w-3 h-3 inline-block mr-1 invert ml-4"
            src={WeightIcon}
            alt="Weight in Kg"
          />
          <span className="text-xs">{item.stat_block.weight}</span>
        </div>
        <CornerCurve name={item.name} color={rarityTextColor(item.rarity)} />
      </div>
      <div className="h-full bg-neutral-800 p-2 text-white rounded-b-lg flex flex-col gap-2 justify-between">
        <span className="font-semibold text-md text-neutral-200">
          {item.name}
        </span>
        <div className="min-h-10 flex flex-col justify-start text-white text-sm gap-2 mt-4">
          <span
            className={`h-fit w-fit p-1 rounded font-medium ${rarityBackgroundColor(item.rarity)}`}
          >
            {item.item_type}
          </span>
        </div>

        <span className="text-xs text-neutral-400">
          {item.loot_area?.split(',')}
        </span>
      </div>
    </div>
  );
}

type CornerCurveProps = {
  name?: string;
  color?: string;
} & React.ComponentProps<'svg'>;

function CornerCurve({
  name = 'corner-curve',
  color = 'text-black',
}: CornerCurveProps) {
  return (
    <div className={`absolute bottom-0 left-0 ${color}`}>
      <svg className="fill-current" width="20" height="20" viewBox="0 0 30 30">
        <title>{name}</title>
        <path d="M0 30 L30 30 Q5 25 0 0"></path>
      </svg>
    </div>
  );
}

function rarityBackgroundColor(rarity: string) {
  switch (rarity) {
    case 'Common':
      return 'bg-zinc-300 text-black';
    case 'Uncommon':
      return 'bg-green-500 text-white';
    case 'Rare':
      return 'bg-blue-500 text-white';
    case 'Epic':
      return 'bg-fuchsia-500 text-white';
    case 'Legendary':
      return 'bg-amber-400 text-black';
    case '':
      return 'bg-stone-500 text-white';
    default:
      return 'bg-stone-500 text-white';
  }
}

function rarityBackgroundGradient(rarity: string) {
  switch (rarity) {
    case 'Common':
      return 'from-zinc-300';
    case 'Uncommon':
      return 'from-green-500';
    case 'Rare':
      return 'from-blue-500';
    case 'Epic':
      return 'from-fuchsia-500';
    case 'Legendary':
      return 'from-amber-400';
    case '':
      return 'from-stone-50';
    default:
      return 'from-stone-50';
  }
}

function rarityTextColor(rarity: string) {
  switch (rarity) {
    case 'Common':
      return 'text-zinc-300';
    case 'Uncommon':
      return 'text-green-500';
    case 'Rare':
      return 'text-blue-500';
    case 'Epic':
      return 'text-fuchsia-500';
    case 'Legendary':
      return 'text-amber-400';
    case '':
      return 'text-stone-50';
    default:
      return 'text-stone-50';
  }
}

function rarityBorderColor(rarity: string) {
  switch (rarity) {
    case 'Common':
      return 'border-zinc-300';
    case 'Uncommon':
      return 'border-green-500';
    case 'Rare':
      return 'border-blue-500';
    case 'Epic':
      return 'border-fuchsia-500';
    case 'Legendary':
      return 'border-amber-400';
    case '':
      return 'border-stone-50';
    default:
      return 'border-stone-50';
  }
}
