// Picks the "Worth your attention" pairs automatically from data/news.js.
//  - "Everyone is talking about": the story covered by the most different sources right now.
//  - "Worth a closer look": a story about the real economy (prices, rates, jobs, trade, banks…)
//    that few outlets are covering. The third pair always comes from Uzbekistan & Central Asia.
// If an editor wrote the picks by hand (mode: "editor") in the last 7 days, this script leaves them alone.
// Run after fetch-news: node scripts/make-spotlight.mjs
import { readFile, writeFile } from 'node:fs/promises';

const news = JSON.parse((await readFile('data/news.js', 'utf8')).replace(/^[\s\S]*?window\.IH_NEWS = /, '').replace(/;\s*$/, ''));

try {
  const prev = await readFile('data/spotlight.js', 'utf8');
  const m = prev.match(/mode:\s*"editor"[\s\S]*?updated:\s*"([^"]+)"/) || prev.match(/updated:\s*"([^"]+)"[\s\S]*?mode:\s*"editor"/);
  if (m && Date.now() - new Date(m[1]).getTime() < 7 * 86400000) {
    console.log('Editor picks from', m[1], 'are less than 7 days old. Leaving them.');
    process.exit(0);
  }
} catch { /* no previous file */ }

const SRC = Object.fromEntries(news.sources.map(s => [s.id, s]));
const AUTHORITY = ['bbc', 'guardian', 'npr', 'dw', 'cnbc', 'france24', 'euronews', 'aljazeera', 'cbc', 'abc', 'planetmoney',
  'fed', 'ecb', 'boe', 'libertystreet', 'gazeta', 'kun', 'eurasianet', 'tca', 'daryo', 'uza', 'spot'];
const auth = id => { const i = AUTHORITY.indexOf(id); return i < 0 ? 0 : (AUTHORITY.length - i) / AUTHORITY.length; };

const STOP = new Set(('the and for with from that this are was its has have will after over into amid says said say new more than how why what who about could would may can not but out off down first last year years week weeks month months today live latest news update updates business market markets stock stocks shares share economy economic economics global world report reports price prices rate rates biggest big top best most just ahead back set get gets make makes against under between also two three four five one day days time times again still near despite since while where when there their they them his her him she you your our will its it\'s may might must should here hit hits rise rises rising fall falls falling record high higher low lower deal deals plan plans move moves says says firm firms company companies people country countries government state minister ministry billion million trillion percent per cent bn mn first second third end start president former chief boss head ceo cut cuts amid via like look looks take takes why key watch latest live sees seen show shows find found could amid over under expected expects expect warns warn warning calls call talks talk major uzbekistan uzbek tashkent central asia asian kazakhstan region regional national international official officials january february march april may june july august september october november december monday tuesday wednesday thursday friday saturday sunday').split(/\s+/));

