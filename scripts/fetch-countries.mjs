// Builds data/countries.js: the "7 things to know" for every country.
//
// Sources (all free, no key):
//  - IMF World Economic Outlook (DataMapper API): current-year estimates and next-year forecasts
//    for population, GDP, GDP per person, growth, inflation and unemployment.
//  - World Bank World Development Indicators: long history (2000 onwards) and a cross-check.
//  - ExchangeRate-API (open.er-api.com): today's exchange rate against the US dollar.
//
// Each figure keeps a note of its source. Where the IMF and World Bank disagree a lot on the same
// year, the gap is stored so the site can tell students the sources differ.
// Run: node scripts/fetch-countries.mjs
import { writeFile, mkdir } from 'node:fs/promises';

const FROM = 2000;
const NOW = new Date().getUTCFullYear();      // current year: IMF estimate
const TO = NOW + 1;                           // next year: IMF forecast
const N = TO - FROM + 1;

const IND = {
  pop:    { wb: 'SP.POP.TOTL',       imf: 'LP',         imfScale: 1e6 },
  gdp:    { wb: 'NY.GDP.MKTP.CD',    imf: 'NGDPD',      imfScale: 1e9 },
  gdppc:  { wb: 'NY.GDP.PCAP.CD',    imf: 'NGDPDPC',    imfScale: 1 },
  growth: { wb: 'NY.GDP.MKTP.KD.ZG', imf: 'NGDP_RPCH',  imfScale: 1 },
  infl:   { wb: 'FP.CPI.TOTL.ZG',    imf: 'PCPIPCH',    imfScale: 1 },
  unemp:  { wb: 'SL.UEM.TOTL.ZS',    imf: 'LUR',        imfScale: 1 },
  fx:     { wb: 'PA.NUS.FCRF' }
};
const RATE_KEYS = ['growth', 'infl', 'unemp'];

// ISO 4217 currency for each country (World Bank ISO3 codes). Euro area (incl. Bulgaria from 2026) uses EUR.
const CURRENCY = Object.fromEntries(('ABW:AWG AFG:AFN AGO:AOA ALB:ALL AND:EUR ARE:AED ARG:ARS ARM:AMD ASM:USD ATG:XCD AUS:AUD AUT:EUR AZE:AZN BDI:BIF BEL:EUR BEN:XOF BFA:XOF BGD:BDT BGR:EUR BHR:BHD BHS:BSD BIH:BAM BLR:BYN BLZ:BZD BMU:BMD BOL:BOB BRA:BRL BRB:BBD BRN:BND BTN:BTN BWA:BWP CAF:XAF CAN:CAD CHE:CHF CHI:GBP CHL:CLP CHN:CNY CIV:XOF CMR:XAF COD:CDF COG:XAF COL:COP COM:KMF CPV:CVE CRI:CRC CUB:CUP CUW:XCG CYM:KYD CYP:EUR CZE:CZK DEU:EUR DJI:DJF DMA:XCD DNK:DKK DOM:DOP DZA:DZD ECU:USD EGY:EGP ERI:ERN ESP:EUR EST:EUR ETH:ETB FIN:EUR FJI:FJD FRA:EUR FRO:DKK FSM:USD GAB:XAF GBR:GBP GEO:GEL GHA:GHS GIB:GIP GIN:GNF GMB:GMD GNB:XOF GNQ:XAF GRC:EUR GRD:XCD GRL:DKK GTM:GTQ GUM:USD GUY:GYD HKG:HKD HND:HNL HRV:EUR HTI:HTG HUN:HUF IDN:IDR IMN:GBP IND:INR IRL:EUR IRN:IRR IRQ:IQD ISL:ISK ISR:ILS ITA:EUR JAM:JMD JOR:JOD JPN:JPY KAZ:KZT KEN:KES KGZ:KGS KHM:KHR KIR:AUD KNA:XCD KOR:KRW KWT:KWD LAO:LAK LBN:LBP LBR:LRD LBY:LYD LCA:XCD LIE:CHF LKA:LKR LSO:LSL LTU:EUR LUX:EUR LVA:EUR MAC:MOP MAF:EUR MAR:MAD MCO:EUR MDA:MDL MDG:MGA MDV:MVR MEX:MXN MHL:USD MKD:MKD MLI:XOF MLT:EUR MMR:MMK MNE:EUR MNG:MNT MNP:USD MOZ:MZN MRT:MRU MUS:MUR MWI:MWK MYS:MYR NAM:NAD NCL:XPF NER:XOF NGA:NGN NIC:NIO NLD:EUR NOR:NOK NPL:NPR NRU:AUD NZL:NZD OMN:OMR PAK:PKR PAN:PAB PER:PEN PHL:PHP PLW:USD PNG:PGK POL:PLN PRI:USD PRK:KPW PRT:EUR PRY:PYG PSE:ILS PYF:XPF QAT:QAR ROU:RON RUS:RUB RWA:RWF SAU:SAR SDN:SDG SEN:XOF SGP:SGD SLB:SBD SLE:SLE SLV:USD SMR:EUR SOM:SOS SRB:RSD SSD:SSP STP:STN SUR:SRD SVK:EUR SVN:EUR SWE:SEK SWZ:SZL SXM:XCG SYC:SCR SYR:SYP TCA:USD TCD:XAF TGO:XOF THA:THB TJK:TJS TKM:TMT TLS:USD TON:TOP TTO:TTD TUN:TND TUR:TRY TUV:AUD TZA:TZS UGA:UGX UKR:UAH URY:UYU USA:USD UZB:UZS VCT:XCD VEN:VES VGB:USD VIR:USD VNM:VND VUT:VUV WSM:WST XKX:EUR YEM:YER ZAF:ZAR ZMB:ZMW ZWE:ZWG').split(' ').map(p => p.split(':')));

