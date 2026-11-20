/* Invisible Hand: application logic. Plain JavaScript, no build step. */
(function () {
  'use strict';

  /* ---------------- Data & helpers ---------------- */
  var C = window.IH_COUNTRIES || { countries: {}, from: 2000 };
  var NEWS = window.IH_NEWS || { items: [], sources: [] };
  var SPOT = window.IH_SPOTLIGHT || { picks: [] };
  var CT = window.IH_CONTENT;
  var TOPICS = CT.topics;
  var TOPIC = {}; TOPICS.forEach(function (t) { TOPIC[t.id] = t; });

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('ih:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ih:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    lang: store.get('lang', 'en'),
    country: store.get('country', 'UZB'),
    compare: store.get('compare', ''),
    follows: store.get('follows', []),
    newsFilter: 'all', newsQuery: '',
    filmTopic: 'all', filmShift: 0,
    chainIdx: {}
  };
  if (!C.countries[state.country]) state.country = C.countries.UZB ? 'UZB' : Object.keys(C.countries)[0];
  if (state.compare && !C.countries[state.compare]) state.compare = '';
  // shared with Yu (assets/yu.js)
  window.IH = { lang: function () { return state.lang; }, topics: function () { return TOPICS; } };
  function emit(name, detail) { try { document.dispatchEvent(new CustomEvent(name, { detail: detail })); } catch (e) { /* old browser */ } }

  /* ---------------- Language ---------------- */
  var T = {
    en: {
      navToday: 'Today', navLearn: 'Learn', navNews: 'News', navFilms: 'Films', navLibrary: 'Library', search: 'Search',
      heroTitle: 'The economy, <em>made clear.</em>',
      heroLede: 'Live figures for every country, news from trusted free sources, the big ideas with their history, classic papers, films and research tools. Free and open to everyone.',
      showMe: 'Show me', seminarOn: 'Presentation mode', seminarOff: 'Exit presentation mode',
      sevenTitle: '7 things to know about', compareWith: 'Compare with', none: 'No comparison',
      signals: 'What stands out', spotTitle: 'Worth your attention', spotSub: 'What everyone is talking about, and what deserves a closer look. Picked by the editors, linked to the original reporting.',
      loud: 'Everyone is talking about', quiet: 'Worth a closer look', learnConcept: 'Learn the concept', weekOf: 'Week of',
      spotSubAuto: 'The story most outlets are covering, next to a quieter one about the real economy. Picked automatically from 22 sources every few hours.',
      autoPicked: 'Auto-picked', outlets: 'outlets', lab_podcast: 'Podcast', lab_research: 'Research', lab_state: 'State media', lab_official: 'Official', lab_opinion: 'Opinion', fOfficial: 'Central banks & research',
      latest: 'Latest headlines', allNews: 'All news', filmToday: "Today's films", conceptToday: 'Concept of the day', open: 'Open',
      learnTitle: 'Learn', learnSub: 'Beginner to intermediate. Every topic has key ideas, a history chain, the classic papers, videos, films and a quick quiz.',
      econ: 'Economics', fin: 'Finance', topicsN: 'topics', steps: 'steps in its history',
      keyIdeas: 'Key ideas', tryIt: 'Try it', chainTitle: 'How we got here', chainSub: 'The chain of events that led to this idea. Click a step or use the arrow keys.',
      prev: 'Previous', next: 'Next', papersTitle: 'Core papers', papersSub: 'Classic research, all published in Q1 journals. Links open the official DOI or JSTOR page.',
      watch: 'Watch', watchSub: 'Opens a YouTube search for this topic on each channel.', onScreen: 'On screen', quiz: 'Check yourself', score: 'Score',
      newsTitle: 'News', newsSub: 'Headlines from reliable sources, refreshed every few hours. Follow the sources you like and they show first.',
      fAll: 'All', fFollowing: 'Following', fGlobal: 'Global', fUz: 'Uzbekistan & Central Asia', newsSearch: 'Search headlines…', follow: 'Follow', following: 'Following',
      noNews: 'No headlines match. Try another filter or follow a few sources.', updated: 'Updated', sources: 'Sources',
      filmsTitle: 'Films', filmsSub: 'Economics on screen. Three new picks every day, each tied to a concept you can study.', shuffle: 'Shuffle', allFilms: 'All films', allTopics: 'All topics', findFilm: 'Find it',
      libTitle: 'Library', libSub: 'The tools economists actually use, checked and up to date.',
      research: 'Research & papers', data: 'Data', ai: 'AI tools', youtube: 'YouTube channels', creators: 'Creators',
      aiTip: '<b>Before you cite an AI answer:</b> open the original source. AI tools sometimes invent references, so check every paper on Google Scholar.',
      copyCite: 'Copy citation', copied: 'Citation copied', noData: 'No data', latestYr: 'latest', vs: 'vs',
      sourceLine: 'Sources: IMF World Economic Outlook for this year\'s estimates (est.) and next year\'s forecasts, World Bank for the history, ExchangeRate-API for today\'s exchange rate. Refreshed daily. Where the IMF and World Bank disagree a lot, the card says so.',
      seminarHint: 'Big numbers for a projector or screen share.', learnMore: 'Learn more'
    },
    gz: {
      navToday: 'Today', navLearn: 'Learn', navNews: 'The tea', navFilms: 'Movies', navLibrary: 'Toolkit', search: 'Search',
      heroTitle: 'The economy, <em>but make it make sense.</em>',
      heroLede: 'Real stats for every country, legit free news, big ideas with the backstory, papers, movies and tools. Free for everyone.',
      showMe: 'Spill the stats on', seminarOn: 'Presentation mode', seminarOff: 'Exit presentation mode',
      sevenTitle: '7 stats that matter for', compareWith: 'Vs', none: 'Nobody',
      signals: 'The tea, from the data', spotTitle: "Don't sleep on this", spotSub: "What everyone's yapping about vs what you should actually be watching.",
      loud: 'Everyone is yapping about', quiet: 'Lowkey more important', learnConcept: 'Get the concept', weekOf: 'Week of',
      spotSubAuto: "What every outlet is posting vs the quieter story that actually affects your wallet. Auto-picked from 22 sources every few hours.",
      autoPicked: 'Auto-picked', outlets: 'outlets', lab_podcast: 'Podcast', lab_research: 'Research', lab_state: 'State media', lab_official: 'Official', lab_opinion: 'Opinion', fOfficial: 'Central banks & research',
      latest: 'Fresh headlines', allNews: 'All the tea', filmToday: 'Movie night, but make it econ', conceptToday: 'Concept of the day', open: 'Open',
      learnTitle: 'Learn', learnSub: "Beginner to mid-level. Every topic: the main ideas, the backstory, the OG papers, vids, movies and a quick quiz.",
      econ: 'Economics', fin: 'Finance', topicsN: 'topics', steps: 'plot points in the backstory',
      keyIdeas: 'The main ideas', tryIt: 'Play with it', chainTitle: 'The backstory', chainSub: 'How this idea came to be, one plot point at a time. Tap a step or use arrow keys.',
      prev: 'Back', next: 'Next', papersTitle: 'The OG papers', papersSub: 'The classics, all from Q1 journals (the top tier). Links go to the official page.',
      watch: 'Watch', watchSub: 'Opens a YouTube search for this topic on each channel.', onScreen: 'Movies about this', quiz: 'Quick vibe check', score: 'Score',
      newsTitle: 'The tea', newsSub: 'Headlines from legit sources, refreshed every few hours. Follow the ones you like and they go first.',
      fAll: 'All', fFollowing: 'Following', fGlobal: 'Global', fUz: 'Uzbekistan & Central Asia', newsSearch: 'Search headlines…', follow: 'Follow', following: 'Following',
      noNews: 'Nothing here. Try another filter or follow some sources.', updated: 'Updated', sources: 'Sources',
      filmsTitle: 'Movies', filmsSub: 'Learn econ while you watch. Three new picks every day.', shuffle: 'Reroll', allFilms: 'All movies', allTopics: 'All topics', findFilm: 'Find it',
      libTitle: 'Toolkit', libSub: 'Everything you need for research, data and staying in the loop.',
      research: 'Research & papers', data: 'Data', ai: 'AI tools', youtube: 'YouTube', creators: 'Creators',
      aiTip: '<b>Real talk:</b> AI sometimes makes up sources. Always open the actual paper on Google Scholar before you cite it.',
      copyCite: 'Copy citation', copied: 'Citation copied', noData: 'No data', latestYr: 'latest', vs: 'vs',
      sourceLine: 'Sources: IMF (this year\'s estimates + next year\'s forecasts), World Bank (history), ExchangeRate-API (today\'s rate). Refreshed daily.',
      seminarHint: 'Big numbers for a projector or screen share.', learnMore: 'Learn more'
    }
  };
  function t(k) { return (T[state.lang] && T[state.lang][k]) || T.en[k] || k; }
  function L(en, gz) { return state.lang === 'gz' && gz ? gz : en; }

  /* ---------------- Indicators ---------------- */
  var IND = [
    { k: 'pop', en: 'Population', gz: 'Population', fmt: 'big', what: 'People living in the country.', whatGz: 'Total headcount.', code: 'SP.POP.TOTL', long: 'Population, total', mode: 'pct', good: 0 },
    { k: 'gdp', en: 'GDP', gz: 'GDP (the whole bag)', fmt: 'usd', what: 'Value of everything produced in a year, in US dollars.', whatGz: "Everything the country made this year, in dollars.", code: 'NY.GDP.MKTP.CD', long: 'GDP (current US$)', mode: 'pct', good: 1 },
    { k: 'gdppc', en: 'GDP per person', gz: 'GDP per person', fmt: 'usd0', what: 'GDP divided by population: a rough guide to average income.', whatGz: 'The bag split evenly per person. Rough vibe of how rich people are.', code: 'NY.GDP.PCAP.CD', long: 'GDP per capita (current US$)', mode: 'pct', good: 1 },
    { k: 'growth', en: 'Economic growth', gz: 'Growth', fmt: 'pct', what: 'Change in real GDP from the year before.', whatGz: 'Is the economy leveling up? Real GDP change.', code: 'NY.GDP.MKTP.KD.ZG', long: 'GDP growth (annual %)', mode: 'pp', good: 1 },
    { k: 'infl', en: 'Inflation', gz: 'Inflation', fmt: 'pct', what: 'How fast consumer prices rose over the year.', whatGz: 'How fast stuff got pricier.', code: 'FP.CPI.TOTL.ZG', long: 'Inflation, consumer prices (annual %)', mode: 'pp', good: -1 },
    { k: 'unemp', en: 'Unemployment', gz: 'Unemployment', fmt: 'pct', what: 'Share of the labour force looking for work.', whatGz: "Share of job hunters who can't find one.", code: 'SL.UEM.TOTL.ZS', long: 'Unemployment, total (% of total labor force) (modeled ILO estimate)', mode: 'pp', good: -1 },
    { k: 'fx', en: 'Exchange rate', gz: 'Exchange rate', fmt: 'fx', what: 'Local currency per 1 US dollar. Big number: today\'s rate. Chart: yearly averages.', whatGz: 'How much local money buys 1 dollar, as of today.', code: 'PA.NUS.FCRF', long: 'Official exchange rate (LCU per US$, period average)', mode: 'pct', good: 0 }
  ];
  var CUR = { UZB: "so'm", KAZ: 'tenge', KGZ: 'som', TJK: 'somoni', TKM: 'manat', RUS: 'ruble', CHN: 'yuan', JPN: 'yen', GBR: 'pound', IND: 'rupee', TUR: 'lira', KOR: 'won', BRA: 'real', MEX: 'peso', ZAF: 'rand', NGA: 'naira', EGY: 'pound', IDN: 'rupiah', PAK: 'rupee', UKR: 'hryvnia', CHE: 'franc', CAN: 'dollar', AUS: 'dollar', AZE: 'manat', GEO: 'lari', ARM: 'dram', AFG: 'afghani' };

  var NOWI = (C.now || (C.from + 25)) - C.from; // index of the current year (IMF estimate)
  function full(id, k) { var c = C.countries[id]; return (c && c.s && c.s[k]) || []; }
  function series(id, k) { return full(id, k).slice(0, NOWI + 1); } // up to this year, no forecasts
  function nextVal(id, k) { var v = full(id, k)[NOWI + 1]; return v == null ? null : v; }
  function srcAt(id, k, i) { var c = C.countries[id], s = c && c.src && c.src[k]; return s ? (s.split(',')[i] || '') : 'w'; }
  function isEst(id, k, i) { return i === NOWI && srcAt(id, k, i) === 'i'; }
  var IMF_LONG = { pop: 'Population (millions)', gdp: 'GDP, current prices (billions of US dollars)', gdppc: 'GDP per capita, current prices (US dollars)', growth: 'Real GDP growth (annual percent change)', infl: 'Inflation rate, average consumer prices (annual percent change)', unemp: 'Unemployment rate (percent)' };
  function lastIdx(arr) { for (var i = arr.length - 1; i >= 0; i--) if (arr[i] != null) return i; return -1; }
  function yearOf(i) { return C.from + i; }
  function bigParts(v) {
    var a = Math.abs(v);
    if (a >= 1e12) return [(v / 1e12).toFixed(2), 'T'];
    if (a >= 1e9) return [(v / 1e9).toFixed(2), 'B'];
    if (a >= 1e6) return [(v / 1e6).toFixed(2), 'M'];
    if (a >= 1e3) return [(v / 1e3).toFixed(1), 'K'];
    return [String(Math.round(v)), ''];
  }
  function fmtParts(ind, v) {
    if (v == null) return ['—', ''];
    switch (ind.fmt) {
      case 'big': return bigParts(v);
      case 'usd': var p = bigParts(v); return ['$' + p[0], p[1]];
      case 'usd0': return ['$' + Math.round(v).toLocaleString('en-US'), ''];
      case 'pct': return [v.toFixed(1), '%'];
      case 'fx': return [v >= 100 ? Math.round(v).toLocaleString('en-US') : v.toFixed(2), 'per $'];
    }
    return [String(v), ''];
  }
  function fmtShort(ind, v) { var p = fmtParts(ind, v); return p[0] + (p[1] ? (ind.fmt === 'pct' ? '' : ' ') + p[1] : ''); }
  function cname(id) { var c = C.countries[id]; return c ? c.n : id; }

  /* ---------------- Sparkline ---------------- */
  function sparkline(a, b) {
    var W = 240, H = 54, pad = 5;
    var end = Math.max(lastIdx(a), b ? lastIdx(b) : -1);
    if (end < 1) return '';
    var start = Math.max(0, end - 15);
    var vals = [];
    for (var i = start; i <= end; i++) { if (a[i] != null) vals.push(a[i]); if (b && b[i] != null) vals.push(b[i]); }
    if (vals.length < 2) return '';
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (min === max) { min -= 1; max += 1; }
    var x = function (i) { return ((i - start) / (end - start)) * W; };
    var y = function (v) { return pad + (1 - (v - min) / (max - min)) * (H - pad * 2); };
    function path(s) {
      var d = '', pen = false;
      for (var i = start; i <= end; i++) {
        if (s[i] == null) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(s[i]).toFixed(1) + ' ';
        pen = true;
      }
      return d;
    }
    var out = '<svg class="spark" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">';
    if (min < 0 && max > 0) out += '<line x1="0" x2="' + W + '" y1="' + y(0) + '" y2="' + y(0) + '" style="stroke:var(--line)" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>';
    var la = lastIdx(a);
    if (la > start) {
      var area = path(a);
      var firstI = start; while (a[firstI] == null) firstI++;
      out += '<path d="' + area + 'L' + x(la) + ' ' + H + ' L' + x(firstI) + ' ' + H + ' Z" style="fill:var(--note);opacity:.1"/>';
    }
    if (b) out += '<path d="' + path(b) + '" style="fill:none;stroke:var(--gold)" stroke-width="1.6" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>';
    out += '<path d="' + path(a) + '" style="fill:none;stroke:var(--note)" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';
    if (la >= 0) out += '<path d="M' + x(la) + ' ' + y(a[la]) + ' l0 0" style="stroke:var(--note)" stroke-width="7" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
    out += '</svg><div class="delta" style="justify-content:space-between"><span>' + yearOf(start) + '</span><span>' + yearOf(end) + '</span></div>';
    return out;
  }

  /* ---------------- Country options ---------------- */
  var COUNTRY_IDS = Object.keys(C.countries).filter(function (id) { return id !== 'WLD'; })
    .sort(function (a, b) { return cname(a).localeCompare(cname(b)); });
  if (C.countries.WLD) COUNTRY_IDS.unshift('WLD');
  function countryOptions(sel, withNone) {
    var h = withNone ? '<option value="">' + esc(t('none')) + '</option>' : '';
    COUNTRY_IDS.forEach(function (id) { h += '<option value="' + id + '"' + (id === sel ? ' selected' : '') + '>' + esc(cname(id)) + '</option>'; });
    return h;
  }

  /* ---------------- Signals (computed from data) ---------------- */
  function avg(arr, from, to) { var s = 0, n = 0; for (var i = from; i <= to; i++) if (arr[i] != null) { s += arr[i]; n++; } return n ? s / n : null; }
  // Source of a figure, shown in brackets after each note. Links go to pages that reliably open:
  // IMF figures -> the IMF's page for that country (its chart pages break when the IMF data service is down);
  // World Bank figures -> the World Bank data page for that indicator and country.
  function srcLink(id, k, i) {
    var c = C.countries[id] || {}, code = C.codes && C.codes[k] ? C.codes[k] : {};
    if (srcAt(id, k, i) === 'i' && code.imf) {
      var url = id === 'WLD' ? 'https://www.imf.org/en/Publications/WEO' : 'https://www.imf.org/en/Countries/' + id;
      return '<a class="cite" href="' + url + '" target="_blank" rel="noopener">(' + esc(L('IMF World Economic Outlook', 'IMF')) + (isEst(id, k, i) ? ', ' + esc(L('estimate', 'est.')) : '') + ' ↗)</a>';
    }
    return '<a class="cite" href="https://data.worldbank.org/indicator/' + (code.wb || '') + (c.a2 && id !== 'WLD' ? '?locations=' + c.a2 : '') + '" target="_blank" rel="noopener">(' + esc(L('World Bank', 'World Bank')) + ' ↗)</a>';
  }

  // A recent headline from our trusted sources about the same topic and country, if there is one
  var TOPIC_WORDS = {
    infl: /\binflation\b|consumer prices|\bcpi\b|cost of living/i,
    growth: /\bgdp\b|economic growth|economy (grew|grows|expanded|expands|shrank|shrinks|contracted|contracts|slowed|slows)|\brecession\b/i,
    fx: /exchange rate|devalu|depreciat|appreciat|against the dollar|\b(so.?m|tenge|rouble|ruble|yen|yuan|pound|rupee|lira)\b.*\b(falls?|weakens?|strengthens?|record|slumps?|rall(y|ies))/i,
    gdppc: /per capita|living standards|average (income|wage|salary)|real wages|household incomes?/i,
    unemp: /unemployment|jobless|labou?r market/i,
    pop: /\bpopulation\b|\bcensus\b|birth rate/i
  };
  var DEMONYM = { UZB: 'uzbek', USA: 'us |u\\.s\\.|american|federal reserve|\\bfed\\b', GBR: 'uk |britain|british|bank of england', CHN: 'chinese', JPN: 'japanese', DEU: 'german', FRA: 'french', RUS: 'russian', KAZ: 'kazakh', KGZ: 'kyrgyz', TJK: 'tajik', TKM: 'turkmen', IND: 'indian', TUR: 'turkish', KOR: 'south korea', CAN: 'canadian', AUS: 'australian' };
  function relatedNews(id, k) {
    var re = TOPIC_WORDS[k]; if (!re || id === 'WLD') return null;
    var c = C.countries[id] || {}, name = (c.n || '').split(',')[0].toLowerCase();
    var who = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (DEMONYM[id] ? '|' + DEMONYM[id] : ''), 'i');
    var best = null;
    NEWS.items.forEach(function (n) {
      var src = SRC[n.s] || {};
      if (src.lang === 'ru' || !re.test(n.t)) return;
      if (!who.test(' ' + n.t + ' ')) return;
      if (!best || n.d > best.d) best = n;
    });
    return best;
  }

  function signals(id) {
    var out = [], gz = state.lang === 'gz', name = cname(id);
    var inf = series(id, 'infl'), li = lastIdx(inf);
    if (li > 5) {
      var a = avg(inf, li - 10, li - 1), v = inf[li];
      if (a != null && v - a > 1.5) out.push({ k: 'infl', i: li, c: 'hot', s: Math.abs(v - a), h: gz ? '<b>Inflation is running hot:</b> ' + v.toFixed(1) + '% in ' + yearOf(li) + ' vs a ' + a.toFixed(1) + '% 10-year average.' : '<b>Inflation is above normal.</b> ' + v.toFixed(1) + '% in ' + yearOf(li) + ', compared with a 10-year average of ' + a.toFixed(1) + '%.' });
      else if (a != null && a - v > 1.5) out.push({ k: 'infl', i: li, c: 'good', s: Math.abs(v - a), h: gz ? '<b>Inflation is cooling off:</b> ' + v.toFixed(1) + '% vs ' + a.toFixed(1) + '% on average.' : '<b>Inflation is below its usual level.</b> ' + v.toFixed(1) + '% in ' + yearOf(li) + ', compared with a 10-year average of ' + a.toFixed(1) + '%.' });
    }
    var g = series(id, 'growth'), lg = lastIdx(g);
    if (lg > 5) {
      var ga = avg(g, lg - 10, lg - 1), gv = g[lg];
      if (ga != null && Math.abs(gv - ga) > 1) out.push({ k: 'growth', i: lg, c: gv > ga ? 'good' : 'hot', s: Math.abs(gv - ga), h: gz ? '<b>Growth ' + (gv > ga ? 'is popping off' : 'is slowing') + ':</b> ' + gv.toFixed(1) + '% vs ' + ga.toFixed(1) + '% usual.' : '<b>The economy grew ' + (gv > ga ? 'faster' : 'slower') + ' than usual.</b> ' + gv.toFixed(1) + '% in ' + yearOf(lg) + ' vs a 10-year average of ' + ga.toFixed(1) + '%.' });
    }
    var fx = series(id, 'fx'), lf = lastIdx(fx);
    if (lf > 5 && id !== 'USA' && fx[lf - 5] != null) {
      var ch = (1 - fx[lf - 5] / fx[lf]) * 100, cur = CUR[id] || 'local currency';
      if (Math.abs(ch) > 8) out.push({ k: 'fx', i: lf, c: 'watch', s: Math.abs(ch) / 4, h: ch > 0
        ? (gz ? '<b>The ' + cur + ' got weaker:</b> it lost ' + ch.toFixed(0) + '% vs the dollar since ' + yearOf(lf - 5) + '. Imports cost more.' : '<b>The ' + cur + ' has weakened.</b> It lost ' + ch.toFixed(0) + '% of its value against the dollar between ' + yearOf(lf - 5) + ' and ' + yearOf(lf) + ', making imports more expensive.')
        : (gz ? '<b>The ' + cur + ' got stronger:</b> up ' + (-ch).toFixed(0) + '% vs the dollar since ' + yearOf(lf - 5) + '.' : '<b>The ' + cur + ' has strengthened.</b> It gained ' + (-ch).toFixed(0) + '% against the dollar between ' + yearOf(lf - 5) + ' and ' + yearOf(lf) + '.') });
    }
    if (id !== 'WLD') {
      var pc = series(id, 'gdppc'), lp = lastIdx(pc), w = series('WLD', 'gdppc'), lw = lastIdx(w);
      if (lp >= 0 && lw >= 0) {
        var ratio = pc[lp] / w[lw] * 100;
        out.push({ k: 'gdppc', i: lp, c: ratio >= 100 ? 'good' : 'watch', s: 1, h: gz ? '<b>Average income vs the world:</b> ' + ratio.toFixed(0) + '% of the global average.' : '<b>Average income is ' + ratio.toFixed(0) + '% of the world average</b> (GDP per person, ' + yearOf(lp) + ').' });
      }
      var u = series(id, 'unemp'), lu = lastIdx(u), wu = series('WLD', 'unemp'), lwu = lastIdx(wu);
      if (lu >= 0 && lwu >= 0 && Math.abs(u[lu] - wu[lwu]) > 2) out.push({ k: 'unemp', i: lu, c: u[lu] > wu[lwu] ? 'hot' : 'good', s: Math.abs(u[lu] - wu[lwu]) / 2, h: gz ? '<b>Jobs check:</b> unemployment ' + u[lu].toFixed(1) + '% vs ' + wu[lwu].toFixed(1) + '% globally.' : '<b>Unemployment is ' + (u[lu] > wu[lwu] ? 'above' : 'below') + ' the world rate:</b> ' + u[lu].toFixed(1) + '% vs ' + wu[lwu].toFixed(1) + '%.' });
    } else {
      var pop = series('WLD', 'pop'), lpp = lastIdx(pop);
      if (lpp > 10) out.push({ k: 'pop', i: lpp, c: 'watch', s: 1, h: '<b>The world added ' + ((pop[lpp] - pop[lpp - 10]) / 1e6).toFixed(0) + ' million people</b> between ' + yearOf(lpp - 10) + ' and ' + yearOf(lpp) + '.' });
    }
    out.forEach(function (x) {
      if (!x.k) return;
      x.h += ' ' + srcLink(id, x.k, x.i);
      var n = relatedNews(id, x.k);
      if (n) x.h += '<span class="relnews">' + esc(L('In the news', 'In the news')) + ': <a href="' + esc(n.u) + '" target="_blank" rel="noopener">' + esc(n.t) + ' ↗</a> <span class="relsrc">' + esc((SRC[n.s] || {}).name || n.s) + ' · ' + ago(n.d) + '</span></span>';
    });
    out.sort(function (a, b) { return b.s - a.s; });
    if (!out.length) out.push({ c: '', s: 0, h: 'Not enough recent data for ' + esc(name) + ' to compare against its history.' });
    return out.slice(0, 4);
  }

  /* ---------------- Daily picks ---------------- */
  var DAY = Math.floor(Date.now() / 86400000);
  function dailyFilms(n) {
    var F = CT.films, picks = [], i = 0;
    while (picks.length < n && i < 200) {
      var idx = ((DAY + state.filmShift) * 7 + i * 5) % F.length;
      if (picks.indexOf(idx) < 0) picks.push(idx);
      i++;
    }
    return picks.map(function (k) { return F[k]; });
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* ---------------- Following ---------------- */
  function isFollowing(key) { return state.follows.indexOf(key) >= 0; }
  function toggleFollow(key) {
    var i = state.follows.indexOf(key);
    if (i >= 0) state.follows.splice(i, 1); else state.follows.push(key);
    store.set('follows', state.follows);
  }
  var SRC = {}; (NEWS.sources || []).forEach(function (s) { SRC[s.id] = s; });
  function rankedNews() {
    var items = NEWS.items.slice();
    items.sort(function (a, b) {
      var fa = isFollowing('src:' + a.s) ? 1 : 0, fb = isFollowing('src:' + b.s) ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return b.d.localeCompare(a.d);
    });
    return items;
  }
  function ago(iso) {
    var m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (m < 60) return m + 'm ago';
    var h = Math.round(m / 60); if (h < 48) return h + 'h ago';
    return Math.round(h / 24) + 'd ago';
  }
  var heart = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.3C19.5 16.4 12 21 12 21Z"/></svg>';
  function followBtn(key, label) {
    var on = isFollowing(key);
    return '<button type="button" class="follow" data-follow="' + esc(key) + '" aria-pressed="' + on + '" aria-label="' + (on ? t('following') : t('follow')) + ' ' + esc(label) + '">' + heart + (on ? t('following') : t('follow')) + '</button>';
  }

  /* ---------------- Views: Today ---------------- */
  function renderToday() {
    var id = state.country, cmp = state.compare && state.compare !== id ? state.compare : '';
    var wp = series('WLD', 'pop'), wl = lastIdx(wp);
    var html = '';
    html += '<div class="hero">' +
      '<div class="hero-copy">' +
        '<span class="eyebrow">' + esc(L('Economics & finance, live', 'Econ & finance, live')) + '</span>' +
        '<h1 id="todayTitle">' + t('heroTitle') + '</h1>' +
        '<p class="lede">' + esc(t('heroLede')) + '</p>' +
        '<div class="picker-line"><label for="countrySel">' + esc(t('showMe')) + '</label>' +
          '<select class="select" id="countrySel">' + countryOptions(id) + '</select></div>' +
        '<div><button type="button" class="btn" id="seminarBtn">' + esc(document.body.classList.contains('seminar') ? t('seminarOff') : t('seminarOn')) + '</button> <span class="muted" style="font-size:14px;margin-left:6px">' + esc(t('seminarHint')) + '</span></div>' +
      '</div>' +
      '<div class="hero-art"><canvas id="rosette" aria-hidden="true"></canvas>' +
        (wl >= 0 ? '<div class="stamp">' + esc(L('World population', 'World population')) + ' · ' + yearOf(wl) + '<b>' + (wp[wl] / 1e9).toFixed(3) + ' B</b></div>' : '') +
      '</div>' +
    '</div>';

    html += '<div class="tiles-head"><h2>' + esc(t('sevenTitle')) + ' ' + esc(cname(id)) + '</h2>' +
      '<div class="compare"><span class="legend-dot" style="background:var(--note)"></span>' + esc(cname(id)) +
      '<label for="compareSel" style="margin-left:8px">' + esc(t('compareWith')) + '</label>' +
      '<select class="select small" id="compareSel">' + countryOptions(cmp, true) + '</select>' +
      (cmp ? '<span class="legend-dot" style="background:var(--gold)"></span>' : '') + '</div></div>';

    html += '<div class="tiles">';
    IND.forEach(function (ind) {
      var a = series(id, ind.k), i = lastIdx(a);
      var b = cmp ? series(cmp, ind.k) : null, j = b ? lastIdx(b) : -1;
      if (ind.k === 'fx' && id === 'WLD') i = -1;
      var cc = C.countries[id] || {};
      var live = ind.k === 'fx' && i >= 0 && cc.fxNow;
      var parts = fmtParts(ind, live ? cc.fxNow.r : (i >= 0 ? a[i] : null));
      var delta = '';
      if (live) {
        var dl = (cc.fxNow.r / a[i] - 1) * 100;
        delta = '<span>' + (dl > 0.05 ? '▲' : dl < -0.05 ? '▼' : '•') + ' ' + Math.abs(dl).toFixed(1) + '%</span><span>' + t('vs') + ' ' + yearOf(i) + ' ' + esc(L('average', 'avg')) + '</span>';
      } else if (i > 0 && a[i - 1] != null) {
        var d = ind.mode === 'pp' ? a[i] - a[i - 1] : (a[i] / a[i - 1] - 1) * 100;
        var cls = ind.good === 0 || Math.abs(d) < 0.05 ? '' : ((d > 0) === (ind.good > 0) ? 'up' : 'down');
        var arrow = d > 0 ? '▲' : d < 0 ? '▼' : '•';
        delta = '<span class="' + cls + '">' + arrow + ' ' + Math.abs(d).toFixed(1) + (ind.mode === 'pp' ? ' pts' : '%') + '</span><span>' + t('vs') + ' ' + yearOf(i - 1) + '</span>';
      }
      var est = i >= 0 && isEst(id, ind.k, i);
      var pill = live ? esc(L('Today', 'Today')) : (i >= 0 ? yearOf(i) + (est ? ' ' + esc(L('est.', 'est.')) : '') : t('noData'));
      var cmpLive = b && j >= 0 && ind.k === 'fx' && C.countries[cmp] && C.countries[cmp].fxNow;
      var cmpTxt = cmp ? esc(cname(cmp)) + ': ' + (j >= 0 && !(ind.k === 'fx' && cmp === 'WLD') ? esc(fmtShort(ind, cmpLive ? C.countries[cmp].fxNow.r : b[j])) + (cmpLive ? '' : ' (' + yearOf(j) + ')') : t('noData')) : '';
      var nx = ind.k !== 'fx' && i === NOWI ? nextVal(id, ind.k) : null;
      var chk = cc.chk && cc.chk[ind.k];
      var srcName = live ? 'ExchangeRate-API' : (srcAt(id, ind.k, i) === 'i' ? 'IMF WEO' : 'World Bank');
      html += '<article class="tile' + (i < 0 ? ' na' : '') + '">' +
        '<div class="lab"><span>' + esc(L(ind.en, ind.gz)) + '</span><span class="pill' + (live ? ' note' : '') + '">' + pill + '</span></div>' +
        '<div class="val">' + esc(parts[0]) + (parts[1] ? '<small>' + esc(parts[1]) + '</small>' : '') + '</div>' +
        '<div class="cmp">' + cmpTxt + '</div>' +
        '<div class="delta">' + delta + '</div>' +
        '<div>' + (i >= 0 ? sparkline(a, b) : '<p class="what">' + esc(ind.k === 'fx' && id === 'WLD' ? L('Pick a country to see its exchange rate.', 'Pick a country for this one.') : L('No recent official figure for this country.', 'No recent data for this one.')) + '</p>') + '</div>' +
        (nx != null ? '<p class="what">' + esc(L('IMF forecast for ' + yearOf(NOWI + 1) + ': ', 'IMF forecast ' + yearOf(NOWI + 1) + ': ')) + '<b>' + esc(fmtShort(ind, nx)) + '</b></p>' : '') +
        (chk ? '<p class="what">' + esc(L('World Bank figure for ' + chk.y + ': ' + fmtShort(ind, chk.wb) + ' (IMF: ' + fmtShort(ind, chk.imf) + '). The two sources measure this differently.', 'World Bank ' + chk.y + ': ' + fmtShort(ind, chk.wb) + ' vs IMF ' + fmtShort(ind, chk.imf) + '. Sources differ.')) + '</p>' : '') +
        '<p class="what">' + esc(L(ind.what, ind.whatGz)) + '</p>' +
        '<div class="foot"><span class="muted mono" style="font-size:11.5px">' + srcName + '</span>' + (i >= 0 ? '<button type="button" data-cite="' + ind.k + '">' + esc(t('copyCite')) + '</button>' : '') + '</div>' +
      '</article>';
    });
    html += '</div><p class="source-line">' + esc(t('sourceLine')) + ' <a href="https://data.worldbank.org/country/' + esc((C.countries[id] || {}).a2 || '') + '" target="_blank" rel="noopener">' + esc(L('Open on World Bank', 'See it on World Bank')) + ' ↗</a></p>';

    html += '<div class="section hide-seminar" style="margin-top:28px"><div class="eyebrow">' + esc(t('signals')) + ' · ' + esc(cname(id)) + '</div><div class="signals">' +
      signals(id).map(function (s) { return '<div class="signal ' + s.c + '"><span class="bar"></span><p>' + s.h + '</p></div>'; }).join('') + '</div></div>';

    if (SPOT.picks && SPOT.picks.length) {
      var auto = SPOT.mode === 'auto';
      html += '<div class="section hide-seminar"><div class="section-head"><div><h2>' + esc(t('spotTitle')) + '</h2><p>' + esc(t(auto ? 'spotSubAuto' : 'spotSub')) + '</p></div><span class="pill gold">' + (auto && SPOT.updated ? esc(t('autoPicked')) + ' · ' + ago(SPOT.updated) : esc(t('weekOf')) + ' ' + esc(SPOT.week)) + '</span></div><div class="spot-grid">';
      SPOT.picks.forEach(function (p) {
        html += '<article class="spot">' +
          '<a class="row loud" href="' + esc(p.loud.u) + '" target="_blank" rel="noopener"><span class="eyebrow">' + esc(t('loud')) + '</span><h3>' + esc(p.loud.t) + '</h3><span class="src">' + esc(p.loud.src) + (p.loud.n > 1 ? ' · ' + p.loud.n + ' ' + esc(t('outlets')) : '') + ' ↗</span></a>' +
          '<a class="row quiet" href="' + esc(p.quiet.u) + '" target="_blank" rel="noopener"><span class="eyebrow">' + esc(t('quiet')) + '</span><h3>' + esc(p.quiet.t) + '</h3><span class="src">' + esc(p.quiet.src) + ' ↗</span></a>' +
          '<div class="why"><p>' + esc(L(p.why, p.whyGz)) + '</p>' + (TOPIC[p.topic] ? '<a class="link-btn" href="#topic-' + p.topic + '">' + esc(t('learnConcept')) + ': ' + esc(TOPIC[p.topic].title) + ' →</a>' : '') + '</div>' +
        '</article>';
      });
      html += '</div></div>';
    }

    var latest = rankedNews().slice(0, 7);
    var cot = TOPICS[DAY % TOPICS.length];
    var films = dailyFilms(1);
    html += '<div class="section hide-seminar split" style="align-items:start">' +
      '<div><div class="section-head"><h2>' + esc(t('latest')) + '</h2><a class="link-btn" href="#news">' + esc(t('allNews')) + ' →</a></div><div class="news-list">' +
        latest.map(function (n) { return '<a href="' + esc(n.u) + '" target="_blank" rel="noopener"><span class="src">' + esc((SRC[n.s] || {}).name || n.s) + '<br>' + ago(n.d) + '</span><b>' + esc(n.t) + '</b></a>'; }).join('') +
      '</div></div>' +
      '<div style="display:grid;gap:14px">' +
        '<div><div class="section-head"><h2>' + esc(t('conceptToday')) + '</h2></div><a class="topic-card" href="#topic-' + cot.id + '"><div class="row"><span class="pill note">' + esc(cot.area === 'econ' ? t('econ') : t('fin')) + '</span><span class="pill">' + esc(cot.level) + '</span></div><h3>' + esc(cot.title) + '</h3><p>' + esc(L(cot.tldr.en, cot.tldr.gz)) + '</p><span class="years">' + esc(cot.chain[0].y) + ' → ' + esc(cot.chain[cot.chain.length - 1].y) + ' · ' + cot.chain.length + ' ' + esc(t('steps')) + '</span></a></div>' +
        '<div><div class="section-head"><h2>' + esc(t('filmToday')) + '</h2><a class="link-btn" href="#films">' + esc(t('allFilms')) + ' →</a></div>' + filmCard(films[0]) + '</div>' +
      '</div></div>';

    $('#view-today').innerHTML = html;
    drawPosters($('#view-today'));
    startRosette();
  }

  function citation(k) {
    var ind = IND.filter(function (x) { return x.k === k; })[0], id = state.country, a = series(id, k), i = lastIdx(a);
    var d = new Date(C.updated || Date.now());
    var c = C.countries[id] || {}, a2 = c.a2 || '';
    var when = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    if (k === 'fx' && c.fxNow) return 'ExchangeRate-API (' + d.getFullYear() + '). US dollar to ' + c.fxNow.cur + ' exchange rate, ' + C.fxDate + ': ' + c.fxNow.r + ' ' + c.fxNow.cur + ' per US$. Retrieved ' + when + ', from https://www.exchangerate-api.com/';
    if (srcAt(id, k, i) === 'i' && C.codes && C.codes[k] && C.codes[k].imf) {
      var code = C.codes[k].imf;
      return 'International Monetary Fund (' + d.getFullYear() + '). World Economic Outlook: ' + IMF_LONG[k] + ' [' + code + '], ' + cname(id) + ', ' + yearOf(i) + (isEst(id, k, i) ? ' (estimate)' : '') + ': ' + fmtShort(ind, a[i]) +
        '. Retrieved ' + when + ', from https://www.imf.org/external/datamapper/' + code + '@WEO/' + (id === 'WLD' ? 'WEOWORLD' : id);
    }
    return 'World Bank (' + d.getFullYear() + '). ' + ind.long + ' [' + ind.code + '], ' + cname(id) + ', ' + yearOf(i) + ': ' + fmtShort(ind, a[i]) +
      '. World Development Indicators. Retrieved ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) +
      ', from https://data.worldbank.org/indicator/' + ind.code + (a2 && id !== 'WLD' ? '?locations=' + a2 : '');
  }

  /* ---------------- Hero rosette (guilloché) ---------------- */
  var rosetteRAF = 0, waves = [];
  var WAVE_LIFE = 3000; // ms a wave lasts
  function startRosette() {
    cancelAnimationFrame(rosetteRAF);
    var cv = $('#rosette'); if (!cv) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
    var cs = getComputedStyle(document.documentElement);
    var ink = cs.getPropertyValue('--note').trim() || '#0e5b4b', gold = cs.getPropertyValue('--gold').trim() || '#a8730f';
    var t0 = performance.now();
    function size() { var r = cv.getBoundingClientRect(); cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr); }
    size();
    // Click (or tap) anywhere on the rosette: waves ripple out through its lines from that point
    var art = cv.parentElement;
    if (!reduceMotion) {
      art.classList.add('waves');
      art.title = L('Click to make waves', 'Tap for waves');
      art.onpointerdown = function (e) {
        var r = cv.getBoundingClientRect();
        waves.push({ x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr, t: performance.now() });
        if (waves.length > 6) waves.shift();
      };
    }
    // push a point away from each wave's centre when the wave front passes it
    function displace(px, py, now, R) {
      var dx = 0, dy = 0;
      for (var i = 0; i < waves.length; i++) {
        var w = waves[i], age = (now - w.t) / 1000;
        var vx = px - w.x, vy = py - w.y, d = Math.sqrt(vx * vx + vy * vy) || 1;
        var front = age * R * 0.85, band = R * 0.16, off = d - front;
        var g = Math.exp(-(off * off) / (2 * band * band));
        var amp = R * 0.085 * Math.max(0, 1 - age * 1000 / WAVE_LIFE) * g * Math.sin(off / band * 3.2);
        dx += vx / d * amp; dy += vy / d * amp;
      }
      return [px + dx, py + dy];
    }
    function draw(now) {
      if (!cv.isConnected) return;
      var w = cv.width, h = cv.height, ph = reduceMotion ? 0 : (now - t0) / 9000;
      waves = waves.filter(function (wv) { return now - wv.t < WAVE_LIFE; });
      var active = waves.length > 0;
      ctx.clearRect(0, 0, w, h);
      var cx = w * 0.56, cy = h * 0.5, R = Math.min(w, h) * 0.44, p;
      ctx.lineWidth = 0.8 * dpr;
      for (var layer = 0; layer < 3; layer++) {
        ctx.strokeStyle = layer === 1 ? gold : ink;
        ctx.globalAlpha = layer === 1 ? 0.55 : 0.32;
        var k1 = [7, 11, 17][layer], k2 = [23, 29, 41][layer], rr = R * [1, 0.72, 0.46][layer];
        ctx.beginPath();
        for (var s = 0; s <= 1400; s++) {
          var th = s / 1400 * Math.PI * 2;
          var r = rr * (0.78 + 0.14 * Math.sin(k1 * th + ph * (layer + 1)) + 0.08 * Math.cos(k2 * th - ph));
          var x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
          if (active) { p = displace(x, y, now, R); x = p[0]; y = p[1]; }
          if (s) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = layer === 1 ? 0.12 : 0.07;
        for (var m = 0; m < 24; m++) {
          var rot = m / 24 * Math.PI * 2 + ph * 0.4, cr = Math.cos(rot), sr = Math.sin(rot);
          ctx.beginPath();
          if (!active) ctx.ellipse(cx, cy, rr * 0.98, rr * 0.36, rot, 0, Math.PI * 2);
          else {
            for (var e = 0; e <= 72; e++) {
              var a = e / 72 * Math.PI * 2, ex = rr * 0.98 * Math.cos(a), ey = rr * 0.36 * Math.sin(a);
              p = displace(cx + ex * cr - ey * sr, cy + ex * sr + ey * cr, now, R);
              if (e) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
            }
          }
          ctx.stroke();
        }
      }
      // soft rings spreading from where you clicked
      waves.forEach(function (wv) {
        var age = (now - wv.t) / WAVE_LIFE, rad = (now - wv.t) / 1000 * R * 0.85;
        ctx.globalAlpha = 0.45 * (1 - age); ctx.strokeStyle = gold; ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath(); ctx.arc(wv.x, wv.y, rad, 0, Math.PI * 2); ctx.stroke();
        if (rad > R * 0.18) { ctx.globalAlpha = 0.25 * (1 - age); ctx.strokeStyle = ink; ctx.beginPath(); ctx.arc(wv.x, wv.y, rad - R * 0.18, 0, Math.PI * 2); ctx.stroke(); }
      });
      ctx.globalAlpha = 1; ctx.lineWidth = 0.8 * dpr;
      if (!reduceMotion) rosetteRAF = requestAnimationFrame(draw);
    }
    rosetteRAF = requestAnimationFrame(draw);
    window.onresize = function () { size(); if (reduceMotion) draw(performance.now()); };
  }

  /* ---------------- Film posters ---------------- */
  function filmCard(f, compact) {
    if (!f) return '';
    var tags = f.topics.map(function (id) { return TOPIC[id] ? '<a class="tag" href="#topic-' + id + '">' + esc(TOPIC[id].title) + '</a>' : ''; }).join('<span class="muted">·</span>');
    var q = encodeURIComponent(f.t + ' ' + f.y);
    return '<article class="film"><div class="poster" data-seed="' + esc(f.t) + '"><canvas aria-hidden="true"></canvas><div class="py"><span>' + esc(f.k) + '</span><span>' + f.y + '</span></div><div class="pt">' + esc(f.t) + '</div></div>' +
      '<div class="body">' + (compact ? '' : '<p>' + esc(L(f.c, f.g)) + '</p>') + '<div class="row">' + tags + '</div>' +
      '<div class="row" style="justify-content:space-between"><a class="link-btn" href="https://www.imdb.com/find/?q=' + q + '" target="_blank" rel="noopener">IMDb ↗</a><a class="link-btn" href="https://www.justwatch.com/us/search?q=' + encodeURIComponent(f.t) + '" target="_blank" rel="noopener">' + esc(t('findFilm')) + ' ↗</a></div></div></article>';
  }
  function drawPosters(root) {
    $$('.poster', root).forEach(function (p) {
      var cv = $('canvas', p); if (!cv || cv.dataset.done) return;
      var hsh = hash(p.dataset.seed), hue = hsh % 360, dpr = Math.min(2, window.devicePixelRatio || 1);
      var r = p.getBoundingClientRect(); cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
      var ctx = cv.getContext('2d'), w = cv.width, h = cv.height;
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'hsl(' + hue + ' 42% 16%)'); g.addColorStop(1, 'hsl(' + ((hue + 50) % 360) + ' 48% 26%)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'hsl(' + ((hue + 180) % 360) + ' 60% 70%)'; ctx.lineWidth = 0.7 * dpr;
      var cx = w * (0.65 + (hsh % 20) / 100), cy = h * (0.35 + (hsh % 30) / 100), k = 5 + hsh % 9;
      for (var ring = 0; ring < 9; ring++) {
        ctx.globalAlpha = 0.09 + ring * 0.012;
        ctx.beginPath();
        var R = Math.max(w, h) * (0.18 + ring * 0.07);
        for (var s = 0; s <= 600; s++) {
          var th = s / 600 * Math.PI * 2, rr = R * (1 + 0.07 * Math.sin(k * th + ring));
          var x = cx + rr * Math.cos(th), y = cy + rr * Math.sin(th);
          if (s) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      var shade = ctx.createLinearGradient(0, h * 0.4, 0, h); shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(0,0,0,.45)');
      ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h);
      cv.dataset.done = '1';
    });
  }

  /* ---------------- Views: Learn ---------------- */
  function renderLearn() {
    var html = '<div class="section-head" style="margin-top:8px"><div><span class="eyebrow">' + esc(t('learnTitle')) + '</span><h1 style="font-size:clamp(34px,5vw,56px);font-weight:800;letter-spacing:-.035em;margin-top:8px">' + esc(L('Economics & finance, one idea at a time', 'Econ & finance, one idea at a time')) + '</h1><p>' + esc(t('learnSub')) + '</p></div></div>';
    [['econ', t('econ')], ['fin', t('fin')]].forEach(function (a) {
      var list = TOPICS.filter(function (x) { return x.area === a[0]; });
      html += '<div class="area"><div class="area-head"><h2>' + esc(a[1]) + '</h2></div><div class="topic-grid">';
      list.forEach(function (x) {
        html += '<a class="topic-card" href="#topic-' + x.id + '"><div class="row"><span class="pill">' + esc(x.level) + '</span>' + (x.tool ? '<span class="pill gold">' + esc(L('Interactive', 'Interactive')) + '</span>' : '') + '</div><h3>' + esc(x.title) + '</h3><p>' + esc(L(x.tldr.en, x.tldr.gz)) + '</p><span class="years">' + esc(x.chain[0].y) + ' → ' + esc(x.chain[x.chain.length - 1].y) + ' · ' + x.papers.length + ' ' + esc(L('papers', 'papers')) + '</span></a>';
      });
      html += '</div></div>';
    });
    $('#view-learn').innerHTML = html;
  }

  /* ---------------- Views: Topic ---------------- */
  function ytSearch(channel, q) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(channel + ' ' + q); }
  function renderTopic(id) {
    var x = TOPIC[id]; if (!x) { location.hash = '#learn'; return; }
    var films = CT.films.filter(function (f) { return f.topics.indexOf(id) >= 0; });
    var html = '<div class="topic-hero"><div class="crumbs"><a href="#learn">' + esc(t('learnTitle')) + '</a><span>/</span><span>' + esc(x.area === 'econ' ? t('econ') : t('fin')) + '</span></div>' +
      '<h1>' + esc(x.title) + '</h1><div class="chips"><span class="pill">' + esc(x.level) + '</span><span class="pill note">' + esc(x.area === 'econ' ? t('econ') : t('fin')) + '</span></div>' +
      '<p class="tldr">' + esc(L(x.tldr.en, x.tldr.gz)) + '</p></div>';

    html += '<div class="section" style="margin-top:32px"><div class="section-head"><h2>' + esc(t('keyIdeas')) + '</h2></div><div class="cards3">' +
      x.cards.map(function (c) { return '<div class="concept"><h3>' + esc(c.h) + '</h3><p>' + esc(L(c.en, c.gz)) + '</p></div>'; }).join('') + '</div></div>';

    if (x.tool) html += '<div class="section"><div class="section-head"><h2>' + esc(t('tryIt')) + '</h2></div><div id="toolMount"></div></div>';

    html += '<div class="section"><div class="section-head"><div><h2>' + esc(t('chainTitle')) + '</h2><p>' + esc(t('chainSub')) + '</p></div></div><div class="chain" id="chain"></div></div>';

    html += '<div class="section"><div class="section-head"><div><h2>' + esc(t('papersTitle')) + '</h2><p>' + esc(t('papersSub')) + '</p></div></div><div class="papers">' +
      x.papers.map(function (p) { return '<a class="paper" href="' + esc(p.url) + '" target="_blank" rel="noopener"><span class="py">' + p.y + '</span><span><span class="pt">' + esc(p.t) + '</span><br><span class="pa">' + esc(p.a) + ' · <span class="pj">' + esc(p.j) + '</span></span></span><span class="pill gold">Q1</span></a>'; }).join('') +
      '</div><p class="source-line"><a href="https://scholar.google.com/scholar?q=' + encodeURIComponent(x.title) + '" target="_blank" rel="noopener">' + esc(L('Find more on Google Scholar', 'More papers on Google Scholar')) + ' ↗</a></p></div>';

    html += '<div class="section split"><div class="panel"><h3>' + esc(t('watch')) + '</h3><p class="muted" style="font-size:14px">' + esc(t('watchSub')) + '</p><div class="vlist">' +
      x.videos.map(function (v) { return '<a href="' + ytSearch(v[0], v[1]) + '" target="_blank" rel="noopener"><span>' + esc(v[0]) + '</span><span>' + esc(v[1]) + ' ↗</span></a>'; }).join('') + '</div></div>' +
      '<div class="panel"><h3>' + esc(t('onScreen')) + '</h3>' + (films.length ? '<div class="vlist">' + films.map(function (f) { return '<a href="https://www.imdb.com/find/?q=' + encodeURIComponent(f.t + ' ' + f.y) + '" target="_blank" rel="noopener"><span>' + esc(f.t) + ' <span class="muted">(' + f.y + ')</span></span><span>IMDb ↗</span></a>'; }).join('') + '</div>' : '<p class="muted">' + esc(L('No films linked yet.', 'No movies for this one yet.')) + '</p>') + '</div></div>';

    html += '<div class="section"><div class="section-head"><h2>' + esc(t('quiz')) + '</h2><span class="score" id="score"></span></div><div class="quiz" id="quiz">' +
      x.quiz.map(function (q, qi) { return '<div class="q" data-q="' + qi + '"><p class="qq">' + (qi + 1) + '. ' + esc(q.q) + '</p><div class="opts">' + q.o.map(function (o, oi) { return '<button type="button" class="opt" data-o="' + oi + '">' + esc(o) + '</button>'; }).join('') + '</div><p class="why" hidden></p></div>'; }).join('') + '</div></div>';

    var v = $('#view-topic'); v.innerHTML = html;
    renderChain(x);
    if (x.tool) TOOLS[x.tool]($('#toolMount'));
    var answered = 0, right = 0;
    $$('.q', v).forEach(function (qel) {
      var q = x.quiz[+qel.dataset.q];
      $$('.opt', qel).forEach(function (b) {
        b.addEventListener('click', function () {
          var oi = +b.dataset.o;
          $$('.opt', qel).forEach(function (o) { o.disabled = true; if (+o.dataset.o === q.a) o.classList.add('right'); });
          if (oi !== q.a) b.classList.add('wrong'); else right++;
          answered++;
          var w = $('.why', qel); w.textContent = (oi === q.a ? L('Correct. ', 'Slay. ') : L('Not quite. ', 'Not quite. ')) + q.why; w.hidden = false;
          $('#score').textContent = t('score') + ': ' + right + ' / ' + answered;
          emit('ih:quiz', { correct: oi === q.a, answered: answered, right: right, total: x.quiz.length, title: x.title, id: x.id });
        });
      });
    });
  }

  function renderChain(x) {
    var el = $('#chain'); if (!el) return;
    var idx = state.chainIdx[x.id] || 0, n = x.chain.length;
    var track = '<div class="chain-track" role="tablist" aria-label="' + esc(t('chainTitle')) + '">' + x.chain.map(function (s, i) {
      return '<button type="button" role="tab" class="chain-step' + (i < idx ? ' done' : '') + '" aria-selected="' + (i === idx) + '" tabindex="' + (i === idx ? 0 : -1) + '" data-i="' + i + '"><span class="dot"></span><span class="yr">' + esc(s.y) + '</span><span class="hd">' + esc(s.h) + '</span></button>';
    }).join('') + '</div>';
    var s = x.chain[idx];
    var detail = '<div class="chain-detail" role="tabpanel"><div class="big">' + esc(s.y) + '</div><span class="eyebrow">' + (idx + 1) + ' / ' + n + '</span><h3>' + esc(s.h) + '</h3><div><p>' + esc(s.t) + '</p><div class="nav"><button type="button" class="btn" data-step="-1"' + (idx === 0 ? ' disabled' : '') + '>← ' + esc(t('prev')) + '</button><button type="button" class="btn primary" data-step="1"' + (idx === n - 1 ? ' disabled' : '') + '>' + esc(t('next')) + ' →</button></div></div></div>';
    el.innerHTML = track + detail;
    function go(i, focus) {
      state.chainIdx[x.id] = Math.max(0, Math.min(n - 1, i)); renderChain(x);
      emit('ih:chain', { idx: state.chainIdx[x.id], n: n, id: x.id, title: x.title, first: x.chain[0].y, last: x.chain[n - 1].y });
      var cur = $('.chain-step[aria-selected="true"]', el);
      if (cur) { cur.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); if (focus) cur.focus(); }
    }
    $$('.chain-step', el).forEach(function (b) {
      b.addEventListener('click', function () { go(+b.dataset.i, true); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1, true); }
      });
    });
    $$('[data-step]', el).forEach(function (b) { b.addEventListener('click', function () { go(idx + +b.dataset.step, false); }); });
  }

  /* ---------------- Interactive tools ---------------- */
  function svgAxes(W, H, m, xl, yl) {
    return '<line class="axis" x1="' + m + '" y1="' + (H - m) + '" x2="' + (W - 8) + '" y2="' + (H - m) + '"/>' +
      '<line class="axis" x1="' + m + '" y1="8" x2="' + m + '" y2="' + (H - m) + '"/>' +
      '<text x="' + ((m + W) / 2) + '" y="' + (H - m + 18) + '" text-anchor="middle">' + esc(xl) + '</text>' +
      '<text x="' + (m + 6) + '" y="14">' + esc(yl) + '</text>';
  }
  var TOOLS = {
    sd: function (mount) {
      mount.innerHTML = '<div class="tool"><div class="controls">' +
        '<label for="dShift"><span class="lrow">' + esc(L('Buyer demand (tastes, income)', 'How much people want it')) + '<span class="v" id="dV">0</span></span><input type="range" id="dShift" min="-30" max="30" value="0"></label>' +
        '<label for="sShift"><span class="lrow">' + esc(L('Production costs', 'Cost to make it')) + '<span class="v" id="sV">0</span></span><input type="range" id="sShift" min="-30" max="30" value="0"></label>' +
        '<div class="readout" id="sdOut"></div><p class="muted" style="font-size:14px">' + esc(L('Raise demand and both price and quantity rise. Raise costs and price rises while quantity falls. The faint lines show where you started.', 'More hype = higher price and more sold. Higher costs = higher price, less sold. Faint lines = where you started.')) + '</p></div><div id="sdChart"></div></div>';
      var W = 420, H = 300, m = 34;
      var X = function (q) { return m + q / 100 * (W - m - 12); }, Y = function (p) { return H - m - p / 100 * (H - m - 12); };
      function eq(ds, ss) { var q = (85 + ds - 15 - ss) / 1.3; return { q: q, p: 15 + ss + 0.6 * q }; }
      function upd() {
        var ds = +$('#dShift').value, ss = +$('#sShift').value, e = eq(ds, ss), e0 = eq(0, 0);
        $('#dV').textContent = (ds > 0 ? '+' : '') + ds; $('#sV').textContent = (ss > 0 ? '+' : '') + ss;
        var line = function (f, cls, st) { var pts = []; for (var q = 0; q <= 100; q += 5) { var p = f(q); if (p >= 0 && p <= 100) pts.push(X(q).toFixed(1) + ',' + Y(p).toFixed(1)); } return '<polyline points="' + pts.join(' ') + '" style="fill:none;stroke:' + cls + ';' + (st || '') + '" stroke-width="2.4"/>'; };
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Supply and demand diagram">' + svgAxes(W, H, m, L('Quantity', 'Quantity'), L('Price', 'Price'));
        s += line(function (q) { return 85 - 0.7 * q; }, 'var(--line)', 'stroke-dasharray:4 4') + line(function (q) { return 15 + 0.6 * q; }, 'var(--line)', 'stroke-dasharray:4 4');
        s += line(function (q) { return 85 + ds - 0.7 * q; }, 'var(--note)') + line(function (q) { return 15 + ss + 0.6 * q; }, 'var(--gold)');
        s += '<line class="gridl" x1="' + m + '" x2="' + X(e.q) + '" y1="' + Y(e.p) + '" y2="' + Y(e.p) + '"/><line class="gridl" x1="' + X(e.q) + '" x2="' + X(e.q) + '" y1="' + Y(e.p) + '" y2="' + (H - m) + '"/>';
        s += '<circle cx="' + X(e.q) + '" cy="' + Y(e.p) + '" r="6" style="fill:var(--surface);stroke:var(--ink)" stroke-width="2"/>';
        s += '<text x="' + X(8) + '" y="' + Y(85 + ds - 0.7 * 8 + 4) + '" style="fill:var(--note)">' + esc(L('Demand', 'Demand')) + '</text><text x="' + X(84) + '" y="' + Y(15 + ss + 0.6 * 84 + 4) + '" style="fill:var(--gold)">' + esc(L('Supply', 'Supply')) + '</text></svg>';
        $('#sdChart').innerHTML = s;
        var dp = e.p - e0.p, dq = e.q - e0.q;
        $('#sdOut').innerHTML = esc(L('Price', 'Price')) + ' ' + e.p.toFixed(1) + ' · ' + esc(L('Quantity', 'Qty')) + ' ' + e.q.toFixed(1) + '<small>' + (Math.abs(dp) < 0.05 && Math.abs(dq) < 0.05 ? esc(L('Starting equilibrium', 'Starting point')) : esc(L('Price', 'Price')) + ' ' + (dp >= 0 ? '+' : '') + dp.toFixed(1) + ', ' + esc(L('quantity', 'qty')) + ' ' + (dq >= 0 ? '+' : '') + dq.toFixed(1)) + '</small>';
      }
      $('#dShift').addEventListener('input', upd); $('#sShift').addEventListener('input', upd); upd();
    },
    compound: function (mount) {
      mount.innerHTML = '<div class="tool"><div class="controls">' +
        '<label for="cMonthly"><span class="lrow">' + esc(L('Saved each month', 'Saved per month')) + '<span class="v">' + esc(L('any currency', 'any currency')) + '</span></span><input type="number" id="cMonthly" min="0" step="10" value="100"></label>' +
        '<label for="cRate"><span class="lrow">' + esc(L('Yearly return', 'Yearly return')) + '<span class="v" id="cRateV"></span></span><input type="range" id="cRate" min="0" max="15" step="0.5" value="7"></label>' +
        '<label for="cYears"><span class="lrow">' + esc(L('Years', 'Years')) + '<span class="v" id="cYearsV"></span></span><input type="range" id="cYears" min="1" max="45" value="30"></label>' +
        '<div class="readout" id="cOut"></div></div><div id="cChart"></div></div>';
      var W = 420, H = 300, m = 34;
      function upd() {
        var pm = Math.max(0, +$('#cMonthly').value || 0), r = +$('#cRate').value / 100, n = +$('#cYears').value;
        $('#cRateV').textContent = (r * 100).toFixed(1) + '%'; $('#cYearsV').textContent = n;
        var bal = 0, pts = [], mr = Math.pow(1 + r, 1 / 12) - 1;
        for (var mo = 1; mo <= n * 12; mo++) { bal = bal * (1 + mr) + pm; if (mo % 12 === 0) pts.push({ y: mo / 12, b: bal, c: pm * mo }); }
        var max = pts[pts.length - 1].b || 1;
        var X = function (y) { return m + (y / n) * (W - m - 12); }, Y = function (v) { return H - m - (v / max) * (H - m - 16); };
        var area = function (key) { return 'M' + X(0) + ' ' + Y(0) + ' ' + pts.map(function (p) { return 'L' + X(p.y).toFixed(1) + ' ' + Y(p[key]).toFixed(1); }).join(' ') + ' L' + X(n) + ' ' + Y(0) + ' Z'; };
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Compound growth chart">' + svgAxes(W, H, m, L('Years', 'Years'), '');
        s += '<path d="' + area('b') + '" style="fill:var(--gold);opacity:.35"/><path d="' + area('c') + '" style="fill:var(--note);opacity:.55"/>';
        s += '<text x="' + (m + 8) + '" y="24" style="fill:var(--gold)">■ ' + esc(L('Interest earned', 'Free money (interest)')) + '</text><text x="' + (m + 8) + '" y="40" style="fill:var(--note)">■ ' + esc(L('What you put in', 'What you put in')) + '</text>';
        s += '<text x="' + X(n) + '" y="' + (H - m + 18) + '" text-anchor="end">' + n + '</text></svg>';
        $('#cChart').innerHTML = s;
        var last = pts[pts.length - 1], f = function (v) { return Math.round(v).toLocaleString('en-US'); };
        $('#cOut').innerHTML = f(last.b) + '<small>' + esc(L('You put in', 'You put in')) + ' ' + f(last.c) + '; ' + esc(L('compounding added', 'compounding added')) + ' ' + f(last.b - last.c) + ' (' + (last.b > 0 ? Math.round((last.b - last.c) / last.b * 100) : 0) + '% ' + esc(L('of the total', 'of the total')) + ').</small>';
      }
      ['cMonthly', 'cRate', 'cYears'].forEach(function (k) { $('#' + k).addEventListener('input', upd); }); upd();
    },
    inflation: function (mount) {
      mount.innerHTML = '<div class="tool"><div class="controls">' +
        '<label for="iCountry">' + esc(L('Country', 'Country')) + '<select class="select small" id="iCountry">' + countryOptions(state.country) + '</select></label>' +
        '<label for="iYear"><span class="lrow">' + esc(L('Starting year', 'Starting year')) + '<span class="v" id="iYearV"></span></span><input type="range" id="iYear" min="2000" max="2024" value="2015"></label>' +
        '<div class="readout" id="iOut"></div><p class="muted" style="font-size:13px">' + esc(L('Uses real yearly consumer price inflation from the IMF and World Bank. This year is an IMF estimate.', 'Real inflation data from the IMF and World Bank.')) + '</p></div><div id="iChart"></div></div>';
      var W = 420, H = 300, m = 40;
      function upd() {
        var id = $('#iCountry').value, a = series(id, 'infl'), li = lastIdx(a), y0 = +$('#iYear').value;
        var s0 = y0 - C.from;
        $('#iYearV').textContent = y0;
        if (li < 1 || s0 >= li) { $('#iOut').innerHTML = esc(t('noData')); $('#iChart').innerHTML = ''; return; }
        var lvl = 100, pts = [{ y: y0, v: 100 }], gaps = 0;
        for (var i = s0 + 1; i <= li; i++) { if (a[i] == null) { gaps++; } else lvl *= 1 + a[i] / 100; pts.push({ y: yearOf(i), v: lvl }); }
        var max = Math.max.apply(null, pts.map(function (p) { return p.v; }));
        var X = function (y) { return m + (y - y0) / (yearOf(li) - y0) * (W - m - 12); }, Y = function (v) { return H - m - (v / max) * (H - m - 16); };
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Price level chart">' + svgAxes(W, H, m, '', L('Price of a basket', 'Basket price'));
        s += '<line class="gridl" x1="' + m + '" x2="' + (W - 12) + '" y1="' + Y(100) + '" y2="' + Y(100) + '"/><text x="' + (m - 6) + '" y="' + (Y(100) + 4) + '" text-anchor="end">100</text>';
        s += '<path d="M' + pts.map(function (p) { return X(p.y).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' L') + '" style="fill:none;stroke:var(--down)" stroke-width="2.4"/>';
        s += '<text x="' + X(y0) + '" y="' + (H - m + 18) + '">' + y0 + '</text><text x="' + X(yearOf(li)) + '" y="' + (H - m + 18) + '" text-anchor="end">' + yearOf(li) + '</text>';
        s += '<text x="' + (X(yearOf(li)) - 4) + '" y="' + (Y(lvl) - 8) + '" text-anchor="end" style="fill:var(--ink)">' + Math.round(lvl).toLocaleString('en-US') + '</text></svg>';
        $('#iChart').innerHTML = s;
        var cur = CUR[id] || L('units', 'units');
        $('#iOut').innerHTML = '100 → ' + Math.round(100 * 100 / lvl) + '<small>' + esc(L('What 100 ' + cur + ' bought in ' + y0 + ' costs ' + Math.round(lvl).toLocaleString('en-US') + ' in ' + yearOf(li) + '. Put the other way, 100 in ' + y0 + ' buys only about ' + Math.round(100 * 100 / lvl) + ' worth today.', 'What cost 100 ' + cur + ' in ' + y0 + ' costs ' + Math.round(lvl).toLocaleString('en-US') + ' in ' + yearOf(li) + '. Your 100 got nerfed to ' + Math.round(100 * 100 / lvl) + '.')) + (gaps ? ' ' + esc(L('(Some years have no data and are skipped.)', '(Some years missing.)')) : '') + '</small>';
      }
      $('#iCountry').addEventListener('change', upd); $('#iYear').addEventListener('input', upd); upd();
    },
    diversify: function (mount) {
      mount.innerHTML = '<div class="tool"><div class="controls">' +
        '<label for="dN"><span class="lrow">' + esc(L('Number of stocks', 'How many stocks')) + '<span class="v" id="dNV"></span></span><input type="range" id="dN" min="1" max="30" value="1"></label>' +
        '<label for="dRho"><span class="lrow">' + esc(L('How closely they move together', 'How much they move together')) + '<span class="v" id="dRhoV"></span></span><input type="range" id="dRho" min="0" max="0.9" step="0.05" value="0.3"></label>' +
        '<div class="readout" id="dOut"></div><p class="muted" style="font-size:13px">' + esc(L('Each stock swings 30% a year on its own. The dashed line is market risk you can never diversify away.', 'Each stock swings 30% a year. Dashed line = risk you can never escape.')) + '</p></div><div id="dChart"></div></div>';
      var W = 420, H = 300, m = 34, sig = 30;
      function risk(n, rho) { return Math.sqrt(sig * sig / n + (1 - 1 / n) * rho * sig * sig); }
      function upd() {
        var n = +$('#dN').value, rho = +$('#dRho').value;
        $('#dNV').textContent = n; $('#dRhoV').textContent = rho.toFixed(2);
        var X = function (k) { return m + (k - 1) / 29 * (W - m - 12); }, Y = function (v) { return H - m - v / 32 * (H - m - 16); };
        var pts = []; for (var k = 1; k <= 30; k++) pts.push(X(k).toFixed(1) + ',' + Y(risk(k, rho)).toFixed(1));
        var floor = Math.sqrt(rho) * sig;
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Diversification chart">' + svgAxes(W, H, m, L('Stocks held', 'Stocks'), L('Risk %', 'Risk %'));
        s += '<line x1="' + m + '" x2="' + (W - 12) + '" y1="' + Y(floor) + '" y2="' + Y(floor) + '" style="stroke:var(--gold)" stroke-dasharray="5 4" stroke-width="1.5"/>';
        s += '<polyline points="' + pts.join(' ') + '" style="fill:none;stroke:var(--note)" stroke-width="2.4"/>';
        s += '<circle cx="' + X(n) + '" cy="' + Y(risk(n, rho)) + '" r="6" style="fill:var(--surface);stroke:var(--ink)" stroke-width="2"/>';
        s += '<text x="' + m + '" y="' + (Y(sig) + 4) + '" text-anchor="end" dx="-6">30</text><text x="' + (m - 6) + '" y="' + (Y(floor) + 4) + '" text-anchor="end" style="fill:var(--gold)">' + floor.toFixed(0) + '</text>';
        s += '<text x="' + X(1) + '" y="' + (H - m + 18) + '">1</text><text x="' + X(30) + '" y="' + (H - m + 18) + '" text-anchor="end">30</text></svg>';
        $('#dChart').innerHTML = s;
        var r = risk(n, rho);
        $('#dOut').innerHTML = r.toFixed(1) + '% ' + esc(L('risk', 'risk')) + '<small>' + esc(L('Down from 30% with one stock. Same expected return, ' + Math.round((1 - r / sig) * 100) + '% less risk.', 'From 30% with one stock. Same returns, ' + Math.round((1 - r / sig) * 100) + '% less stress.')) + '</small>';
      }
      $('#dN').addEventListener('input', upd); $('#dRho').addEventListener('input', upd); upd();
    }
  };

  /* ---------------- Views: News ---------------- */
  function renderNews() {
    var srcs = NEWS.sources || [];
    var nFollow = srcs.filter(function (s) { return isFollowing('src:' + s.id); }).length;
    var html = '<div class="section-head" style="margin-top:8px"><div><h1 style="font-size:clamp(34px,5vw,56px);font-weight:800;letter-spacing:-.035em">' + esc(t('newsTitle')) + '</h1><p>' + esc(t('newsSub')) + '</p></div><span class="pill">' + esc(t('updated')) + ' ' + (NEWS.updated ? ago(NEWS.updated) : '') + '</span></div>';
    html += '<div class="news-bar"><label class="sr" for="newsQ">' + esc(t('newsSearch')) + '</label><input class="input" id="newsQ" type="search" placeholder="' + esc(t('newsSearch')) + '" value="' + esc(state.newsQuery) + '">' +
      '<div class="chips" role="group" aria-label="Filter">' +
      [['all', t('fAll')], ['following', t('fFollowing') + ' (' + nFollow + ')'], ['global', t('fGlobal')], ['uz', t('fUz')], ['official', t('fOfficial')]].map(function (f) { return '<button type="button" class="chip" data-nf="' + f[0] + '" aria-pressed="' + (state.newsFilter === f[0]) + '">' + esc(f[1]) + '</button>'; }).join('') +
      '</div><div class="chips" aria-label="' + esc(t('sources')) + '">' + srcs.map(function (s) { return followBtn('src:' + s.id, s.name).replace(heart + (isFollowing('src:' + s.id) ? t('following') : t('follow')), heart + esc(s.name)); }).join('') + '</div></div>';
    var q = state.newsQuery.trim().toLowerCase();
    var weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    var items = rankedNews().filter(function (n) {
      if (n.d < weekAgo) return false; // the News page shows the last 7 days; older headlines stay as an archive for related links
      var s = SRC[n.s] || {};
      if (state.newsFilter === 'following' && !isFollowing('src:' + n.s)) return false;
      if (state.newsFilter === 'global' && s.region !== 'global') return false;
      if (state.newsFilter === 'uz' && s.region !== 'uz') return false;
      if (state.newsFilter === 'official' && s.region !== 'official') return false;
      if (q && (n.t + ' ' + (s.name || '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    html += items.length ? '<div class="news-grid">' + items.map(newsCard).join('') + '</div>' : '<div class="empty">' + esc(t('noNews')) + '</div>';
    $('#view-news').innerHTML = html;
    bindImages($('#view-news'));
    var qi = $('#newsQ');
    qi.addEventListener('input', function () { state.newsQuery = qi.value; var pos = qi.selectionStart; renderNews(); var n = $('#newsQ'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { /* ignore */ } });
  }
  function newsCard(n) {
    var s = SRC[n.s] || { name: n.s };
    var mono = s.name.replace(/^The /, '').split(/[\s.]/)[0].slice(0, 3);
    return '<article class="news-card"><a class="cover" href="' + esc(n.u) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><span class="ph">' + esc(mono) + '</span>' +
      (n.img ? '<img src="' + esc(n.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' : '') + '</a>' +
      '<div class="body"><div class="meta"><span>' + esc(s.name) + (s.lang === 'ru' ? ' · RU' : '') + ' · ' + ago(n.d) + '</span>' + followBtn('src:' + n.s, s.name) + '</div>' +
      (s.label ? '<span class="pill' + (s.label === 'official' ? ' note' : s.label === 'state' ? ' gold' : '') + '" style="justify-self:start">' + esc(t('lab_' + s.label)) + '</span>' : '') +
      '<h3><a href="' + esc(n.u) + '" target="_blank" rel="noopener">' + esc(n.t) + '</a></h3></div></article>';
  }
  function bindImages(root) {
    $$('img', root).forEach(function (img) {
      img.addEventListener('error', function () { img.remove(); });
      if (img.complete && img.naturalWidth === 0) img.remove();
    });
  }

  /* ---------------- Views: Films ---------------- */
  function renderFilms() {
    var today = dailyFilms(3);
    var html = '<div class="section-head" style="margin-top:8px"><div><h1 style="font-size:clamp(34px,5vw,56px);font-weight:800;letter-spacing:-.035em">' + esc(t('filmsTitle')) + '</h1><p>' + esc(t('filmsSub')) + '</p></div><button type="button" class="btn" id="shuffleBtn">↻ ' + esc(t('shuffle')) + '</button></div>';
    html += '<div class="films-today">' + today.map(function (f) { return filmCard(f); }).join('') + '</div>';
    var used = {}; CT.films.forEach(function (f) { f.topics.forEach(function (x) { used[x] = 1; }); });
    html += '<div class="section"><div class="section-head"><h2>' + esc(t('allFilms')) + '</h2></div><div class="chips" style="margin-bottom:16px"><button type="button" class="chip" data-ft="all" aria-pressed="' + (state.filmTopic === 'all') + '">' + esc(t('allTopics')) + '</button>' +
      TOPICS.filter(function (x) { return used[x.id]; }).map(function (x) { return '<button type="button" class="chip" data-ft="' + x.id + '" aria-pressed="' + (state.filmTopic === x.id) + '">' + esc(x.title) + '</button>'; }).join('') + '</div>';
    var list = CT.films.filter(function (f) { return state.filmTopic === 'all' || f.topics.indexOf(state.filmTopic) >= 0; });
    html += '<div class="films-all">' + list.map(function (f) { return filmCard(f); }).join('') + '</div></div>';
    $('#view-films').innerHTML = html;
    drawPosters($('#view-films'));
  }

  /* ---------------- Views: Library ---------------- */
  function renderLibrary() {
    var R = CT.resources;
    function block(title, items, extra) {
      return '<div class="section"><div class="section-head"><h2>' + esc(title) + '</h2></div><div class="lib">' + items.map(function (r) {
        return '<a href="' + esc(r.u) + '" target="_blank" rel="noopener"><b>' + esc(r.n) + '<span>↗</span></b><span>' + esc(r.d) + '</span></a>';
      }).join('') + '</div>' + (extra || '') + '</div>';
    }
    var html = '<div class="section-head" style="margin-top:8px"><div><h1 style="font-size:clamp(34px,5vw,56px);font-weight:800;letter-spacing:-.035em">' + esc(t('libTitle')) + '</h1><p>' + esc(t('libSub')) + '</p></div></div>';
    html += block(t('research'), R.research, '<p class="tip"><b>Q1?</b> ' + esc(L('Q1 means a journal ranks in the top 25% of its field. Check any journal on SCImago before citing it.', 'Q1 = top 25% of journals in the field. Check on SCImago before you cite.')) + '</p>');
    html += block(t('data'), R.data);
    html += block(t('ai'), R.ai, '<p class="tip">' + t('aiTip') + '</p>');
    html += '<div class="section"><div class="section-head"><h2>' + esc(t('youtube')) + '</h2></div><div class="lib">' + R.youtube.map(function (y) {
      return '<a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(y.n) + '" target="_blank" rel="noopener"><b>' + esc(y.n) + '<span>↗</span></b><span>' + esc(y.d) + '</span></a>';
    }).join('') + '</div></div>';
    html += '<div class="section"><div class="section-head"><div><h2>' + esc(t('creators')) + '</h2><p>' + esc(L('Short-form finance from creators students actually watch. Follow the ones you like.', 'The finance creators on your FYP. Follow your faves.')) + '</p></div></div><div class="lib">' + R.creators.map(function (c) {
      return '<div class="creator"><b>' + esc(c.n) + followBtn('cr:' + c.h, c.n) + '</b><span class="mono" style="font-size:12.5px">@' + esc(c.h) + '</span><span>' + esc(c.d) + '</span><div class="links"><a href="https://www.tiktok.com/search?q=' + encodeURIComponent(c.h) + '" target="_blank" rel="noopener">TikTok ↗</a><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(c.n) + '" target="_blank" rel="noopener">YouTube ↗</a><a href="https://www.instagram.com/explore/search/keyword/?q=' + encodeURIComponent(c.h) + '" target="_blank" rel="noopener">Instagram ↗</a></div></div>';
    }).join('') + '</div><p class="spot-note muted">' + esc(L('Creators share opinions, not financial advice. Check claims against the data and research above.', "Creators = opinions, not financial advice. Fact-check with the data above.")) + '</p></div>';
    $('#view-library').innerHTML = html;
  }

  /* ---------------- Search ---------------- */
  var searchIndex = null;
  function buildIndex() {
    var ix = [];
    TOPICS.forEach(function (x) {
      ix.push({ k: L('Topic', 'Topic'), h: x.title, s: x.tldr.en, href: '#topic-' + x.id, txt: x.title + ' ' + x.tldr.en });
      x.cards.forEach(function (c) { ix.push({ k: L('Concept', 'Concept'), h: c.h, s: x.title, href: '#topic-' + x.id, txt: c.h + ' ' + c.en }); });
      x.chain.forEach(function (c, i) { ix.push({ k: c.y, h: c.h, s: x.title + ' · ' + L('history', 'backstory'), href: '#topic-' + x.id, chain: [x.id, i], txt: c.y + ' ' + c.h + ' ' + c.t }); });
      x.papers.forEach(function (p) { ix.push({ k: L('Paper', 'Paper'), h: p.t, s: p.a + ' (' + p.y + ') · ' + p.j, href: p.url, ext: true, txt: p.t + ' ' + p.a + ' ' + p.y + ' ' + p.j }); });
    });
    CT.films.forEach(function (f) { ix.push({ k: L('Film', 'Movie'), h: f.t + ' (' + f.y + ')', s: f.c, href: '#films', txt: f.t + ' ' + f.c }); });
    COUNTRY_IDS.forEach(function (id) { ix.push({ k: L('Country', 'Country'), h: cname(id), s: (C.countries[id].r || '') + (C.countries[id].c ? ' · ' + C.countries[id].c : ''), country: id, href: '#today', txt: cname(id) + ' ' + id + ' ' + (C.countries[id].c || '') }); });
    NEWS.items.forEach(function (n) { ix.push({ k: L('News', 'News'), h: n.t, s: (SRC[n.s] || {}).name, href: n.u, ext: true, txt: n.t }); });
    return ix;
  }
  var sActive = 0, sResults = [];
  function runSearch(q) {
    if (!searchIndex) searchIndex = buildIndex();
    q = q.trim().toLowerCase();
    var box = $('#searchResults');
    if (!q) { sResults = searchIndex.filter(function (r) { return r.k === L('Topic', 'Topic'); }).slice(0, 8); }
    else {
      var words = q.split(/\s+/);
      sResults = searchIndex.map(function (r) {
        var tx = r.txt.toLowerCase(), hh = r.h.toLowerCase(), sc = 0;
        for (var i = 0; i < words.length; i++) { if (tx.indexOf(words[i]) < 0) return null; if (hh.indexOf(words[i]) === 0) sc += 3; else if (hh.indexOf(words[i]) >= 0) sc += 2; else sc += 1; }
        if (r.country) sc += 1;
        return { r: r, sc: sc };
      }).filter(Boolean).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 14).map(function (x) { return x.r; });
    }
    sActive = 0;
    box.innerHTML = sResults.length ? sResults.map(function (r, i) {
      return '<a href="' + esc(r.href) + '" data-i="' + i + '"' + (r.ext ? ' target="_blank" rel="noopener"' : '') + (i === 0 ? ' class="active"' : '') + '><span class="k">' + esc(r.k) + '</span><span>' + esc(r.h) + '<span class="s">' + esc(r.s || '') + '</span></span></a>';
    }).join('') : '<p class="muted" style="padding:16px">' + esc(L('Nothing found. Try a country, a concept like “inflation”, or an author like “Akerlof”.', 'Nothing. Try a country, “inflation”, or “Akerlof”.')) + '</p>';
    $$('a', box).forEach(function (a) { a.addEventListener('click', function () { pickResult(sResults[+a.dataset.i]); }); });
  }
  function pickResult(r) {
    if (!r) return;
    if (r.country) { setCountry(r.country); }
    if (r.chain) state.chainIdx[r.chain[0]] = r.chain[1];
    closeSearch();
  }
  function openSearch() { var o = $('#searchOverlay'); o.hidden = false; var i = $('#searchInput'); i.value = ''; runSearch(''); i.focus(); }
  function closeSearch() { $('#searchOverlay').hidden = true; }

  /* ---------------- Router ---------------- */
  var VIEWS = ['today', 'learn', 'topic', 'news', 'films', 'library'];
  function route() {
    var h = (location.hash || '#today').slice(1);
    var view = h.indexOf('topic-') === 0 ? 'topic' : (VIEWS.indexOf(h) >= 0 ? h : 'today');
    VIEWS.forEach(function (v) { $('#view-' + v).hidden = v !== view; });
    $$('.tabs a').forEach(function (a) {
      var on = a.dataset.route === view || (view === 'topic' && a.dataset.route === 'learn');
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (view === 'today') renderToday();
    else { cancelAnimationFrame(rosetteRAF); }
    if (view === 'learn') renderLearn();
    if (view === 'topic') renderTopic(h.slice(6));
    if (view === 'news') renderNews();
    if (view === 'films') renderFilms();
    if (view === 'library') renderLibrary();
    var title = { today: 'Invisible Hand', learn: 'Learn · Invisible Hand', news: 'News · Invisible Hand', films: 'Films · Invisible Hand', library: 'Library · Invisible Hand' }[view];
    document.title = view === 'topic' && TOPIC[h.slice(6)] ? TOPIC[h.slice(6)].title + ' · Invisible Hand' : title;
    emit('ih:route', { view: view, topic: view === 'topic' ? h.slice(6) : null });
  }
  function rerender() { searchIndex = null; applyStatic(); route(); }
  function setCountry(id) { state.country = id; store.set('country', id); if (location.hash === '#today' || !location.hash) renderToday(); }

  function applyStatic() {
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)); });
    document.documentElement.lang = 'en';
    var f = $('#footUpdated');
    if (f) f.textContent = (NEWS.updated ? 'News ' + ago(NEWS.updated) : '') + (C.updated ? ' · Data refreshed ' + new Date(C.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  }

  function toast(msg) { var el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 2200); }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove(); toast(ok ? t('copied') : text);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast(t('copied')); }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  /* ---------------- Events ---------------- */
  document.addEventListener('change', function (e) {
    if (e.target.id === 'countrySel') setCountry(e.target.value);
    if (e.target.id === 'compareSel') { state.compare = e.target.value; store.set('compare', state.compare); renderToday(); }
  });
  // the logo beats like a heart when clicked or tapped
  document.addEventListener('click', function (e) {
    var brand = e.target.closest && e.target.closest('.brand');
    if (!brand) return;
    brand.classList.remove('beat'); void brand.offsetWidth; brand.classList.add('beat');
    clearTimeout(brand._beatT); brand._beatT = setTimeout(function () { brand.classList.remove('beat'); }, 1250);
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.follow) {
      toggleFollow(b.dataset.follow);
      var on = isFollowing(b.dataset.follow);
      if (!$('#view-news').hidden) { var y = window.scrollY; renderNews(); window.scrollTo(0, y); }
      else $$('[data-follow="' + b.dataset.follow + '"]').forEach(function (x) { x.setAttribute('aria-pressed', String(on)); x.innerHTML = heart + (on ? t('following') : t('follow')); });
      toast(on ? L('Following. Their posts show first.', 'Followed. They go first now.') : L('Unfollowed.', 'Unfollowed.'));
      return;
    }
    if (b.dataset.nf) { state.newsFilter = b.dataset.nf; renderNews(); return; }
    if (b.dataset.ft) { state.filmTopic = b.dataset.ft; renderFilms(); return; }
    if (b.dataset.cite) { copyText(citation(b.dataset.cite)); return; }
    if (b.dataset.lang) { state.lang = b.dataset.lang; store.set('lang', state.lang); rerender(); return; }
    if (b.id === 'shuffleBtn') { state.filmShift++; renderFilms(); return; }
    if (b.id === 'seminarBtn') { document.body.classList.toggle('seminar'); renderToday(); return; }
    if (b.id === 'openSearch') { openSearch(); return; }
    if (b.id === 'themeBtn') {
      var root = document.documentElement, cur = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', next); store.set('theme', next);
      if (!$('#view-today').hidden) startRosette();
      return;
    }
  });
  $('#searchOverlay').addEventListener('click', function (e) { if (e.target.id === 'searchOverlay') closeSearch(); });
  $('#searchInput').addEventListener('input', function (e) { runSearch(e.target.value); });
  $('#searchInput').addEventListener('keydown', function (e) {
    var links = $$('#searchResults a');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!links.length) return;
      sActive = (sActive + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach(function (a, i) { a.classList.toggle('active', i === sActive); }); links[sActive].scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter' && links[sActive]) { e.preventDefault(); links[sActive].click(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('#searchOverlay').hidden) { closeSearch(); return; }
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && tag !== 'select') { e.preventDefault(); openSearch(); }
  });
  window.addEventListener('hashchange', function () { route(); window.scrollTo(0, 0); });

  var savedTheme = store.get('theme', null);
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.setAttribute('data-theme', savedTheme);
  applyStatic();
  route();
})();
