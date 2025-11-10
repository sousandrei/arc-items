import { useEffect, useState } from 'react';

import type { Item } from './Item';
import { ItemCard } from './Item';
import { Section } from './Section';

const App = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const [recycleItems, setRecycleItems] = useState<React.ReactElement[]>([]);
  const [questItems, setQuestItems] = useState<React.ReactElement[]>([]);
  const [projectItems, setProjectItems] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(filter);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [filter]);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetch('items.json')
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
        .catch((error) => console.error('Error fetching items:', error));

      const groups = await fetch('groups.json')
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching groups:', error));

      if (!items) return;

      const recycleItems: React.ReactElement[] = [];
      const questItems: React.ReactElement[] = [];
      const projectItems: React.ReactElement[] = [];

      for (const item of items) {
        console.log(item.key, groups);

        if (groups.recycle.includes(item.key)) {
          recycleItems.push(item);
        } else if (groups.quests.includes(item.key)) {
          questItems.push(item);
        } else if (groups.projects.includes(item.key)) {
          projectItems.push(item);
        }
      }

      setRecycleItems(recycleItems);
      setQuestItems(questItems);
      setProjectItems(projectItems);
    };

    fetchItems();
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
      <Section title="Safe to Recycle" items={recycleItems} search={search} />
      <Section title="Keep for Quests" items={questItems} search={search} />
      <Section title="Keep for Projects" items={projectItems} search={search} />
    </div>
  );
};

export default App;
