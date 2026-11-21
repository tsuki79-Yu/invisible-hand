/* Invisible Hand: Laws & principles.
   Each law is a short picture story: 4 animated scenes you click or swipe through.
   Scenes are drawn in SVG from small building blocks (people, cows, coins, bars...)
   and animated with CSS classes (a-pop, a-up, a-grow...). Colours come from the site's
   theme, so scenes work in light and dark mode. To add a law, copy one block in LAWS. */
(function () {
  'use strict';

  /* ---------- building blocks ---------- */
  function A(cls, d, inner) { return '<g class="' + cls + '" style="--d:' + (d || 0) + 's">' + inner + '</g>'; }
  function T(x, y, txt, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" class="lw-t ' + (o.cls || '') + '" font-size="' + (o.size || 12) + '" text-anchor="' + (o.anchor || 'middle') + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') + '>' + txt + '</text>';
  }
  function person(x, y, cls, mood) {
    var face = mood === 'sad' ? '<path d="M' + (x - 3) + ' ' + (y - 27) + ' q3 -2.5 6 0" class="lw-stroke-paper" stroke-width="1.4" fill="none"/>'
      : mood === 'happy' ? '<path d="M' + (x - 3) + ' ' + (y - 29) + ' q3 3 6 0" class="lw-stroke-paper" stroke-width="1.4" fill="none"/>' : '';
    return '<circle cx="' + x + '" cy="' + (y - 31) + '" r="7.5" class="' + (cls || 'lw-note') + '"/>' + face +
      '<path d="M' + (x - 10) + ' ' + y + ' v-11 a10 10 0 0 1 20 0 v11 z" class="' + (cls || 'lw-note') + '"/>';
  }
  function cow(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
      '<path d="M-11 0v7M-5 0v7M5 0v7M11 0v7" class="lw-stroke-ink" stroke-width="2.2" fill="none"/>' +
      '<rect x="-16" y="-17" width="32" height="18" rx="8" class="lw-cow"/>' +
      '<circle cx="-7" cy="-10" r="3.4" class="lw-ink"/><circle cx="5" cy="-6" r="2.6" class="lw-ink"/>' +
      '<ellipse cx="18" cy="-17" rx="6.5" ry="5.5" class="lw-cow"/><circle cx="20" cy="-18" r="1.1" class="lw-ink"/></g>';
  }
  function coin(x, y, r, label, cls) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="' + (cls || 'lw-gold') + '"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.78) + '" class="lw-stroke-paper" stroke-width="1.2" fill="none" opacity=".6"/>' +
      (label ? T(x, y + r * 0.32, label, { size: Math.round(r * 0.8), cls: 'lw-t-paper', weight: 700 }) : '');
  }
  function arrow(x1, y1, x2, y2, cls) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 8;
    var p1 = (x2 - h * Math.cos(a - 0.45)) + ' ' + (y2 - h * Math.sin(a - 0.45)), p2 = (x2 - h * Math.cos(a + 0.45)) + ' ' + (y2 - h * Math.sin(a + 0.45));
    return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" class="' + (cls || 'lw-stroke-ink') + ' a-draw" stroke-width="2" fill="none" pathLength="100"/>' +
      '<path d="M' + p1 + ' L' + x2 + ' ' + y2 + ' L' + p2 + '" class="' + (cls || 'lw-stroke-ink') + '" stroke-width="2" fill="none" stroke-linecap="round"/>';
  }
  function box(x, y, w, h, cls, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 8 : rx) + '" class="' + (cls || 'lw-paper') + '"/>'; }
  function bar(x, base, w, h, cls, d, label, val) {
    var up = h >= 0, y = up ? base - h : base;
    return A('a-grow' + (up ? '' : ' down'), d, box(x, y, w, Math.abs(h), cls || 'lw-note', 3)) +
      (val != null ? A('a-fade', (d || 0) + 0.3, T(x + w / 2, up ? y - 5 : y + Math.abs(h) + 13, val, { size: 11, weight: 700, cls: h < 0 ? 'lw-t-red' : '' })) : '') +
      (label ? T(x + w / 2, base + (up ? 14 : -5), label, { size: 10, cls: 'lw-t-muted' }) : '');
  }
  function ground(y) { return '<rect x="0" y="' + y + '" width="400" height="' + (240 - y) + '" class="lw-soft"/>'; }
  function grassBlades(x1, x2, y) { var s = ''; for (var x = x1; x < x2; x += 14) s += '<path d="M' + x + ' ' + y + ' q2 -7 4 -9 M' + (x + 5) + ' ' + y + ' q-1 -6 1 -8" class="lw-stroke-grassdark" stroke-width="1.4" fill="none"/>'; return s; }
  function slice(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')"><path d="M0 -14 L13 12 Q0 17 -13 12 Z" class="lw-gold"/><path d="M-13 12 Q0 17 13 12 L11 8 Q0 13 -11 8 Z" class="lw-crust"/>' +
      '<circle cx="-2" cy="2" r="2.4" class="lw-red"/><circle cx="4" cy="7" r="2" class="lw-red"/><circle cx="-5" cy="9" r="1.8" class="lw-red"/></g>';
  }
  function check(x, y, cls) { return '<path d="M' + (x - 6) + ' ' + y + ' l4 5 l9 -11" class="' + (cls || 'lw-stroke-green') + '" stroke-width="3" fill="none" stroke-linecap="round"/>'; }
  function cross(x, y) { return '<path d="M' + (x - 6) + ' ' + (y - 6) + ' l12 12 M' + (x + 6) + ' ' + (y - 6) + ' l-12 12" class="lw-stroke-red" stroke-width="3" stroke-linecap="round"/>'; }
  function bubble(x, y, w, h, txt, size) {
    return box(x, y, w, h, 'lw-paper lw-outline', 10) + '<path d="M' + (x + 18) + ' ' + (y + h) + ' l-4 10 l12 -10 z" class="lw-paper"/>' +
      T(x + w / 2, y + h / 2 + 4, txt, { size: size || 11 });
  }
  function building(x, y, w, h, label, cls) {
    var win = ''; for (var r = 0; r < Math.floor((h - 18) / 14); r++) for (var c = 0; c < Math.floor((w - 8) / 12); c++) win += '<rect x="' + (x + 7 + c * 12) + '" y="' + (y + 10 + r * 14) + '" width="6" height="8" class="lw-paper" opacity=".85"/>';
    return box(x, y, w, h, cls || 'lw-note', 4) + win + (label ? T(x + w / 2, y + h + 14, label, { size: 10, cls: 'lw-t-muted' }) : '');
  }

  /* ---------- the laws ---------- */
  var LAWS = [
  /* ===== ECONOMICS ===== */
  {
    id: 'commons', area: 'econ', title: 'Tragedy of the commons',
    def: 'When a resource is shared and free to use, each person takes a little more for themselves, and together they use it up.',
    defGz: 'Shared + free = everyone takes a bit extra, and then it\'s gone for everyone.',
    who: 'Described by William Forster Lloyd in 1833 and made famous by ecologist Garrett Hardin in 1968. Elinor Ostrom won the 2009 Nobel for showing how communities can avoid it.',
    real: ['Overfishing in shared seas', 'Traffic jams on free roads', 'Climate change: the atmosphere is a commons'],
    topic: 'market-failures', paper: { t: 'Hardin (1968), The Tragedy of the Commons, Science', u: 'https://doi.org/10.1126/science.162.3859.1243' },
    slides: [
      { c: 'A village shares one pasture. Anyone can graze cows there for free.', g: 'One shared field. Free grazing for everyone.',
        s: function () { return ground(150) + A('a-fade', 0, box(14, 152, 372, 76, 'lw-grass', 18) + grassBlades(30, 380, 170)) +
          A('a-up', 0.1, box(26, 96, 4, 58, 'lw-ink', 1) + box(10, 84, 92, 24, 'lw-paper lw-outline', 5) + T(56, 100, 'Common land', { size: 11, weight: 700 })) +
          [130, 200, 270, 340].map(function (x, i) { return A('a-up', 0.2 + i * 0.12, person(x, 150, 'lw-note')) + A('a-pop', 0.5 + i * 0.12, cow(x - 6, 205, 0.9)); }).join(''); } },
      { c: 'Each herder thinks: "One more cow means more milk for me, and the grass it eats is shared by everyone."', g: 'Each herder: "one more cow = more milk for ME, grass cost is everyone\'s problem."',
        s: function () { return ground(150) + box(14, 152, 372, 76, 'lw-grass', 18) + grassBlades(30, 380, 170) +
          [130, 200, 270, 340].map(function (x) { return person(x, 150, 'lw-note') + cow(x - 6, 205, 0.9); }).join('') +
          [130, 200, 270, 340].map(function (x, i) { return A('a-pop', 0.3 + i * 0.15, cow(x + 20, 190, 0.8)); }).join('') +
          A('a-pop', 0.1, bubble(150, 40, 150, 34, '+1 cow = more milk for me!')); } },
      { c: 'Everyone thinks the same way. Too many cows eat the grass faster than it can grow back.', g: 'Everyone had the same idea. Grass can\'t keep up.',
        s: function () { var cows = ''; for (var i = 0; i < 14; i++) cows += A('a-pop', 0.05 * i, cow(34 + (i % 7) * 52 + (i > 6 ? 22 : 0), 188 + (i > 6 ? 26 : 0), 0.8));
          return ground(150) + box(14, 152, 372, 76, 'lw-grass', 18) + A('a-fadein-slow', 0.4, box(14, 152, 372, 76, 'lw-dirt', 18)) + cows +
            A('a-pop', 1.2, T(200, 120, 'Overgrazed!', { size: 22, weight: 800, cls: 'lw-t-red' })); } },
      { c: 'The pasture dies and everyone loses. The fixes: shared rules, limits or ownership. Ostrom showed villages often manage this themselves.', g: 'Field\'s dead, everyone loses. Fix: rules, limits, ownership. Communities can totally self-organise.',
        s: function () { return ground(150) +
          box(14, 152, 180, 76, 'lw-dirt', 18) + T(104, 96, 'Free for all', { size: 12, weight: 700 }) + person(70, 150, 'lw-muted', 'sad') + person(130, 150, 'lw-muted', 'sad') +
          box(206, 152, 180, 76, 'lw-dirt', 18) + A('a-grow', 0.4, box(206, 152, 180, 76, 'lw-grass', 18) + grassBlades(220, 380, 170)) +
          A('a-up', 0.2, '<path d="M206 150 v-22 M246 150 v-22 M286 150 v-22 M326 150 v-22 M366 150 v-22 M206 136 h170" class="lw-stroke-ink" stroke-width="2.5" fill="none"/>') +
          A('a-pop', 0.8, box(226, 60, 140, 34, 'lw-paper lw-outline', 6) + T(296, 82, 'Rule: 2 cows each', { size: 12, weight: 700 })) +
          A('a-pop', 1.1, cow(260, 205, 0.85) + cow(330, 205, 0.85)) + A('a-up', 1.2, person(240, 150, 'lw-note', 'happy') + person(350, 150, 'lw-note', 'happy')); } }
    ]
  },
  {
    id: 'utility', area: 'econ', title: 'Diminishing marginal utility',
    def: 'Each extra unit of something gives you less extra satisfaction than the one before.',
    defGz: 'The first slice hits different. The fifth? Not so much.',
    who: 'First set out by Hermann Heinrich Gossen in 1854 ("Gossen\'s first law") and built into economics by Jevons, Menger and Walras in the 1870s.',
    real: ['Why demand curves slope down', 'Why people spread spending across many things', 'Why progressive taxes are often argued for'],
    topic: 'scarcity',
    slides: [
      { c: 'You\'re hungry. The first slice of pizza feels amazing.', g: 'Starving. First slice = pure joy.',
        s: function () { return ground(200) + A('a-up', 0, person(110, 200, 'lw-note', 'happy')) + A('a-slide', 0.3, slice(190, 140, 1.6)) +
          box(300, 60, 30, 140, 'lw-line', 6) + bar(300, 200, 30, 120, 'lw-green', 0.7) + A('a-pop', 1.3, T(315, 50, '+10 joy', { size: 14, weight: 800 })); } },
      { c: 'The second slice is good. The third is fine. Each one adds less joy than the one before.', g: '2nd slice: good. 3rd: fine. Each one hits less.',
        s: function () { return ground(200) + [0, 1, 2].map(function (i) { return A('a-pop', i * 0.4, slice(90 + i * 110, 36, 1.1)); }).join('') +
          bar(70, 200, 40, 100, 'lw-green', 0.3, '1st slice', '+10') + bar(180, 200, 40, 60, 'lw-green', 0.7, '2nd slice', '+6') + bar(290, 200, 40, 30, 'lw-green', 1.1, '3rd slice', '+3'); } },
      { c: 'By the fifth slice, another one adds nothing, or even makes you feel worse.', g: '5th slice? You regret it.',
        s: function () { return ground(160) + A('a-up', 0, person(80, 160, 'lw-muted', 'sad')) +
          [0, 1, 2, 3, 4].map(function (i) { return A('a-pop', 0.1 * i, slice(160 + i * 45, 60, 0.9)); }).join('') +
          '<line x1="150" x2="390" y1="160" y2="160" class="lw-stroke-ink" stroke-width="1.5"/>' +
          bar(160, 160, 28, 50, 'lw-green', 0.3, '', '+10') + bar(205, 160, 28, 30, 'lw-green', 0.45, '', '+6') + bar(250, 160, 28, 15, 'lw-green', 0.6, '', '+3') + bar(295, 160, 28, 4, 'lw-green', 0.75, '', '+1') + bar(340, 160, 28, -18, 'lw-red', 0.9, '', '−2'); } },
      { c: 'Total joy rises more and more slowly. That\'s why we spread our money across many things, and why people buy more of something when it\'s cheaper.', g: 'Total joy flattens out. That\'s why you don\'t spend everything on pizza.',
        s: function () { return '<line x1="50" y1="200" x2="370" y2="200" class="lw-stroke-ink" stroke-width="1.5"/><line x1="50" y1="200" x2="50" y2="30" class="lw-stroke-ink" stroke-width="1.5"/>' +
          T(210, 225, 'Slices eaten', { size: 11, cls: 'lw-t-muted' }) + T(30, 115, 'Joy', { size: 11, cls: 'lw-t-muted' }) +
          '<path d="M50 200 C110 90 180 60 360 52" class="lw-stroke-note a-draw" stroke-width="3.5" fill="none" pathLength="100"/>' + A('a-fade', 1.2, T(300, 42, 'Total joy', { size: 12, weight: 700 })) +
          bar(80, 200, 22, 60, 'lw-gold', 0.6) + bar(140, 200, 22, 36, 'lw-gold', 0.8) + bar(200, 200, 22, 18, 'lw-gold', 1.0) + bar(260, 200, 22, 7, 'lw-gold', 1.2) +
          A('a-fade', 1.5, T(170, 160, 'Extra joy from each slice', { size: 11, cls: 'lw-t-gold', weight: 700 })); } }
    ]
  },
  {
    id: 'returns', area: 'econ', title: 'Law of diminishing returns',
    def: 'If one input is fixed, adding more and more of another input eventually adds less and less output.',
    defGz: 'One kitchen, more cooks: helpful at first, then just chaos.',
    who: 'Noticed by Turgot in 1767 and central to Malthus and Ricardo\'s work on farmland. Robert Solow\'s 1956 growth model rests on it.',
    real: ['Extra fertiliser on the same field', 'More workers on one machine', 'Cramming more study hours into one night'],
    topic: 'growth',
    slides: [
      { c: 'A small kitchen with one stove. One cook makes 10 meals an hour.', g: 'One stove, one cook: 10 meals an hour.',
        s: function () { return ground(190) + A('a-up', 0, box(170, 120, 70, 70, 'lw-ink', 6) + '<circle cx="190" cy="132" r="7" class="lw-gold"/><circle cx="220" cy="132" r="7" class="lw-gold"/>' + T(205, 210, 'Stove', { size: 11, cls: 'lw-t-muted' })) +
          A('a-up', 0.3, person(130, 190, 'lw-note')) + A('a-pop', 0.7, box(270, 70, 110, 40, 'lw-paper lw-outline', 8) + T(325, 96, '10 meals/hour', { size: 13, weight: 700 })); } },
      { c: 'A second cook helps a lot (22 meals), a third still helps (30). They share the work.', g: 'Cook #2 and #3? Big help.',
        s: function () { return ground(190) + box(170, 120, 70, 70, 'lw-ink', 6) + A('a-up', 0, person(130, 190, 'lw-note')) + A('a-up', 0.3, person(270, 190, 'lw-note')) + A('a-up', 0.6, person(310, 190, 'lw-note')) +
          '<line x1="20" x2="120" y1="110" y2="110" class="lw-stroke-ink" stroke-width="1"/>' +
          bar(24, 110, 24, 20, 'lw-green', 0.2, '1', '10') + bar(56, 110, 24, 44, 'lw-green', 0.5, '2', '22') + bar(88, 110, 24, 60, 'lw-green', 0.8, '3', '30') + T(70, 140, 'cooks → meals', { size: 10, cls: 'lw-t-muted' }); } },
      { c: 'With six cooks they bump into each other. Output barely rises (34 meals). The stove is the limit.', g: 'Six cooks, one stove. Everyone\'s in the way.',
        s: function () { var p = ''; [120, 150, 255, 285, 315, 345].forEach(function (x, i) { p += A('a-up', i * 0.1, person(x, 190, 'lw-note')); });
          return ground(190) + box(170, 120, 70, 70, 'lw-ink', 6) + p + A('a-shake', 0.8, T(200, 100, 'Crowded!', { size: 18, weight: 800, cls: 'lw-t-red' })) +
            A('a-pop', 1, box(20, 40, 120, 40, 'lw-paper lw-outline', 8) + T(80, 66, '34 meals (+1)', { size: 13, weight: 700 })); } },
      { c: 'Each extra cook adds less than the last. Fixed space, equipment or land limits how much more workers can produce.', g: 'Extra cooks add less and less. The fixed stuff sets the limit.',
        s: function () { return '<line x1="50" y1="190" x2="370" y2="190" class="lw-stroke-ink" stroke-width="1.5"/>' + T(210, 222, 'Number of cooks', { size: 11, cls: 'lw-t-muted' }) +
          [10, 12, 8, 3, 1, 1].map(function (v, i) { return bar(70 + i * 50, 190, 30, v * 10, i < 2 ? 'lw-green' : 'lw-gold', 0.2 + i * 0.2, String(i + 1), '+' + v); }).join('') +
          A('a-fade', 1.6, T(210, 40, 'Extra meals from each extra cook', { size: 12, weight: 700 })); } }
    ]
  },
  {
    id: 'gresham', area: 'econ', title: 'Gresham\'s law',
    def: '"Bad money drives out good." When two kinds of money have the same official value, people keep the more valuable kind and spend the worse one.',
    defGz: 'Same value on paper? You hoard the good one and spend the trash one.',
    who: 'Named after Sir Thomas Gresham, financial adviser to Queen Elizabeth I (1558). Copernicus had described it in 1526.',
    real: ['US silver coins vanished after 1965 when cheaper coins arrived', 'People save stable dollars and spend a weak local currency', 'Collectors keep old gold coins'],
    topic: 'central-banks',
    slides: [
      { c: 'Two coins have the same official value, 1 som. One is 90% silver. The other is mostly cheap metal.', g: 'Two coins, both worth "1". One\'s real silver, one\'s basically tin.',
        s: function () { return A('a-pop', 0, coin(130, 110, 48, '1', 'lw-silver')) + A('a-pop', 0.3, coin(270, 110, 48, '1', 'lw-dull')) +
          A('a-fade', 0.6, T(130, 185, '90% silver', { size: 13, weight: 700 }) + T(270, 185, '10% silver', { size: 13, weight: 700 }) + T(200, 30, 'Same face value: 1', { size: 14, weight: 700, cls: 'lw-t-gold' })); } },
      { c: 'People keep the silver coin at home and spend the cheap one in the shops.', g: 'Silver coin → savings jar. Cheap coin → spent.',
        s: function () { return A('a-up', 0, person(200, 200, 'lw-note')) +
          A('a-slide-l', 0.4, coin(90, 140, 20, '1', 'lw-silver')) + A('a-slide-r', 0.4, coin(320, 140, 20, '1', 'lw-dull')) +
          box(60, 170, 60, 50, 'lw-soft lw-outline', 10) + T(90, 232, 'Keep', { size: 12, weight: 700 }) +
          box(280, 170, 80, 50, 'lw-goldsoft lw-outline', 6) + T(320, 232, 'Spend', { size: 12, weight: 700 }) +
          arrow(182, 160, 122, 160, 'lw-stroke-ink') + arrow(218, 160, 288, 160, 'lw-stroke-ink'); } },
      { c: 'Soon only the cheap coins circulate. The good ones disappear into jars and drawers.', g: 'Now only bad coins are out there. The good ones are in hiding.',
        s: function () { var c = ''; for (var i = 0; i < 6; i++) c += A('a-slide-r', i * 0.15, coin(70 + i * 50, 80 + (i % 2) * 20, 18, '1', 'lw-dull'));
          return c + box(150, 150, 100, 70, 'lw-soft lw-outline', 12) + T(200, 140, 'Hidden at home', { size: 11, cls: 'lw-t-muted' }) +
            A('a-pop', 0.9, coin(180, 185, 14, '', 'lw-silver') + coin(205, 192, 14, '', 'lw-silver') + coin(225, 180, 14, '', 'lw-silver')); } },
      { c: 'This really happened: after the US switched to cheaper coins in 1965, the old silver coins vanished from circulation within a few years.', g: 'Real story: US silver coins vanished after 1965. People kept them.',
        s: function () { return A('a-pop', 0, coin(110, 100, 40, '25¢', 'lw-silver')) + T(110, 165, '1964: 90% silver', { size: 12, weight: 700 }) +
          arrow(165, 100, 235, 100, 'lw-stroke-ink') + A('a-pop', 0.5, coin(290, 100, 40, '25¢', 'lw-dull')) + T(290, 165, '1965: copper-nickel', { size: 12, weight: 700 }) +
          A('a-fade', 1, T(200, 210, 'Old silver quarters quietly left circulation', { size: 12, cls: 'lw-t-muted' })); } }
    ]
  },
  {
    id: 'goodhart', area: 'econ', title: 'Goodhart\'s law',
    def: 'When a measure becomes a target, it stops being a good measure, because people start chasing the number instead of the goal.',
    defGz: 'Once a number is the target, people game the number.',
    who: 'Economist Charles Goodhart, 1975, describing how money-supply targets stopped working once the Bank of England aimed at them.',
    real: ['Money-supply targets in the 1970s', 'Schools teaching to the test', 'Websites chasing clicks with clickbait'],
    topic: 'central-banks',
    slides: [
      { c: 'A nail factory is judged on one number: it must make 10,000 nails a month.', g: 'Factory goal: 10,000 nails. That\'s it.',
        s: function () { return A('a-up', 0, building(40, 90, 110, 110, 'Nail factory', 'lw-ink')) + A('a-pop', 0.4, box(200, 70, 170, 60, 'lw-goldsoft lw-outline', 8) + T(285, 96, 'Target:', { size: 12, cls: 'lw-t-muted' }) + T(285, 118, '10,000 nails', { size: 18, weight: 800 })); } },
      { c: 'So they make 10,000 tiny, useless nails. Target hit, but nobody can build anything with them.', g: '10,000 tiny useless nails. Target: hit. Point: missed.',
        s: function () { var n = ''; for (var i = 0; i < 70; i++) n += '<path d="M' + (60 + (i * 37) % 280) + ' ' + (160 + (i * 13) % 50) + ' l' + (3 + i % 3) + ' -2" class="lw-stroke-ink" stroke-width="2"/>';
          return A('a-fade', 0, n) + A('a-pop', 0.6, box(110, 50, 180, 50, 'lw-paper lw-outline', 8) + T(200, 82, '10,000 nails', { size: 18, weight: 800 }) + check(275, 72)) + A('a-pop', 1, T(200, 140, 'too small to use', { size: 13, cls: 'lw-t-red', weight: 700 })); } },
      { c: 'The boss changes the target to weight: 5 tonnes of nails. They make a few giant, useless nails instead.', g: 'New target: weight. Now it\'s three giant nails. LOL.',
        s: function () { return A('a-pop', 0, box(110, 30, 180, 44, 'lw-goldsoft lw-outline', 8) + T(200, 58, 'Target: 5 tonnes', { size: 16, weight: 800 })) +
          A('a-up', 0.4, '<path d="M60 160 h240 l20 8 l-20 8 h-240 z" class="lw-ink"/><rect x="50" y="150" width="14" height="36" rx="3" class="lw-ink"/>') + A('a-pop', 1, check(340, 120)) + A('a-pop', 1.1, T(200, 215, 'still useless', { size: 13, cls: 'lw-t-red', weight: 700 })); } },
      { c: 'This happens everywhere: in central bank targets, school test scores and online clicks. Watch the goal, not just the number.', g: 'Test scores, clicks, KPIs... always ask what the number is FOR.',
        s: function () { return [['Central banks', 'money-supply targets, 1970s'], ['Schools', 'teaching to the test'], ['Websites', 'clickbait for clicks']].map(function (r, i) {
          return A('a-up', i * 0.3, box(40, 30 + i * 62, 320, 50, 'lw-paper lw-outline', 10) + '<circle cx="70" cy="' + (55 + i * 62) + '" r="12" class="lw-gold"/>' + T(95, 52 + i * 62, r[0], { size: 13, weight: 700, anchor: 'start' }) + T(95, 68 + i * 62, r[1], { size: 11, anchor: 'start', cls: 'lw-t-muted' })); }).join(''); } }
    ]
  },
  {
    id: 'dilemma', area: 'econ', title: 'Prisoner\'s dilemma',
    def: 'Two people each acting in their own interest can end up worse off than if they had cooperated.',
    defGz: 'Both play it "safe", both lose. Teamwork would\'ve won.',
    who: 'Devised by Merrill Flood and Melvin Dresher at RAND in 1950 and named by mathematician Albert Tucker. A cornerstone of game theory.',
    real: ['Price wars between rival shops', 'Arms races', 'Countries delaying climate action'],
    topic: 'market-failures',
    slides: [
      { c: 'Two suspects are held in separate rooms. Each can stay quiet or confess, without knowing what the other will do.', g: 'Two suspects, separate rooms. Stay quiet or snitch?',
        s: function () { return A('a-up', 0, box(30, 60, 150, 140, 'lw-soft lw-outline', 10) + person(105, 180, 'lw-note') + T(105, 80, 'Ali', { size: 13, weight: 700 })) +
          A('a-up', 0.2, box(220, 60, 150, 140, 'lw-soft lw-outline', 10) + person(295, 180, 'lw-gold') + T(295, 80, 'Bek', { size: 13, weight: 700 })) +
          '<line x1="200" y1="50" x2="200" y2="210" class="lw-stroke-ink" stroke-width="3" stroke-dasharray="6 5"/>' + A('a-pop', 0.6, T(200, 35, 'Quiet or confess?', { size: 14, weight: 800 })); } },
      { c: 'If both stay quiet, 1 year each. If both confess, 3 years each. If only one confesses, they go free and the other gets 5 years.', g: 'Both quiet: 1 yr. Both snitch: 3 yrs. One snitches: they walk, the other gets 5.',
        s: function () { var cells = [['1 · 1', 'lw-green'], ['5 · 0', 'lw-soft'], ['0 · 5', 'lw-soft'], ['3 · 3', 'lw-goldsoft']];
          return T(230, 30, 'Bek', { size: 12, weight: 700 }) + T(170, 48, 'quiet', { size: 11, cls: 'lw-t-muted' }) + T(290, 48, 'confess', { size: 11, cls: 'lw-t-muted' }) + T(60, 130, 'Ali', { size: 12, weight: 700 }) +
            T(95, 92, 'quiet', { size: 11, cls: 'lw-t-muted' }) + T(95, 172, 'confess', { size: 11, cls: 'lw-t-muted' }) +
            cells.map(function (c, i) { var x = 115 + (i % 2) * 120, y = 58 + Math.floor(i / 2) * 80; return A('a-pop', 0.2 + i * 0.2, box(x, y, 110, 70, c[1] + ' lw-outline', 8) + T(x + 55, y + 42, c[0], { size: 18, weight: 800 })); }).join('') +
            A('a-fade', 1.2, T(200, 228, 'years in prison: Ali · Bek', { size: 11, cls: 'lw-t-muted' })); } },
      { c: 'Each thinks: "Whatever the other does, I\'m better off confessing." So both confess and get 3 years.', g: 'Each one thinks snitching is smarter. So both snitch. 3 years each.',
        s: function () { return '<g opacity=".45">' + box(115, 58, 110, 70, 'lw-green lw-outline', 8) + box(235, 58, 110, 70, 'lw-soft lw-outline', 8) + box(115, 138, 110, 70, 'lw-soft lw-outline', 8) + '</g>' +
          A('a-pop', 0.3, box(235, 138, 110, 70, 'lw-gold lw-outline', 8) + T(290, 180, '3 · 3', { size: 20, weight: 800, cls: 'lw-t-paper' })) +
          arrow(170, 120, 255, 150, 'lw-stroke-red') + arrow(290, 120, 290, 135, 'lw-stroke-red') + A('a-fade', 0.8, T(200, 40, 'Both confess', { size: 15, weight: 800 })); } },
      { c: 'Together they\'d have been better off staying quiet (2 years in total vs 6). It explains price wars and arms races, and why trust and repeated dealings help.', g: 'Quiet = 2 years total. Snitching = 6. Trust wins. Same logic as price wars.',
        s: function () { return '<line x1="60" y1="190" x2="340" y2="190" class="lw-stroke-ink" stroke-width="1.5"/>' +
          bar(110, 190, 70, 30, 'lw-green', 0.2, 'Both quiet', '2 years') + bar(230, 190, 70, 90, 'lw-red', 0.5, 'Both confess', '6 years') +
          A('a-fade', 1, T(200, 40, 'Total time in prison', { size: 13, weight: 700 })); } }
    ]
  },
  /* ===== FINANCE ===== */
  {
    id: 'accrual', area: 'fin', title: 'Accrual accounting',
    def: 'Record income when you earn it and costs when you incur them, not when the cash moves. It shows the true profit of each period.',
    defGz: 'Money counts when you EARN it, not when it lands in your account.',
    who: 'Grew out of double-entry bookkeeping and the "matching principle". Today it\'s required for companies under IFRS and US GAAP accounting standards.',
    real: ['A firm finishes work in December but is paid in January', 'Annual subscriptions paid upfront', 'Salaries earned in March, paid in April'],
    topic: 'corporate',
    slides: [
      { c: 'In March, a designer finishes a website for a client and sends an invoice for 1,000. The client will pay in April.', g: 'March: website done, invoice sent for 1,000. Payment comes in April.',
        s: function () { return timeline() + A('a-pop', 0.2, box(45, 46, 70, 46, 'lw-ink', 6) + box(51, 52, 58, 34, 'lw-note', 3) + box(35, 92, 90, 6, 'lw-ink', 3)) +
          A('a-slide', 0.6, box(150, 42, 80, 56, 'lw-paper lw-outline', 4) + T(190, 64, 'Invoice', { size: 11, weight: 700 }) + T(190, 82, '1,000', { size: 14, weight: 800 })) + A('a-fade', 0.8, T(80, 150, 'Work done', { size: 11, cls: 'lw-t-muted' })); } },
      { c: 'Cash accounting records the income only when the money arrives, in April. March looks like it earned nothing.', g: 'Cash method: counts it in April when the money lands. March looks empty.',
        s: function () { return timeline() + T(200, 36, 'Cash accounting', { size: 14, weight: 800 }) + A('a-slide', 0.3, coin(200, 92, 18, '$', 'lw-gold')) +
          A('a-pop', 0.8, box(160, 140, 80, 30, 'lw-green', 6) + T(200, 160, '+1,000', { size: 13, weight: 800, cls: 'lw-t-paper' })) + A('a-pop', 1, box(40, 140, 80, 30, 'lw-line', 6) + T(80, 160, '0', { size: 13, weight: 800 })); } },
      { c: 'Accrual accounting records the 1,000 in March, when it was earned, as money the client owes (a receivable). The 300 she paid a freelancer for the job also goes in March.', g: 'Accrual: counts it in March when earned. Costs for the job go in March too.',
        s: function () { return timeline() + T(200, 36, 'Accrual accounting', { size: 14, weight: 800 }) +
          A('a-pop', 0.3, box(40, 140, 80, 30, 'lw-green', 6) + T(80, 160, '+1,000', { size: 13, weight: 800, cls: 'lw-t-paper' })) + A('a-pop', 0.6, box(40, 176, 80, 26, 'lw-red', 6) + T(80, 194, '−300', { size: 12, weight: 800, cls: 'lw-t-paper' })) +
          A('a-slide', 1, box(160, 140, 80, 30, 'lw-goldsoft lw-outline', 6) + T(200, 159, 'cash arrives', { size: 11, weight: 700 })) + A('a-fade', 1.2, T(80, 224, 'profit 700', { size: 12, weight: 800 })); } },
      { c: 'Now March shows its real result: 700 profit. Accrual shows how a business is really doing. A separate cash flow statement tracks the cash itself.', g: 'Accrual = the real story. Cash flow statement = where the cash actually is.',
        s: function () { return '<line x1="60" y1="180" x2="340" y2="180" class="lw-stroke-ink" stroke-width="1.5"/>' + T(130, 40, 'Cash view', { size: 13, weight: 700 }) + T(280, 40, 'Accrual view', { size: 13, weight: 700 }) +
          bar(85, 180, 34, 4, 'lw-line', 0.2, 'Mar', '0') + bar(140, 180, 34, 100, 'lw-green', 0.4, 'Apr', '1,000') +
          bar(235, 180, 34, 70, 'lw-green', 0.7, 'Mar', '700') + bar(290, 180, 34, 4, 'lw-line', 0.9, 'Apr', '0') + '<line x1="200" y1="50" x2="200" y2="200" class="lw-stroke-muted" stroke-width="1" stroke-dasharray="4 4"/>'; } }
    ]
  },
  {
    id: 'double', area: 'fin', title: 'Double-entry bookkeeping',
    def: 'Every transaction is recorded twice, so the accounts always balance: Assets = Liabilities + Equity.',
    defGz: 'Every money move gets written twice, so the books always balance.',
    who: 'Used by Italian merchants in the 1300s and first published by the mathematician Luca Pacioli in 1494. Still the basis of all modern accounting.',
    real: ['Taking a bank loan', 'Buying equipment with cash', 'Every company\'s balance sheet'],
    topic: 'corporate',
    slides: [
      { c: 'A new business starts with 5,000 of the owner\'s money. Assets (5,000 cash) = Equity (5,000). The scale balances.', g: 'Start: 5,000 cash = 5,000 owner money. Balanced.',
        s: function () { return scale(0) + A('a-pop', 0.3, box(55, 112, 100, 34, 'lw-note', 6) + T(105, 134, 'Cash 5,000', { size: 12, weight: 700, cls: 'lw-t-paper' })) +
          A('a-pop', 0.5, box(245, 112, 100, 34, 'lw-gold', 6) + T(295, 134, 'Equity 5,000', { size: 12, weight: 700, cls: 'lw-t-paper' })); } },
      { c: 'It borrows 1,000 from a bank. Cash goes up 1,000 (asset) and a loan of 1,000 appears (liability). Two entries, still balanced.', g: 'Borrow 1,000: cash +1,000 AND loan +1,000. Still balanced.',
        s: function () { return scale(0) + box(55, 112, 100, 34, 'lw-note', 6) + T(105, 134, 'Cash 5,000', { size: 12, weight: 700, cls: 'lw-t-paper' }) + box(245, 112, 100, 34, 'lw-gold', 6) + T(295, 134, 'Equity 5,000', { size: 12, weight: 700, cls: 'lw-t-paper' }) +
          A('a-drop', 0.3, box(55, 76, 100, 32, 'lw-note', 6) + T(105, 97, '+1,000 cash', { size: 12, weight: 700, cls: 'lw-t-paper' })) + A('a-drop', 0.3, box(245, 76, 100, 32, 'lw-red', 6) + T(295, 97, '+1,000 loan', { size: 12, weight: 700, cls: 'lw-t-paper' })); } },
      { c: 'It buys a laptop for 600 cash. Cash goes down 600, equipment goes up 600. Assets just change shape, so the scale stays level.', g: 'Buy a 600 laptop: cash −600, laptop +600. Still balanced.',
        s: function () { return scale(0) + box(55, 112, 100, 34, 'lw-note', 6) + T(105, 134, 'Cash 5,400', { size: 12, weight: 700, cls: 'lw-t-paper' }) + box(55, 76, 100, 32, 'lw-ink', 6) + A('a-pop', 0.4, T(105, 97, 'Laptop 600', { size: 12, weight: 700, cls: 'lw-t-paper' })) +
          box(245, 112, 100, 34, 'lw-gold', 6) + T(295, 134, 'Equity 5,000', { size: 12, weight: 700, cls: 'lw-t-paper' }) + box(245, 76, 100, 32, 'lw-red', 6) + T(295, 97, 'Loan 1,000', { size: 12, weight: 700, cls: 'lw-t-paper' }) +
          A('a-pop', 0.8, T(105, 60, '6,000', { size: 14, weight: 800 }) + T(295, 60, '6,000', { size: 14, weight: 800 })); } },
      { c: 'Every transaction touches at least two accounts, one debit and one credit. That\'s why the balance sheet always balances, and why mistakes are easy to spot.', g: 'Debit on one side, credit on the other. Always. That\'s the whole trick.',
        s: function () { function tacc(x, name, l, r, d) { return A('a-up', d, '<line x1="' + x + '" y1="70" x2="' + (x + 150) + '" y2="70" class="lw-stroke-ink" stroke-width="2"/><line x1="' + (x + 75) + '" y1="70" x2="' + (x + 75) + '" y2="180" class="lw-stroke-ink" stroke-width="2"/>' +
            T(x + 75, 60, name, { size: 13, weight: 700 }) + T(x + 37, 92, 'Debit', { size: 10, cls: 'lw-t-muted' }) + T(x + 112, 92, 'Credit', { size: 10, cls: 'lw-t-muted' }) + T(x + 37, 120, l, { size: 13, weight: 700 }) + T(x + 112, 120, r, { size: 13, weight: 700 })); }
          return tacc(30, 'Cash', '1,000', '', 0) + tacc(220, 'Bank loan', '', '1,000', 0.4) + arrow(110, 140, 290, 140, 'lw-stroke-gold') + A('a-fade', 1, T(200, 215, 'Borrowing 1,000 = one debit + one credit', { size: 12, cls: 'lw-t-muted' })); } }
    ]
  },
  {
    id: 'bonds', area: 'fin', title: 'Bond prices and interest rates',
    def: 'When interest rates rise, the price of existing bonds falls, and when rates fall, bond prices rise. They move like a seesaw.',
    defGz: 'Rates up → old bonds down. Rates down → old bonds up. Seesaw.',
    who: 'Follows from the time value of money. Frederick Macaulay\'s "duration" (1938) measures how strongly a bond\'s price reacts.',
    real: ['The 2022 bond market slump as rates jumped', 'Why banks with long bonds struggled in 2023', 'Why pension funds watch central banks closely'],
    topic: 'markets',
    slides: [
      { c: 'You own a bond that pays 5% a year on 1,000. That\'s 50 a year. Market rates are also 5%, so it sells for 1,000.', g: 'Your bond pays 5%. Market pays 5%. Price: 1,000.',
        s: function () { return A('a-pop', 0, box(130, 40, 140, 70, 'lw-goldsoft lw-outline', 6) + T(200, 66, 'BOND', { size: 12, weight: 800, cls: 'lw-t-gold' }) + T(200, 92, 'pays 5% a year', { size: 13, weight: 700 })) + seesaw(0, '5%', '1,000'); } },
      { c: 'Rates rise to 7%. New bonds pay more, so nobody wants your 5% bond at full price. Its price falls to make it competitive.', g: 'Rates jump to 7%. Your 5% bond is less attractive, so its price drops.',
        s: function () { return A('a-pop', 0, box(150, 30, 100, 40, 'lw-goldsoft lw-outline', 6) + T(200, 56, 'New: 7%', { size: 14, weight: 800 })) + seesaw(12, '7% ▲', '≈ 920 ▼'); } },
      { c: 'If rates fall to 3% instead, your 5% bond is the better deal, and its price rises above 1,000.', g: 'Rates drop to 3%? Your 5% bond is now the cool kid. Price up.',
        s: function () { return A('a-pop', 0, box(150, 30, 100, 40, 'lw-goldsoft lw-outline', 6) + T(200, 56, 'New: 3%', { size: 14, weight: 800 })) + seesaw(-12, '3% ▼', '≈ 1,090 ▲'); } },
      { c: 'The longer until a bond is repaid, the bigger the swing. That\'s why long-term bonds lost so much when rates jumped in 2022.', g: 'Long bonds swing way harder. 2022 proved it.',
        s: function () { return A('a-up', 0, T(110, 50, '2-year bond', { size: 13, weight: 700 }) + mini(110, 140, 5)) + A('a-up', 0.3, T(290, 50, '30-year bond', { size: 13, weight: 700 }) + mini(290, 140, 18)) +
          A('a-fade', 0.9, T(200, 215, 'Same rate rise, very different price drop', { size: 12, cls: 'lw-t-muted' })); } }
    ]
  },
  {
    id: 'leverage', area: 'fin', title: 'Leverage',
    def: 'Using borrowed money to invest multiplies your gains, and your losses.',
    defGz: 'Borrowed money = bigger wins AND bigger losses.',
    who: 'As old as lending itself. Modigliani and Miller (1958) showed how debt changes the risk owners carry. Excess leverage was at the heart of the 2008 crisis.',
    real: ['Mortgages: a 10% deposit is 10x leverage', 'Banks funding loans with deposits', 'Margin trading on stock apps'],
    topic: 'risk',
    slides: [
      { c: 'You invest 100 of your own money. The investment rises 10% to 110. You made 10%.', g: 'Your own 100 → up 10% → you made 10%.',
        s: function () { return stack(80, 180, 5, 'lw-note', 0) + T(80, 205, 'yours: 100', { size: 11, weight: 700 }) + arrow(120, 140, 175, 140) +
          A('a-grow', 0.4, box(190, 90, 60, 90, 'lw-ink', 6)) + T(220, 205, 'investment', { size: 11, cls: 'lw-t-muted' }) + A('a-pop', 0.9, box(280, 70, 100, 40, 'lw-green', 6) + T(330, 96, '+10%', { size: 18, weight: 800, cls: 'lw-t-paper' })); } },
      { c: 'Now you also borrow 400 and invest 500. The investment rises 10% to 550. You repay the 400 and keep 150: a 50% gain on your money.', g: 'Borrow 400, invest 500. Up 10%? You made 50%. Big.',
        s: function () { return stack(60, 180, 5, 'lw-note', 0) + stack(100, 180, 20, 'lw-red', 0.2) + T(80, 205, 'yours 100 + loan 400', { size: 10, weight: 700 }) + arrow(130, 120, 175, 120) +
          A('a-grow', 0.5, box(190, 40, 80, 140, 'lw-ink', 6)) + A('a-pop', 1, box(285, 70, 100, 40, 'lw-green', 6) + T(335, 96, '+50%', { size: 18, weight: 800, cls: 'lw-t-paper' })); } },
      { c: 'But if the investment falls 20% to 400, you still owe 400. Your 100 is completely wiped out.', g: 'Down 20%? You still owe 400. Your 100: gone.',
        s: function () { return '<rect x="190" y="40" width="80" height="140" rx="6" class="lw-stroke-muted" stroke-width="1.5" stroke-dasharray="5 4" fill="none"/>' + A('a-grow', 0.2, box(190, 68, 80, 112, 'lw-ink', 6)) + T(230, 62, 'was 500', { size: 10, cls: 'lw-t-muted' }) + T(230, 205, 'now worth 400', { size: 11, cls: 'lw-t-muted' }) +
          stack(80, 180, 20, 'lw-red', 0.1) + T(80, 205, 'still owe 400', { size: 10, weight: 700 }) + A('a-pop', 1, box(285, 70, 100, 40, 'lw-red', 6) + T(335, 96, '−100%', { size: 18, weight: 800, cls: 'lw-t-paper' })); } },
      { c: 'Leverage makes good times better and bad times much worse. Too much of it at banks and households helped cause the 2008 crisis.', g: 'Great when it works, brutal when it doesn\'t. See: 2008.',
        s: function () { return '<line x1="50" y1="120" x2="350" y2="120" class="lw-stroke-ink" stroke-width="1.5"/>' + T(125, 40, 'No borrowing', { size: 12, weight: 700 }) + T(275, 40, 'With 4x borrowing', { size: 12, weight: 700 }) +
          bar(90, 120, 30, 10, 'lw-green', 0.2, '', '+10%') + bar(130, 120, 30, -20, 'lw-red', 0.4, '', '−20%') + bar(240, 120, 30, 50, 'lw-green', 0.6, '', '+50%') + bar(280, 120, 30, -90, 'lw-red', 0.8, '', '−100%') +
          '<line x1="200" y1="50" x2="200" y2="225" class="lw-stroke-muted" stroke-width="1" stroke-dasharray="4 4"/>'; } }
    ]
  },
  {
    id: 'liquidity', area: 'fin', title: 'Liquidity vs solvency',
    def: 'Liquidity is having cash to pay bills now. Solvency is owning more than you owe overall. A firm can have one without the other.',
    defGz: 'Liquid = can pay today. Solvent = owns more than it owes. Not the same thing!',
    who: 'Walter Bagehot\'s Lombard Street (1873) explained why central banks should lend to solvent banks that run short of cash, but not to insolvent ones.',
    real: ['Bank runs on healthy banks', 'A farmer with land but no cash before harvest', 'Companies that look rich but owe too much'],
    topic: 'banking',
    slides: [
      { c: 'Firm A owns valuable buildings worth 10 million but has little cash. A 50,000 bill is due tomorrow. It\'s solvent but illiquid.', g: 'Firm A: rich in buildings, broke in cash. Solvent but illiquid.',
        s: function () { return A('a-up', 0, building(50, 60, 120, 140, 'Buildings: 10M', 'lw-note')) + A('a-pop', 0.4, coin(230, 180, 14, '', 'lw-gold')) + T(230, 212, 'cash: 5k', { size: 11, cls: 'lw-t-muted' }) +
          A('a-pop', 0.7, box(260, 60, 120, 50, 'lw-paper lw-outline', 6) + T(320, 82, 'Bill due', { size: 11, cls: 'lw-t-muted' }) + T(320, 100, '50,000', { size: 15, weight: 800 })) + A('a-shake', 1.1, cross(320, 140)); } },
      { c: 'Firm B has plenty of cash today, but it owes 3 million and owns only 2 million. It can pay this week\'s bills, but it\'s insolvent.', g: 'Firm B: cash today, but owes more than it owns. Insolvent.',
        s: function () { var c = ''; for (var i = 0; i < 6; i++) c += A('a-pop', i * 0.08, coin(60 + (i % 3) * 30, 150 - Math.floor(i / 3) * 26, 13, '', 'lw-gold'));
          return c + T(90, 205, 'cash on hand', { size: 11, cls: 'lw-t-muted' }) + '<line x1="200" y1="190" x2="370" y2="190" class="lw-stroke-ink" stroke-width="1.5"/>' +
            bar(220, 190, 50, 80, 'lw-note', 0.5, 'owns', '2M') + bar(300, 190, 50, 120, 'lw-red', 0.8, 'owes', '3M'); } },
      { c: 'Banks face this daily. If everyone withdraws at once, even a healthy bank runs out of cash. The central bank lends to it to stop the panic.', g: 'Bank run: everyone wants cash NOW. Central bank steps in with a loan.',
        s: function () { var q = ''; for (var i = 0; i < 5; i++) q += A('a-slide', i * 0.12, person(40 + i * 30, 200, 'lw-note'));
          return q + A('a-up', 0.2, building(210, 90, 90, 110, 'Bank', 'lw-ink')) + A('a-pop', 0.9, box(310, 30, 80, 40, 'lw-gold', 6) + T(350, 55, 'Central bank', { size: 10, weight: 800, cls: 'lw-t-paper' })) + arrow(340, 75, 290, 110, 'lw-stroke-gold'); } },
      { c: 'Healthy firms need both. Short of cash but solvent? A short loan fixes it. Insolvent? More loans only delay the end.', g: 'Need both. Cash problem = loan helps. Owe-too-much problem = loans just delay it.',
        s: function () { var cells = [['Liquid + solvent', 'Healthy', 'lw-green'], ['Illiquid + solvent', 'Needs a short loan', 'lw-goldsoft'], ['Liquid + insolvent', 'Trouble is coming', 'lw-goldsoft'], ['Illiquid + insolvent', 'Failing', 'lw-red']];
          return cells.map(function (c, i) { var x = 40 + (i % 2) * 165, y = 30 + Math.floor(i / 2) * 95; return A('a-pop', i * 0.2, box(x, y, 155, 85, c[2] + ' lw-outline', 10) + T(x + 77, y + 36, c[0], { size: 12, weight: 700, cls: c[2] === 'lw-red' || c[2] === 'lw-green' ? 'lw-t-paper' : '' }) + T(x + 77, y + 58, c[1], { size: 11, cls: c[2] === 'lw-red' || c[2] === 'lw-green' ? 'lw-t-paper' : 'lw-t-muted' })); }).join(''); } }
    ]
  },
  {
    id: 'moralhazard', area: 'fin', title: 'Moral hazard',
    def: 'When someone is protected from the cost of a risk, they tend to take more of it.',
    defGz: 'If someone else pays when it goes wrong, you get a bit reckless.',
    who: 'An old insurance term, analysed by Kenneth Arrow (1963) and Bengt Holmström (1979). Central to debates after the 2008 bank bailouts.',
    real: ['Fully insured drivers taking more risks', 'Banks seen as "too big to fail"', 'Bonuses for short-term gains with no penalty for losses'],
    topic: 'banking', paper: { t: 'Arrow (1963), Uncertainty and the Welfare Economics of Medical Care, AER', u: 'https://www.jstor.org/stable/1812044' },
    slides: [
      { c: 'Without insurance, a driver pays for any crash herself, so she drives carefully.', g: 'No insurance: every scratch costs YOU. So you drive carefully.',
        s: function () { return road() + A('a-drive-slow', 0, car(60, 160, 'lw-note')) + A('a-pop', 0.5, box(270, 40, 110, 44, 'lw-paper lw-outline', 8) + T(325, 60, 'Speed', { size: 11, cls: 'lw-t-muted' }) + T(325, 76, '50 km/h', { size: 14, weight: 800 })); } },
      { c: 'With full insurance, the insurer pays for crashes. She starts driving faster and parking anywhere. The risk has shifted to someone else.', g: 'Full insurance: someone else pays. Suddenly speeding feels fine.',
        s: function () { return road() + A('a-drive-fast', 0, car(60, 160, 'lw-note')) + A('a-pop', 0.2, '<path d="M200 40 l30 10 v20 q0 22 -30 32 q-30 -10 -30 -32 v-20 z" class="lw-gold"/>' + T(200, 75, 'insured', { size: 9, weight: 800, cls: 'lw-t-paper' })) +
          A('a-pop', 0.5, box(270, 40, 110, 44, 'lw-paper lw-outline', 8) + T(325, 60, 'Speed', { size: 11, cls: 'lw-t-muted' }) + T(325, 76, '90 km/h', { size: 14, weight: 800, cls: 'lw-t-red' })); } },
      { c: 'Insurers fight back: you pay the first 500 of any claim (a deductible), and careful drivers get a discount. Some risk is back on the driver.', g: 'Insurers: "you pay the first 500" + discounts for careful driving. Balance restored.',
        s: function () { return road() + A('a-drive-slow', 0, car(60, 160, 'lw-note')) + A('a-pop', 0.3, box(40, 30, 150, 40, 'lw-goldsoft lw-outline', 6) + T(115, 55, 'You pay first 500', { size: 12, weight: 700 })) +
          A('a-pop', 0.6, box(210, 30, 150, 40, 'lw-soft lw-outline', 6) + T(285, 55, 'Careful = discount', { size: 12, weight: 700 })); } },
      { c: 'The same happens in finance. If big banks expect a bailout when bets go wrong, they may take bigger risks. That\'s the "too big to fail" problem.', g: '"Too big to fail" banks know they\'ll be saved. So they gamble bigger.',
        s: function () { return '<line x1="30" y1="90" x2="370" y2="90" class="lw-stroke-ink" stroke-width="2"/>' + A('a-sway', 0, building(185, 30, 34, 52, '', 'lw-ink') + T(202, 26, 'Bank', { size: 11, weight: 700 })) +
          A('a-up', 0.5, '<path d="M60 170 q140 50 280 0" class="lw-stroke-gold" stroke-width="3" fill="none"/><path d="M60 170 l0 -20 M130 186 l0 -20 M200 193 l0 -20 M270 186 l0 -20 M340 170 l0 -20" class="lw-stroke-gold" stroke-width="2"/>' + T(200, 222, 'Bailout safety net', { size: 12, weight: 700, cls: 'lw-t-gold' })); } }
    ]
  }
  ];

  /* scene helpers that need the blocks above */
  function timeline() { return '<line x1="40" y1="130" x2="360" y2="130" class="lw-stroke-ink" stroke-width="2"/>' + ['March', 'April', 'May'].map(function (m, i) { return '<circle cx="' + (80 + i * 120) + '" cy="130" r="5" class="lw-ink"/>' + T(80 + i * 120, 124, m, { size: 11, weight: 700 }); }).join(''); }
  function scale(tilt) {
    return '<g transform="rotate(' + tilt + ' 200 150)"><line x1="70" y1="150" x2="330" y2="150" class="lw-stroke-ink" stroke-width="4" stroke-linecap="round"/></g>' +
      '<path d="M200 150 l-18 55 h36 z" class="lw-ink"/>' + T(105, 176, 'Assets', { size: 12, weight: 700 }) + T(295, 176, 'Liabilities + Equity', { size: 12, weight: 700 }) + T(200, 30, 'Assets = Liabilities + Equity', { size: 13, weight: 800, cls: 'lw-t-gold' });
  }
  function seesaw(tilt, left, right) {
    return '<path d="M200 200 l-20 28 h40 z" class="lw-ink"/>' +
      '<g class="lw-tilt" style="--tilt:' + tilt + 'deg"><line x1="60" y1="200" x2="340" y2="200" class="lw-stroke-ink" stroke-width="5" stroke-linecap="round"/>' +
      box(40, 158, 100, 36, 'lw-note', 8) + T(90, 172, 'Interest rate', { size: 9, cls: 'lw-t-paper' }) + T(90, 188, left, { size: 13, weight: 800, cls: 'lw-t-paper' }) +
      box(260, 158, 100, 36, 'lw-gold', 8) + T(310, 172, 'Bond price', { size: 9, cls: 'lw-t-paper' }) + T(310, 188, right, { size: 13, weight: 800, cls: 'lw-t-paper' }) + '</g>';
  }
  function mini(x, y, tilt) {
    return '<path d="M' + x + ' ' + (y + 10) + ' l-10 16 h20 z" class="lw-ink"/><g class="lw-tilt" style="--tilt:' + tilt + 'deg;transform-origin:' + x + 'px ' + (y + 10) + 'px"><line x1="' + (x - 70) + '" y1="' + (y + 10) + '" x2="' + (x + 70) + '" y2="' + (y + 10) + '" class="lw-stroke-ink" stroke-width="4" stroke-linecap="round"/>' +
      box(x + 30, y - 14, 44, 22, 'lw-gold', 5) + T(x + 52, y + 1, 'price', { size: 9, cls: 'lw-t-paper', weight: 700 }) + '</g>';
  }
  function stack(x, base, n, cls, d) { var s = ''; for (var i = 0; i < n; i++) s += '<rect x="' + (x - 18) + '" y="' + (base - (i + 1) * 5) + '" width="36" height="4" rx="1.5" class="' + cls + '"/>'; return A('a-grow', d, s); }
  function road() { return '<rect x="0" y="150" width="400" height="60" class="lw-ink"/><path d="M0 180 h400" class="lw-stroke-paper" stroke-width="2" stroke-dasharray="18 14"/>'; }
  function car(x, y, cls) { return '<g transform="translate(' + x + ' ' + y + ')"><rect x="0" y="-6" width="70" height="20" rx="6" class="' + cls + '"/><path d="M14 -6 l10 -14 h24 l10 14 z" class="' + cls + '"/><path d="M27 -17 h18 l7 10 h-31 z" class="lw-paper" opacity=".85"/><circle cx="16" cy="16" r="7" class="lw-ink lw-wheel"/><circle cx="54" cy="16" r="7" class="lw-ink lw-wheel"/></g>'; }

  /* ---------- rendering ---------- */
  var BY = {}; LAWS.forEach(function (l) { BY[l.id] = l; });
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function svg(inner, still) { return '<svg class="lw-svg' + (still ? ' still' : '') + '" viewBox="0 0 400 240" role="img">' + inner + '</svg>'; }
  var current = { id: null, i: 0, timer: 0, playing: false };

  function renderList(el, ctx) {
    var L = ctx.L, html = '<div class="section-head" style="margin-top:8px"><div><span class="eyebrow">' + esc(L('Laws & principles', 'Laws & principles')) + '</span>' +
      '<h1 style="font-size:clamp(34px,5vw,56px);font-weight:800;letter-spacing:-.035em;margin-top:8px">' + esc(L('The rules of the game', 'The rules of the game')) + '</h1>' +
      '<p>' + esc(L('The laws and principles every economics and finance student should know, each told as a short picture story. Click or swipe through the scenes.', 'The big laws of econ and finance as mini picture stories. Tap or swipe through.')) + '</p></div></div>';
    [['econ', L('Economics', 'Economics')], ['fin', L('Finance', 'Finance')]].forEach(function (a) {
      html += '<div class="area"><div class="area-head"><h2>' + esc(a[1]) + '</h2></div><div class="lw-grid">';
      LAWS.filter(function (l) { return l.area === a[0]; }).forEach(function (l) {
        html += '<a class="lw-card" href="#law-' + l.id + '"><div class="lw-thumb">' + svg(l.slides[0].s(), true) + '</div><div class="lw-cardbody"><h3>' + esc(l.title) + '</h3><p>' + esc(L(l.def, l.defGz)) + '</p><span class="lw-count">' + l.slides.length + ' ' + esc(L('scenes', 'scenes')) + ' →</span></div></a>';
      });
      html += '</div></div>';
    });
    el.innerHTML = html;
  }

  function renderLaw(el, id, ctx) {
    var l = BY[id], L = ctx.L; if (!l) { location.hash = '#laws'; return; }
    stopPlay();
    current.id = id; current.i = 0;
    var area = l.area === 'econ' ? L('Economics', 'Economics') : L('Finance', 'Finance');
    var idx = LAWS.indexOf(l), prev = LAWS[(idx - 1 + LAWS.length) % LAWS.length], next = LAWS[(idx + 1) % LAWS.length];
    var topic = ctx.topics[l.topic];
    el.innerHTML = '<div class="crumbs"><a href="#laws">' + esc(L('Laws', 'Laws')) + '</a><span>/</span><span>' + esc(area) + '</span></div>' +
      '<h1 class="lw-title">' + esc(l.title) + '</h1><p class="tldr lw-def">' + esc(L(l.def, l.defGz)) + '</p>' +
      '<div class="lw-story">' +
        '<div class="lw-stage-wrap"><div class="lw-stage" id="lwStage" tabindex="0" aria-roledescription="slideshow" aria-label="' + esc(l.title) + '"></div>' +
          '<div class="lw-caption" id="lwCaption" aria-live="polite"></div>' +
          '<div class="lw-controls"><button type="button" class="btn" id="lwPrev">← ' + esc(L('Back', 'Back')) + '</button>' +
            '<div class="lw-dots" id="lwDots">' + l.slides.map(function (s, i) { return '<button type="button" class="lw-dot" data-i="' + i + '" aria-label="' + esc(L('Scene', 'Scene')) + ' ' + (i + 1) + '"></button>'; }).join('') + '</div>' +
            '<button type="button" class="btn" id="lwPlay" aria-pressed="false">▶ ' + esc(L('Play', 'Play')) + '</button>' +
            '<button type="button" class="btn primary" id="lwNext">' + esc(L('Next', 'Next')) + ' →</button></div></div>' +
        '<aside class="lw-side">' +
          '<div class="panel"><span class="eyebrow">' + esc(L('Where it comes from', 'The origin story')) + '</span><p>' + esc(l.who) + '</p></div>' +
          '<div class="panel"><span class="eyebrow">' + esc(L('In real life', 'IRL')) + '</span><ul class="lw-real">' + l.real.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="panel"><span class="eyebrow">' + esc(L('Go deeper', 'Go deeper')) + '</span>' +
            (topic ? '<a class="link-btn" href="#topic-' + l.topic + '">' + esc(L('Topic', 'Topic')) + ': ' + esc(topic.title) + ' →</a>' : '') +
            (l.paper ? '<a class="link-btn" href="' + esc(l.paper.u) + '" target="_blank" rel="noopener">' + esc(l.paper.t) + ' ↗</a>' : '') + '</div>' +
        '</aside></div>' +
      '<div class="lw-nav"><a class="btn" href="#law-' + prev.id + '">← ' + esc(prev.title) + '</a><a class="btn" href="#law-' + next.id + '">' + esc(next.title) + ' →</a></div>';

    var stage = el.querySelector('#lwStage');
    function show(i) {
      current.i = (i + l.slides.length) % l.slides.length;
      var s = l.slides[current.i];
      stage.innerHTML = svg(s.s()) + '<span class="lw-step">' + (current.i + 1) + ' / ' + l.slides.length + '</span>';
      el.querySelector('#lwCaption').textContent = L(s.c, s.g);
      Array.prototype.forEach.call(el.querySelectorAll('.lw-dot'), function (d, k) { d.setAttribute('aria-current', String(k === current.i)); });
      el.querySelector('#lwPrev').disabled = current.i === 0 && !current.playing;
      el.querySelector('#lwNext').textContent = current.i === l.slides.length - 1 ? L('Start again', 'Again') + ' ↺' : L('Next', 'Next') + ' →';
      try { document.dispatchEvent(new CustomEvent('ih:chain', { detail: { idx: current.i, n: 9999, id: 'law-' + l.id, title: l.title, first: '1', last: String(l.slides.length) } })); } catch (e) { /* old browser */ }
    }
    function step(d) { show(current.i + d); }
    el.querySelector('#lwPrev').onclick = function () { stopPlay(); step(-1); };
    el.querySelector('#lwNext').onclick = function () { stopPlay(); step(1); };
    Array.prototype.forEach.call(el.querySelectorAll('.lw-dot'), function (d) { d.onclick = function () { stopPlay(); show(+d.dataset.i); }; });
    el.querySelector('#lwPlay').onclick = function () { if (current.playing) stopPlay(); else startPlay(); };
    stage.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { stopPlay(); step(1); } if (e.key === 'ArrowLeft') { stopPlay(); step(-1); } });
    stage.addEventListener('click', function () { stopPlay(); step(1); });
    // swipe on phones
    var sx = null;
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    stage.addEventListener('pointerup', function (e) { if (sx == null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) { stopPlay(); step(dx < 0 ? 1 : -1); } });
    function startPlay() {
      current.playing = true; var b = el.querySelector('#lwPlay'); b.setAttribute('aria-pressed', 'true'); b.textContent = '❚❚ ' + L('Pause', 'Pause');
      current.timer = setInterval(function () { if (!el.isConnected || el.hidden) { stopPlay(); return; } step(1); }, 5500);
    }
    show(0);
  }
  function stopPlay() {
    clearInterval(current.timer); current.timer = 0; current.playing = false;
    var b = document.getElementById('lwPlay'); if (b) { b.setAttribute('aria-pressed', 'false'); b.textContent = '▶ ' + (b.dataset.play || 'Play'); }
  }

  window.IH_LAWS = { list: LAWS, renderList: renderList, renderLaw: renderLaw, stop: stopPlay };
})();
