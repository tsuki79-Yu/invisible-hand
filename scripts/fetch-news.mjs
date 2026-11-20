// Collects headlines (title, picture, link) from reliable news feeds.
// Writes data/news.js. Run: node scripts/fetch-news.mjs
// Only the headline, image and link are stored: readers click through to the original site.
import { writeFile, mkdir } from 'node:fs/promises';

// Every source here is FREE to read (no subscription or paywall) and well established.
// region: global | uz (Uzbekistan & Central Asia) | official (central banks & their research)
// label: shown to students so they know what kind of source it is
// econOnly: general news feeds; keep only economy and business headlines
const FEEDS = [
  // Global news (public broadcasters and major free outlets)
  { id: 'bbc', name: 'BBC Business', region: 'global', url: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
  { id: 'guardian', name: 'The Guardian', region: 'global', url: 'https://www.theguardian.com/business/economics/rss' },
  { id: 'cnbc', name: 'CNBC', region: 'global', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258' },
  { id: 'npr', name: 'NPR Economy', region: 'global', url: 'https://feeds.npr.org/1017/rss.xml' },
  { id: 'planetmoney', name: 'Planet Money', region: 'global', label: 'podcast', url: 'https://feeds.npr.org/510289/podcast.xml' },
  { id: 'dw', name: 'DW Business', region: 'global', url: 'https://rss.dw.com/rdf/rss-en-bus' },
  { id: 'euronews', name: 'Euronews Business', region: 'global', url: 'https://www.euronews.com/rss?level=vertical&name=business' },
  { id: 'france24', name: 'France 24 Business', region: 'global', url: 'https://www.france24.com/en/business/rss' },
  { id: 'aljazeera', name: 'Al Jazeera', region: 'global', econOnly: true, url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { id: 'cbc', name: 'CBC Business', region: 'global', url: 'https://www.cbc.ca/webfeed/rss/rss-business' },
  { id: 'abc', name: 'ABC News Business', region: 'global', url: 'https://www.abc.net.au/news/feed/51892/rss.xml' },
  // Central banks and their research
  { id: 'fed', name: 'Federal Reserve', region: 'official', label: 'official', url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
  { id: 'ecb', name: 'European Central Bank', region: 'official', label: 'official', url: 'https://www.ecb.europa.eu/rss/press.html' },
  { id: 'boe', name: 'Bank of England', region: 'official', label: 'official', url: 'https://www.bankofengland.co.uk/rss/news' },
  { id: 'libertystreet', name: 'Liberty Street Economics (NY Fed)', region: 'official', label: 'research', url: 'https://libertystreeteconomics.newyorkfed.org/feed/' },
  // Uzbekistan & Central Asia
  { id: 'gazeta', name: 'Gazeta.uz', region: 'uz', url: 'https://www.gazeta.uz/en/rss/' },
  { id: 'kun', name: 'Kun.uz', region: 'uz', url: 'https://kun.uz/en/news/rss' },
  { id: 'daryo', name: 'Daryo', region: 'uz', econOnly: true, url: 'https://daryo.uz/en/feed' },
  { id: 'uza', name: 'UzA', region: 'uz', label: 'state', econOnly: true, url: 'https://uza.uz/en/rss' },
  { id: 'spot', name: 'Spot.uz', region: 'uz', lang: 'ru', url: 'https://www.spot.uz/rss/' },
  { id: 'eurasianet', name: 'Eurasianet', region: 'uz', econOnly: true, url: 'https://eurasianet.org/rss' },
  { id: 'tca', name: 'Times of Central Asia', region: 'uz', econOnly: true, url: 'https://timesca.com/feed/' }
];
const PER_FEED = 12;
const ECON = /econom|inflation|price|bank|financ|budget|tax|trade|export|import|invest|gdp|growth|market|stock|bond|currenc|so.m|dollar|interest|rate|debt|loan|credit|wage|salar|job|employ|business|compan|industr|energy|oil|gas|gold|tariff|privati|exchange|fund|imf|world bank|ebrd|asian development|revenue|manufactur|tourism|agricult|cotton|harvest|startup|tech|crypto|bitcoin|mining|logistic|transport|construction|property|housing|reform|sanction|remittance|labou?r|migra|poverty|income|spending|deficit|surplus/i;

const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&amp;/g, '&');
const strip = s => decode(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const tag = (xml, t) => { const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, 'i')); return m ? m[1] : ''; };

function findImage(item) {
  const urls = [];
  for (const m of item.matchAll(/<media:(?:content|thumbnail)[^>]*url="([^"]+)"[^>]*>/gi)) urls.push({ u: m[1], w: +((m[0].match(/width="(\d+)"/) || [])[1] || 0) });
  for (const m of item.matchAll(/<enclosure[^>]*>/gi)) {
    if (/type="image/i.test(m[0])) { const u = m[0].match(/url="([^"]+)"/); if (u) urls.push({ u: u[1], w: 0 }); }
  }
  if (!urls.length) { const m = decode(item).match(/<img[^>]+src="([^"]+)"/i); if (m) urls.push({ u: m[1], w: 0 }); }
  if (!urls.length) return '';
  urls.sort((a, b) => b.w - a.w);
  let u = decode(urls[0].u).replace('/standard/240/', '/standard/480/'); // BBC: larger thumbnail
  return u.startsWith('https://') ? u : '';
}

async function readFeed(f) {
  const r = await fetch(f.url, { headers: { 'User-Agent': 'Mozilla/5.0 (InvisibleHand news reader; education)' } });
  if (!r.ok) throw new Error(String(r.status));
  const xml = await r.text();
  const items = [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map(m => m[0])
    .filter(it => !f.econOnly || ECON.test(strip(tag(it, 'title'))))
    .slice(0, PER_FEED);
  const now = Date.now();
  return items.map(it => {
    // Items with no publication date are skipped: we can't tell if they are fresh,
    // and stamping them "now" would push them unfairly to the top.
    const raw = strip(tag(it, 'pubDate')) || strip(tag(it, 'dc:date'));
    const d = raw ? new Date(raw) : null;
    if (!d || isNaN(d)) return null;
    return {
      t: strip(tag(it, 'title')),
      u: strip(tag(it, 'link')) || strip(tag(it, 'guid')),
      img: findImage(it),
      d: new Date(Math.min(d.getTime(), now)).toISOString(),
      s: f.id
    };
  }).filter(x => x && x.t && x.u && x.u.startsWith('http'));
}

let items = [];
const status = {};
for (const f of FEEDS) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try { const got = await readFeed(f); items = items.concat(got); status[f.id] = got.length; break; }
    catch (e) { status[f.id] = 'error ' + e.message; await new Promise(r => setTimeout(r, 2000 * attempt)); }
  }
}
const seen = new Set();
items = items.filter(i => (seen.has(i.u) ? false : seen.add(i.u))).sort((a, b) => b.d.localeCompare(a.d));

const out = {
  updated: new Date().toISOString(),
  sources: FEEDS.map(({ id, name, region, lang, label }) => ({ id, name, region, lang: lang || 'en', label: label || '' })),
  items
};
await mkdir('data', { recursive: true });
await writeFile('data/news.js', '/* Generated by scripts/fetch-news.mjs. Do not edit by hand. */\nwindow.IH_NEWS = ' + JSON.stringify(out) + ';\n');
console.log('Wrote data/news.js:', items.length, 'headlines', JSON.stringify(status));
