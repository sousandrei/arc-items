import fs from 'node:fs';

const METAFORGE_API = 'https://metaforge.app/api/arc-raiders/items';

const items = [];

let page = 0;

for (let end = true; end; ) {
  console.log(`Fetching page ${page}...`);

  const params = new URLSearchParams();
  params.append('limit', '100');
  params.append('page', page.toString());

  const { data, pagination } = await fetch(
    `${METAFORGE_API}?${params.toString()}`,
  ).then((r) => r.json());

  items.push(...data);
  page += 1;

  end = pagination.hasNextPage;
}

console.log(`Fetched ${items.length} items.`);
fs.writeFileSync('public/items.json', JSON.stringify(items));