async function getJSON(url) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'InvisibleHand/1.0 (education)' }, signal: AbortSignal.timeout(60000) });
      if (r.ok) return await r.json();
    } catch (e) { /* retry */ }
    await new Promise(res => setTimeout(res, 2000 * (i + 1)));
  }
  throw new Error('Failed to fetch ' + url);
}
async function wbAll(base) {
  const first = await getJSON(base + '&page=1');
  let rows = first[1] || [];
  for (let p = 2; p <= first[0].pages; p++) rows = rows.concat((await getJSON(base + '&page=' + p))[1] || []);
  return rows;
}
const round = (k, v) => {
  if (v === null || v === undefined || !isFinite(v)) return null;
  if (k === 'pop') return Math.round(v);
  if (k === 'gdp') return Math.round(v / 1e6) * 1e6;
  if (k === 'gdppc') return Math.round(v);
  return Math.round(v * 100) / 100;
};

/* ---------- countries ---------- */
const meta = await wbAll('https://api.worldbank.org/v2/country?format=json&per_page=400');
const countries = {};
for (const c of meta) {
  const agg = c.region && c.region.id === 'NA';
  if (agg && c.id !== 'WLD') continue;
  countries[c.id] = { n: c.id === 'WLD' ? 'World' : c.name, a2: c.iso2Code, r: agg ? '' : c.region.value.trim(), i: agg ? '' : c.incomeLevel.value.trim(), c: c.capitalCity || '', s: {}, src: {}, chk: {} };
}

/* ---------- World Bank history ---------- */
const wb = {};
for (const [k, d] of Object.entries(IND)) {
  wb[k] = {};
  const rows = await wbAll(`https://api.worldbank.org/v2/country/all/indicator/${d.wb}?format=json&date=${FROM}:${NOW}&per_page=20000`);
  for (const row of rows) {
    if (!countries[row.countryiso3code] || row.value == null) continue;
    (wb[k][row.countryiso3code] ||= {})[row.date] = row.value;
  }
  console.log('World Bank', k);
}

