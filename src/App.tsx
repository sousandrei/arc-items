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
    }, 150);

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
        inputRef.current?.blur();
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
    <main className="flex flex-col items-center min-h-screen font-sans text-neutral-200 selection:bg-cyan-500/30 relative">
      <div className="bg-noise"></div>
      <header className="fixed top-6 z-50 w-full max-w-2xl px-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative flex items-center w-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-neutral-900/90">
            <label htmlFor="search" className="pl-5 pr-3 cursor-text">
              <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
            </label>
            <input
              ref={inputRef}
              id="search"
              name="search"
              type="text"
              className="w-full bg-transparent py-4 pr-6 text-lg text-white placeholder:text-neutral-500 focus:outline-none"
              placeholder="Search database..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoComplete="off"
            />
            {filter && (
              <button
                type="button"
                onClick={() => {
                  setFilter('');
                  inputRef.current?.focus();
                }}
                className="absolute right-4 p-1 rounded-full hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
              >
                <span className="sr-only">Clear</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Clear</title>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen animate-pulse">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-500 font-medium tracking-wide uppercase text-sm">
            Initializing Database...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-[1600px] mx-auto px-6 pb-24 pt-32 flex flex-col gap-16">
          <Section
            title="Safe to Recycle"
            subtitle="Items with high value but low utility."
            icon="♻️"
            items={recycleItems}
            search={search}
          />
          <Section
            title="Keep for Quests"
            subtitle="Required for completing trader tasks."
            icon="📋"
            items={questItems}
            search={search}
          />
          <Section
            title="Workshop Upgrades"
            subtitle="Essential materials for base expansion."
            icon="⬆️"
            items={upgradeItems}
            search={search}
          />
          <Section
            title="Keep for Projects"
            subtitle="Needed for crafting and special projects."
            icon="🏗️"
            items={projectItems}
            search={search}
          />
          {search.length > 0 && (
            <Section
              title="All Items"
              subtitle="Complete database of known items."
              icon="📦"
              items={items}
              search={search}
            />
          )}
        </div>
      )}
    </main>
  );
};

export default App;
