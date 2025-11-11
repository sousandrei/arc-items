import { useEffect, useRef, useState } from 'react';

import type { Item } from './Item';
import { ItemCard } from './Item';
import { Section } from './Section';

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const [recycleItems, setRecycleItems] = useState<React.ReactElement[]>([]);
  const [questItems, setQuestItems] = useState<React.ReactElement[]>([]);
  const [upgradeItems, setUpgradeItems] = useState<React.ReactElement[]>([]);
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
      const upgradeItems: React.ReactElement[] = [];
      const projectItems: React.ReactElement[] = [];

      for (const item of items) {
        if (groups.recycle.includes(item.key)) {
          recycleItems.push(item);
        } else {
          if (groups.quests.includes(item.key)) {
            questItems.push(item);
          }
          if (groups.upgrades.includes(item.key)) {
            upgradeItems.push(item);
          }
          if (groups.projects.includes(item.key)) {
            projectItems.push(item);
          }
        }
      }

      setRecycleItems(recycleItems);
      setQuestItems(questItems);
      setUpgradeItems(upgradeItems);
      setProjectItems(projectItems);
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFilter('');
      }

      if (
        /^[a-z]$/.test(e.key) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        setFilter(e.key);
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="bg-slate-900 flex flex-col gap-4 p-4 min-h-screen">
      <input
        ref={inputRef}
        name="search"
        type="text"
        className="bg-white p-2 rounded w-50 self-center"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Section title="♻️ Safe to Recycle" items={recycleItems} search={search} />
      <Section title="📋 Keep for Quests" items={questItems} search={search} />
      <Section
        title="⬆️ Workshop Upgrades"
        items={upgradeItems}
        search={search}
      />
      <Section
        title="🏗️ Keep for Projects"
        items={projectItems}
        search={search}
      />
    </div>
  );
};

export default App;