/* ---------- IMF estimates & forecasts ---------- */
const imf = {};
for (const [k, d] of Object.entries(IND)) {
  if (!d.imf) continue;
  imf[k] = {};
  try {
    const j = await getJSON(`https://www.imf.org/external/datamapper/api/v1/${d.imf}`);
    const vals = (j.values && j.values[d.imf]) || {};
    for (const [code, years] of Object.entries(vals)) {
      const id = code === 'WEOWORLD' ? 'WLD' : code;
      if (!countries[id]) continue;
      if (id === 'WLD' && k === 'pop') continue; // IMF "world" only sums its member countries; keep the UN/World Bank total
      imf[k][id] = Object.fromEntries(Object.entries(years).map(([y, v]) => [y, v * d.imfScale]));
    }
    console.log('IMF', k, Object.keys(imf[k]).length, 'countries');
  } catch (e) { console.log('IMF', k, 'unavailable:', e.message); }
}

/* ---------- merge: IMF where it has the year, World Bank otherwise ---------- */
for (const [id, c] of Object.entries(countries)) {
  for (const k of Object.keys(IND)) {
    const arr = new Array(N).fill(null), from = new Array(N).fill(null);
    for (let y = FROM; y <= TO; y++) {
      const iv = imf[k]?.[id]?.[y], wv = wb[k]?.[id]?.[y];
      if (iv != null) { arr[y - FROM] = round(k, iv); from[y - FROM] = 'i'; }
      else if (wv != null && y <= NOW) { arr[y - FROM] = round(k, wv); from[y - FROM] = 'w'; }
    }
    if (arr.some(v => v != null)) { c.s[k] = arr; c.src[k] = from.map(x => x || '').join(','); }
    // cross-check the last full year both sources cover
    for (let y = NOW - 1; y >= NOW - 3; y--) {
      const iv = imf[k]?.[id]?.[y], wv = wb[k]?.[id]?.[y];
      if (iv == null || wv == null) continue;
      const gap = RATE_KEYS.includes(k) ? Math.abs(iv - wv) : Math.abs(iv / wv - 1) * 100;
      const big = RATE_KEYS.includes(k) ? gap >= 1.5 : gap >= 8;
      if (big) c.chk[k] = { y, imf: round(k, iv), wb: round(k, wv) };
      break;
    }
  }
}

/* ---------- today's exchange rates ---------- */
let fxDate = null;
try {
  const fx = await getJSON('https://open.er-api.com/v6/latest/USD');
  if (fx.result === 'success') {
    fxDate = new Date(fx.time_last_update_unix * 1000).toISOString().slice(0, 10);
    for (const [id, c] of Object.entries(countries)) {
      const code = CURRENCY[id];
      if (code && fx.rates[code] != null) c.fxNow = { cur: code, r: Math.round(fx.rates[code] * 10000) / 10000 };
    }
  }
  console.log('Exchange rates for', fxDate);
} catch (e) { console.log('Exchange rates unavailable:', e.message); }

let checks = 0;
for (const c of Object.values(countries)) { checks += Object.keys(c.chk).length; if (!Object.keys(c.chk).length) delete c.chk; }

const out = {
  updated: new Date().toISOString(),
  from: FROM, now: NOW, to: TO, fxDate,
  sources: {
    i: { name: 'IMF World Economic Outlook', url: 'https://www.imf.org/external/datamapper/' },
    w: { name: 'World Bank, World Development Indicators', url: 'https://data.worldbank.org/' },
    fx: { name: 'ExchangeRate-API', url: 'https://www.exchangerate-api.com/' }
  },
  codes: Object.fromEntries(Object.entries(IND).map(([k, d]) => [k, { wb: d.wb, imf: d.imf || null }])),
  countries
};
await mkdir('data', { recursive: true });
await writeFile('data/countries.js', '/* Generated by scripts/fetch-countries.mjs. Do not edit by hand. */\nwindow.IH_COUNTRIES = ' + JSON.stringify(out) + ';\n');
console.log('Wrote data/countries.js:', Object.keys(countries).length, 'countries,', checks, 'figures where IMF and World Bank differ a lot');

