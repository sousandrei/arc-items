import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

import type { Item } from './Item';
import { ItemCard } from './Item';
import { Section } from './Section';

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state

  const [items, setItems] = useState<React.ReactElement<Item>[]>([]);
  const [recycleItems, setRecycleItems] = useState<React.ReactElement<Item>[]>(
    [],
  );
  const [questItems, setQuestItems] = useState<React.ReactElement<Item>[]>([]);
  const [upgradeItems, setUpgradeItems] = useState<React.ReactElement<Item>[]>(
    [],
  );
  const [projectItems, setProjectItems] = useState<React.ReactElement<Item>[]>(
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(filter);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [filter]);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true); // Set loading to true at the start
      try {
        const items: React.ReactElement<Item>[] = await fetch('items.json') // Corrected fetch URL
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
          );

        const groups = await fetch('groups.json')
          .then((response) => response.json())
          .catch((error) => console.error('Error fetching groups:', error));

        if (!items) return;

        const recycleItems: React.ReactElement<Item>[] = [];
        const questItems: React.ReactElement<Item>[] = [];
        const upgradeItems: React.ReactElement<Item>[] = [];
        const projectItems: React.ReactElement<Item>[] = [];

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

        setItems(items);
        setRecycleItems(recycleItems);
        setQuestItems(questItems);
        setUpgradeItems(upgradeItems);
        setProjectItems(projectItems);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetch (success or error)
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFilter('');
      }

      if (
        /^[a-zA-Z0-9]$/.test(e.key) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setFilter((filter) => filter + e.key);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <main className="flex flex-col items-center bg-zinc-900 min-h-screen font-sans">
      <header className="z-1 fixed top-4 max-w-screen-md p-2 rounded-full border border-white/20 bg-neutral-950/20 backdrop-blur-lg shadow-xl">
        <div className="flex items-center w-full">
          <label htmlFor="search" className="pl-4">
            <Search className="text-cyan-500" />
          </label>
          <input
            ref={inputRef}
            id="search"
            name="search"
            type="text"
            className="w-full bg-transparent p-4 text-white placeholder:text-neutral-400 focus:outline-none"
            placeholder="Search for an item..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </header>
      {isLoading ? ( // Conditional rendering for loading state
        <div className="flex flex-col items-center justify-center min-h-screen text-white text-xl">
          <p>Loading items...</p>
        </div>
      ) : (
        <div className="p-8 pt-28 w-full flex flex-col gap-8 max-w-screen-2xl mx-auto">
          <Section
            title="♻️ Safe to Recycle"
            items={recycleItems}
            search={search}
          />
          <Section
            title="📋 Keep for Quests"
            items={questItems}
            search={search}
          />
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
          <Section title="📦 All Items" items={items} search={search} />
        </div>
      )}
    </main>
  );
};

export default App;
