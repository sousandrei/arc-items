import { useEffect, useRef, useState } from 'react';

import type { Item } from './Item';
import { ItemCard } from './Item';
import { useKey } from './shortcut';

const App = () => {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch('items.json')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  const itemDOM = Object.values(
    items
      .filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
      .reduce<Record<string, Item>>((acc, item) => {
        if (!acc[item.id]) {
          acc[item.id] = item;
        }
        return acc;
      }, {}),
  ).map((item) => <ItemCard key={item.id} {...item} />);

  const cmdKRef = useRef(null);
  useKey('k', cmdKRef);

  return (
    <div className="bg-slate-900 flex flex-col gap-4 p-4 min-h-screen">
      <input
        name="search"
        type="text"
        className="bg-white p-2 rounded w-50"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        ref={cmdKRef}
      />
      <div className="flex flex-wrap gap-4">{itemDOM} </div>
    </div>
  );
};

export default App;
