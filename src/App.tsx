import { useEffect, useState } from 'react';

import type { Item } from './Item';
import { ItemCard } from './Item';

const App = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(filter);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [filter]);

  useEffect(() => {
    fetch('items.json')
      .then((response) => response.json())
      .then((data: Item[]) =>
        Object.values(
          // Dedup items by id
          data.reduce<Record<string, Item>>((acc, item) => {
            if (!acc[item.id]) {
              acc[item.id] = item;
            }
            return acc;
          }, {}),
        ).map((item) => <ItemCard key={item.id} {...item} />),
      )
      .then(setItems)
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  return (
    <div className="bg-slate-900 flex flex-col gap-4 p-4 min-h-screen">
      <input
        name="search"
        type="text"
        className="bg-white p-2 rounded w-50"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="flex flex-wrap gap-4">
        {items.filter((item) =>
          item.key?.toLowerCase().includes(search.toLowerCase()),
        )}
      </div>
    </div>
  );
};

export default App;