const words = t => t.toLowerCase().replace(/[’']/g, '').split(/[^\p{L}\p{N}]+/u).filter(w => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w));

const now = Date.now();
const recent = (h, region) => news.items.filter(i => {
  const s = SRC[i.s] || {};
  if (s.lang === 'ru') return false;
  if (region === 'uz' ? s.region !== 'uz' : s.region === 'uz') return false;
  return now - new Date(i.d).getTime() < h * 3600000;
});

function loudTerms(items, minSources) {
  const bySrc = {};
  for (const it of items) for (const w of new Set(words(it.t))) (bySrc[w] ||= new Set()).add(it.s);
  return Object.entries(bySrc).map(([w, s]) => ({ w, n: s.size })).filter(x => x.n >= minSources).sort((a, b) => b.n - a.n);
}
function bestHeadline(items, term) {
  return items.filter(i => words(i.t).includes(term))
    .sort((a, b) => (auth(b.s) - auth(a.s)) || b.d.localeCompare(a.d))[0];
}

const TOPICS = [
  { id: 'inflation', re: /inflation|consumer price|cpi\b|cost of living|price growth|prices (rise|rose|jump|climb|fall|fell|ease)/i,
    en: 'Inflation decides how far every paycheque stretches and what the central bank does next. It shapes daily life long after the buzz around today\'s top story fades.',
    gz: 'Inflation = how far your money goes. It hits everyone\'s wallet, so it matters way longer than today\'s drama.' },
  { id: 'central-banks', re: /interest rate|rate (cut|hike|decision)|central bank|federal reserve|\bfed\b|\becb\b|monetary|refinancing rate|policy rate|bank of (england|japan)/i,
    en: 'Interest rate decisions change the cost of every loan, mortgage and savings account. They move economies slowly, but for years.',
    gz: 'Rates decide what your loans cost and what your savings earn. Slow burn, huge impact.' },
  { id: 'gdp', re: /\bgdp\b|recession|economy (shrinks|shrank|contracts|contracted|grows|grew|slows|slowed)|economic growth|growth forecast|unemployment|jobless|payrolls|jobs report|wages|labou?r market|output/i,
    en: 'Growth and jobs data show whether an economy is actually getting stronger. For most people that matters more than the day\'s loudest headline.',
    gz: 'Growth + jobs data = is the economy actually ok? That affects way more people than the headline drama.' },
  { id: 'trade', re: /tariff|trade (war|deal|deficit|surplus|talks)|exports?|imports?|exchange rate|currency|so.m\b|\byen\b|\byuan\b|dollar (rises|falls|weakens|strengthens)|remittance/i,
    en: 'Trade and currency moves change what imports cost and which industries win or lose, often before anyone notices.',
    gz: 'Trade and currency moves decide what your imported stuff costs. Quiet, but it adds up.' },
  { id: 'banking', re: /\bbanks?\b|lending|loans?|credit|deposit|default|bankrupt|insolven/i,
    en: 'Stress in banks and credit spreads quietly to every borrower and business. Financial crises usually start with stories like this one.',
    gz: 'Bank and credit stress spreads to everyone who borrows. Crises usually start with a headline like this.' },
  { id: 'markets', re: /bond|yields?|treasur|gilts?/i,
    en: 'Bond yields set the price of borrowing for governments, firms and households. When they move, everything else follows.',
    gz: 'Bond yields = the price of borrowing for literally everyone. When they move, everything moves.' },
  { id: 'growth', re: /invest(ment|ors?)? in|productivity|poverty|development bank|infrastructure|privati[sz]|reform/i,
    en: 'Investment, productivity and reform decide living standards over decades, far longer than any news cycle.',
    gz: 'This is the long game: investment and reforms decide how rich a country gets over decades.' },
  { id: 'market-failures', re: /energy (price|cost|bill)|electricity|power grid|climate|emission|carbon|pollution|oil price|gas price/i,
    en: 'Energy and climate costs often land on people who aren\'t part of the deal. When prices leave those costs out, problems build up quietly.',
    gz: 'Energy and climate costs hit people who never agreed to them. That\'s an externality, and it\'s a big deal.' },
  { id: 'personal', re: /pension|savings|mortgage|household debt|rent|budget(ing)?|student loan/i,
    en: 'Pensions, savings and household debt decide people\'s financial security. They rarely trend, but they matter.',
    gz: 'Pensions, savings, debt: not trending, but this is your actual future.' }
];
const topicOf = t => TOPICS.find(x => x.re.test(t));

function quietPick(items, avoidTerms, usedTopics, usedUrls) {
  const counts = {};
  for (const it of items) for (const w of new Set(words(it.t))) (counts[w] ||= new Set()).add(it.s);
  let best = null;
  for (const it of items) {
    if (usedUrls.has(it.u)) continue;
    const tp = topicOf(it.t); if (!tp || usedTopics.has(tp.id)) continue;
    const ws = words(it.t);
    if (ws.some(w => avoidTerms.includes(w))) continue;
    const coverage = Math.max(1, ...ws.map(w => (counts[w] || new Set()).size));
    const ageH = (now - new Date(it.d).getTime()) / 3600000;
    const score = 3 - coverage * 0.6 + auth(it.s) * 1.5 - ageH / 48 + (SRC[it.s]?.label === 'opinion' ? -1 : 0);
    if (!best || score > best.score) best = { it, tp, score };
  }
  return best;
}

const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
const link = it => ({ t: it.t, src: SRC[it.s]?.name || it.s, u: it.u });

const picks = [], usedTopics = new Set(), usedUrls = new Set();
let globalItems = recent(48, 'global'); if (globalItems.length < 30) globalItems = recent(96, 'global');
const louds = loudTerms(globalItems, 3);
const loudWords = louds.slice(0, 6).map(x => x.w);

// Two global pairs
const usedLoud = [];
for (const L of louds) {
  if (picks.length >= 2) break;
  if (usedLoud.includes(L.w)) continue; // same story as an earlier pick
  const head = bestHeadline(globalItems.filter(i => !usedLoud.some(u => words(i.t).includes(u))), L.w);
  if (!head || usedUrls.has(head.u)) continue;
  const q = quietPick(globalItems, loudWords, usedTopics, usedUrls);
  if (!q) break;
  // remember every big word of this story so the next pick is a different story
  for (const w of words(head.t)) if (louds.some(x => x.w === w)) usedLoud.push(w);
  usedLoud.push(L.w); usedUrls.add(head.u); usedUrls.add(q.it.u); usedTopics.add(q.tp.id);
  picks.push({
    loud: { ...link(head), n: L.n, term: cap(L.w) },
    quiet: link(q.it),
    why: `${cap(L.w)} is all over the news today (${L.n} outlets). ${q.tp.en}`,
    whyGz: `Everyone's on the ${cap(L.w)} story (${L.n} outlets). ${q.tp.gz}`,
    topic: q.tp.id
  });
}

// Uzbekistan & Central Asia pair
let uzItems = recent(72, 'uz'); if (uzItems.length < 10) uzItems = recent(168, 'uz');
const uzLoud = loudTerms(uzItems, 2)[0];
const uzQ = quietPick(uzItems, uzLoud ? [uzLoud.w] : [], new Set(), usedUrls);
if (uzQ) {
  const head = uzLoud ? bestHeadline(uzItems.filter(i => i.u !== uzQ.it.u), uzLoud.w) : null;
  const loudItem = head || uzItems.filter(i => i.u !== uzQ.it.u).sort((a, b) => auth(b.s) - auth(a.s) || b.d.localeCompare(a.d))[0];
  if (loudItem) {
    const n = uzLoud ? uzLoud.n : 1;
    picks.push({
      loud: { ...link(loudItem), n, term: uzLoud ? cap(uzLoud.w) : '' },
      quiet: link(uzQ.it),
      why: (uzLoud ? `In Uzbekistan and Central Asia, ${cap(uzLoud.w)} is the story most outlets are running (${n} outlets). ` : '') + uzQ.tp.en,
      whyGz: (uzLoud ? `Back home, everyone's covering ${cap(uzLoud.w)}. ` : '') + uzQ.tp.gz,
      topic: uzQ.tp.id
    });
  }
}

if (!picks.length) { console.log('Not enough headlines to make picks. Keeping the previous file.'); process.exit(0); }

const out = {
  mode: 'auto',
  updated: new Date().toISOString(),
  week: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  picks
};
await writeFile('data/spotlight.js', '/* "Worth your attention". Picked automatically by scripts/make-spotlight.mjs.\n   To write the picks by hand, set mode to "editor" and update "updated": the automatic picker then waits 7 days. */\nwindow.IH_SPOTLIGHT = ' + JSON.stringify(out, null, 2) + ';\n');
console.log('Wrote data/spotlight.js');
for (const p of picks) console.log(`\nLOUD  [${p.loud.src}, ${p.loud.n}] ${p.loud.t}\nQUIET [${p.quiet.src}] ${p.quiet.t}\n      -> ${p.topic}`);
