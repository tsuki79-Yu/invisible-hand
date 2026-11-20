/* Yu, the study-buddy penguin.
   - Click her: greeting + menu (tour, what to learn next, quiet mode, hide).
   - Tracks ACTIVE study time: only counts seconds when this tab is visible AND the
     student did something (scroll, click, key, mouse, touch) in the last 60 seconds.
   - Reminders: 10 min → practise with a quiz; 25 min → take a break; then every 25 min.
   - Walks slowly along the bottom of the screen now and then, reads along on topic
     and news pages, cheers on quiz answers, falls asleep when the student is away. */
(function () {
  'use strict';

  /* ---------- settings (easy to change) ---------- */
  var IDLE_LIMIT = 60;          // seconds without any activity before time stops counting
  var SLEEP_AFTER = 120;        // seconds idle before Yu dozes off
  var WELCOME_BACK_AFTER = 300; // seconds away before Yu says welcome back
  var FIRST_NUDGE = 10;         // minutes: practise reminder
  var BREAK_EVERY = 25;         // minutes: break reminder (Pomodoro style)

  var IH = window.IH || {};
  function lang() { return IH.lang ? IH.lang() : 'en'; }
  function L(en, gz) { return lang() === 'gz' && gz ? gz : en; }
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mk(store) {
    return {
      get: function (k, d) { try { var v = store().getItem('ih:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
      set: function (k, v) { try { store().setItem('ih:' + k, JSON.stringify(v)); } catch (e) { /* unavailable */ } }
    };
  }
  var ls = mk(function () { return window.localStorage; }), ss = mk(function () { return window.sessionStorage; });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function small() { return window.innerWidth < 700; }

  var TODAY = new Date().toISOString().slice(0, 10);
  var stats = ls.get('yu:stats', null);
  if (!stats || stats.day !== TODAY) stats = { day: TODAY, sec: 0, quizzes: 0, chains: [], topics: [] };
  var prefs = ls.get('yu:prefs', { hidden: false, quiet: false, greeted: false, tourDone: false });
  var session = ss.get('yu:session', { active: 0, shown: {} });
  function save() { ls.set('yu:stats', stats); ls.set('yu:prefs', prefs); ss.set('yu:session', session); }

  /* ---------- the penguin ---------- */
  var SVG = '<svg viewBox="0 0 100 110" aria-hidden="true">' +
    '<defs>' +
      '<radialGradient id="yuG-dark" cx=".35" cy=".28" r=".85"><stop offset="0" stop-color="#4d6168"/><stop offset=".5" stop-color="#1f2c31"/><stop offset="1" stop-color="#10181b"/></radialGradient>' +
      '<radialGradient id="yuG-belly" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f8f4ea"/><stop offset="1" stop-color="#e2dac6"/></radialGradient>' +
      '<radialGradient id="yuG-gold" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd884"/><stop offset=".6" stop-color="#e3a535"/><stop offset="1" stop-color="#b47b1b"/></radialGradient>' +
      '<linearGradient id="yuG-scarf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b8a71"/><stop offset="1" stop-color="#0a4a3d"/></linearGradient>' +
    '</defs>' +
    '<ellipse class="yu-shadowel" cx="50" cy="105" rx="24" ry="3.4"/>' +
    '<g class="yu-body">' +
      '<g class="yu-foot yu-foot-l"><ellipse class="yu-gold" cx="40" cy="101.5" rx="7.5" ry="3.4"/></g>' +
      '<g class="yu-foot yu-foot-r"><ellipse class="yu-gold" cx="60" cy="101.5" rx="7.5" ry="3.4"/></g>' +
      '<g class="yu-flip-l"><ellipse class="yu-dark" cx="23" cy="74" rx="6.5" ry="12.5" transform="rotate(28 23 74)"/></g>' +
      '<g class="yu-flip-r"><ellipse class="yu-dark" cx="77" cy="74" rx="6.5" ry="12.5" transform="rotate(-28 77 74)"/></g>' +
      '<ellipse class="yu-dark" cx="50" cy="78" rx="27" ry="23.5"/>' +
      '<g class="yu-bellywrap"><ellipse class="yu-belly" cx="50" cy="82" rx="18.5" ry="17.5"/></g>' +
      '<g class="yu-tuft"><path class="yu-dark" d="M47 16 C43 7 52 1 58 5 C52 6 50 10 53 16 Z"/></g>' +
      '<ellipse class="yu-neckshade" cx="50" cy="66" rx="24" ry="5"/>' +
      '<circle class="yu-dark" cx="50" cy="42" r="29.5"/>' +
      '<path class="yu-rim" d="M25 33 A28 28 0 0 1 44 13.5"/>' +
      '<g class="yu-face">' +
        '<path class="yu-belly" d="M50 30 C42 21 25.5 25.5 25.5 42 C25.5 56 37.5 64.5 50 64.5 C62.5 64.5 74.5 56 74.5 42 C74.5 25.5 58 21 50 30 Z"/>' +
        '<g class="yu-look"><g class="yu-eyes"><g class="yu-pupils">' +
          '<ellipse class="yu-pupil" cx="40" cy="43" rx="5.6" ry="6.7"/><ellipse class="yu-pupil" cx="60" cy="43" rx="5.6" ry="6.7"/>' +
          '<circle class="yu-shine" cx="42.1" cy="40.3" r="2.3"/><circle class="yu-shine" cx="62.1" cy="40.3" r="2.3"/>' +
          '<circle class="yu-shine" cx="38.2" cy="46.2" r="1.05"/><circle class="yu-shine" cx="58.2" cy="46.2" r="1.05"/>' +
        '</g></g></g>' +
        '<g class="yu-happy"><path class="yu-arc" d="M34.5 45 Q40 37.5 45.5 45"/><path class="yu-arc" d="M54.5 45 Q60 37.5 65.5 45"/></g>' +
        '<ellipse class="yu-blush" cx="31" cy="53" rx="5.2" ry="3.1"/><ellipse class="yu-blush" cx="69" cy="53" rx="5.2" ry="3.1"/>' +
        '<path class="yu-gold" d="M46.3 51 Q50 57.5 53.7 51 Q50 49.3 46.3 51 Z"/>' +
      '</g>' +
      '<path class="yu-gold" d="M71 20.5 l1.7 3.5 3.8 .55 -2.75 2.7 .65 3.8 -3.4 -1.8 -3.4 1.8 .65 -3.8 -2.75 -2.7 3.8 -.55 Z"/>' +
      '<path class="yu-scarf" d="M27.5 63.5 Q50 74.5 72.5 63.5 L72.5 69.5 Q50 80.5 27.5 69.5 Z"/>' +
      '<path class="yu-scarf" d="M60 72 L66 86 L60 88 L56 74 Z"/><rect class="yu-scarf-stripe" x="57.8" y="79" width="6.5" height="2" transform="rotate(-22 61 80)"/>' +
      /* props */
      '<g class="yu-prop yu-book"><path class="yu-cover" d="M28 77 L50 81 L72 77 L72 96 L50 100 L28 96 Z"/>' +
        '<path class="yu-paperfill" d="M30 76 L50 80 L50 97 L30 93 Z"/><path class="yu-paperfill yu-page" d="M50 80 L70 76 L70 93 L50 97 Z"/>' +
        '<rect class="yu-ink" x="33" y="81" width="13" height="1.2" transform="rotate(11 33 81)"/><rect class="yu-ink" x="33" y="85" width="13" height="1.2" transform="rotate(11 33 85)"/><rect class="yu-ink" x="33" y="89" width="9" height="1.2" transform="rotate(11 33 89)"/></g>' +
      '<g class="yu-prop yu-paper"><rect class="yu-paperfill" x="27" y="74" width="46" height="26" rx="1.5"/><rect class="yu-ink" x="31" y="78" width="38" height="3.2"/>' +
        '<rect class="yu-ink" x="31" y="84" width="17" height="1.2"/><rect class="yu-ink" x="31" y="87" width="17" height="1.2"/><rect class="yu-ink" x="31" y="90" width="17" height="1.2"/><rect class="yu-ink" x="31" y="93" width="12" height="1.2"/>' +
        '<rect class="yu-cover" x="52" y="84" width="17" height="11" rx="1"/></g>' +
      '<g class="yu-prop yu-letter"><rect class="yu-paperfill" x="29" y="75" width="42" height="25" rx="1.5"/><path class="yu-envflap" d="M29.5 76 L50 89 L70.5 76"/><g class="yu-seal" transform="translate(50 89.5) scale(.36) translate(-16 -16)"><circle class="yu-seal-bg" cx="16" cy="16" r="16"/><g class="yu-seal-lines"><circle cx="16" cy="16" r="14.5"/><ellipse cx="16" cy="16" rx="11" ry="4.2"/><ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(30 16 16)"/><ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(90 16 16)"/><ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(120 16 16)"/><ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(150 16 16)"/></g><circle class="yu-seal-dot" cx="16" cy="16" r="2.2"/></g></g>' +
      '<g class="yu-prop yu-popcorn"><circle class="yu-belly" cx="40" cy="80" r="4"/><circle class="yu-belly" cx="47" cy="77" r="4.5"/><circle class="yu-belly" cx="54" cy="78" r="4"/><circle class="yu-belly" cx="60" cy="81" r="3.6"/>' +
        '<path class="yu-paperfill" d="M35 82 L65 82 L61.5 101 L38.5 101 Z"/><path class="yu-gold" d="M41 82 L45 82 L45 101 L42.5 101 Z M50 82 L54 82 L53.6 101 L50.6 101 Z M59 82 L63 82 L60.3 101 L58 101 Z"/></g>' +
    '</g>' +
    '<g class="yu-think"><text class="yu-qmark" x="80" y="18">?</text></g>' +
    '<g class="yu-zz"><text class="yu-text" x="74" y="20">z</text><text class="yu-text" x="82" y="10">z</text></g>' +
    '<g class="yu-spark"><path class="yu-gold" d="M10 26 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z"/><path class="yu-gold" d="M88 36 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z"/><path class="yu-blush" d="M86 60 c-2 -3 -6 -1 -4 2 l4 4 4 -4 c2 -3 -2 -5 -4 -2 Z"/></g>' +
  '</svg>';

  var root = document.createElement('div');
  root.id = 'yu-root';
  root.innerHTML = '<div id="yu-ring" hidden></div>' +
    '<div id="yu-bubble" role="status" aria-live="polite" hidden></div>' +
    '<button id="yu" type="button" aria-label="Yu, your study buddy. Open menu" data-pose="idle"><div class="yu-flipwrap">' + SVG + '</div></button>' +
    '<button id="yu-peek" type="button" hidden aria-label="Bring Yu back">' + SVG + '<span>Yu</span></button>';
  document.body.appendChild(root);
  var yu = $('#yu'), bubble = $('#yu-bubble'), ring = $('#yu-ring'), peek = $('#yu-peek');

  /* ---------- position & walking ---------- */
  var x = 0, walkTimer = 0, lastWalk = Date.now();
  function width() { return yu.offsetWidth || 76; }
  function maxX() { return Math.max(16, window.innerWidth - width() - 16); }
  var faceTimer = 0;
  function face(dir) { clearTimeout(faceTimer); if (dir) yu.dataset.face = dir; else delete yu.dataset.face; }
  function setX(v) { yu.style.setProperty('--yu-x', v.toFixed(1) + 'px'); }
  var walkLoop = 0;
  function stopWalk() { cancelAnimationFrame(walkLoop); walkLoop = 0; }
  function endWalk() {
    stopWalk();
    yu.classList.remove('walking');
    ['--rock', '--bob', '--lift-l', '--lift-r', '--tilt'].forEach(function (v) { yu.style.removeProperty(v); });
    positionBubble();
    faceTimer = setTimeout(function () { face(''); }, 700); // turn back to face you
  }
  // A penguin walk: she only moves forward while a foot is stepping, and rocks over each foot.
  function startWalk(target, dir) {
    stopWalk();
    var STEP_MS = 440, STRIDE = 9;                     // ~20 px a second: calm
    var startX = x, total = Math.abs(target - startX);
    var steps = Math.max(1, Math.round(total / STRIDE)), stride = total / steps, t0 = performance.now();
    yu.style.transitionDuration = '0s';
    yu.classList.add('walking');
    function frame(now) {
      var t = (now - t0) / STEP_MS, n = Math.floor(t), p = t - n;
      if (n >= steps) { x = target; setX(x); endWalk(); return; }
      var ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;  // each step speeds up then settles
      x = startX + dir * stride * (n + ease); setX(x);
      var side = n % 2 === 0 ? 1 : -1, arc = Math.sin(p * Math.PI);  // which foot, and how high in the step
      yu.style.setProperty('--rock', (side * 6 * arc).toFixed(2) + 'deg');   // waddle over the standing foot
      yu.style.setProperty('--bob', (-2.6 * arc).toFixed(2) + 'px');
      yu.style.setProperty('--lift-l', (side > 0 ? -3.4 * arc : 0).toFixed(2) + 'px');
      yu.style.setProperty('--lift-r', (side < 0 ? -3.4 * arc : 0).toFixed(2) + 'px');
      positionBubble();
      walkLoop = requestAnimationFrame(frame);
    }
    walkLoop = requestAnimationFrame(frame);
  }
  // No walking: Yu ducks down and pops back up where she needs to be.
  function place(nx, animate) {
    nx = Math.max(16, Math.min(maxX(), nx));
    clearTimeout(walkTimer); stopWalk(); yu.classList.remove('walking'); face('');
    yu.style.transitionDuration = '0s';
    if (!animate || reduce || Math.abs(nx - x) < 4) { x = nx; setX(x); positionBubble(); return; }
    yu.classList.remove('yu-in'); yu.classList.add('yu-out');
    walkTimer = setTimeout(function () {
      x = nx; setX(x);
      yu.classList.remove('yu-out'); void yu.offsetWidth; yu.classList.add('yu-in');
      positionBubble();
      walkTimer = setTimeout(function () { yu.classList.remove('yu-in'); positionBubble(); }, 600);
    }, 300);
    lastWalk = Date.now();
  }
  function home() { return maxX(); }
  place(home(), false);
  window.addEventListener('resize', function () { if (x > maxX()) place(maxX(), false); positionBubble(); placeRing(); });


  /* ---------- eyes follow the pointer, gently ---------- */
  var lookRAF = 0;
  window.addEventListener('pointermove', function (e) {
    if (reduce || lookRAF) return;
    lookRAF = requestAnimationFrame(function () {
      lookRAF = 0;
      var r = yu.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;
      var dx = e.clientX - cx, dy = e.clientY - cy, d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      var k = Math.min(1, d / 300);
      yu.style.setProperty('--lx', (dx / d * 2.2 * k).toFixed(2) + 'px');
      yu.style.setProperty('--ly', (dy / d * 1.6 * k).toFixed(2) + 'px');
    });
  }, { passive: true });

  /* ---------- poses ---------- */
  var basePose = 'idle', poseTimer = 0;
  function setPose(p) { yu.dataset.pose = p; }
  function flash(p, ms) { clearTimeout(poseTimer); setPose(p); poseTimer = setTimeout(function () { setPose(sleeping ? 'sleep' : basePose); }, ms || 1300); }
  function poseFor(view) { return { news: 'paper', topic: 'read', library: 'read', films: 'popcorn' }[view] || 'idle'; }
  (function () { var h = location.hash.slice(1); basePose = poseFor(h.indexOf('topic-') === 0 ? 'topic' : h); setPose(basePose); })();

  /* ---------- speech bubble ---------- */
  var bubbleTimer = 0, bubbleKind = '';
  function say(html, opts) {
    opts = opts || {};
    clearTimeout(bubbleTimer);
    bubbleKind = opts.kind || 'note';
    var acts = (opts.actions || []).map(function (a, i) { return '<button type="button" data-act="' + i + '"' + (a.primary ? ' class="primary"' : '') + '>' + esc(a.label) + '</button>'; }).join('');
    bubble.innerHTML = '<div class="yu-name"><span>Yu</span>' + (opts.progress ? '<span class="yu-progress">' + esc(opts.progress) + '</span>' : '') + '<button type="button" class="yu-close" aria-label="Close">×</button></div>' +
      '<p>' + html + '</p>' + (opts.extra || '') + (acts ? '<div class="yu-actions">' + acts + '</div>' : '');
    bubble.classList.toggle('wide', !!opts.wide);
    bubble.hidden = false;
    bubble.querySelector('.yu-close').onclick = function () { if (touring) endTour(true); else hideBubble(); };
    (opts.actions || []).forEach(function (a, i) { bubble.querySelector('[data-act="' + i + '"]').onclick = a.fn; });
    positionBubble();
    if (!opts.sticky) bubbleTimer = setTimeout(hideBubble, opts.timeout || 9000);
  }
  function hideBubble() { bubble.hidden = true; bubbleKind = ''; }
  function positionBubble() {
    if (bubble.hidden) return;
    var bw = bubble.offsetWidth, cx = x + width() / 2;
    var left = Math.max(16, Math.min(window.innerWidth - bw - 16, cx - bw * 0.75));
    bubble.style.left = left + 'px';
    bubble.style.setProperty('--tail', Math.max(16, Math.min(bw - 16, cx - left)) + 'px');
  }

  /* ---------- active time ---------- */
  var lastAct = Date.now(), sleeping = false, awayStart = 0;
  function activity() {
    var now = Date.now();
    if (sleeping) wake(now - awayStart);
    lastAct = now;
  }
  ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'wheel'].forEach(function (ev) { window.addEventListener(ev, activity, { passive: true }); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') activity(); });

  function fmtMin(sec) { var m = Math.floor(sec / 60); return m < 1 ? L('under a minute', 'not even a minute') : m + ' min'; }
  var tickN = 0;
  setInterval(function () {
    var now = Date.now(), idle = (now - lastAct) / 1000;
    if (document.visibilityState === 'visible' && idle < IDLE_LIMIT) {
      session.active++; stats.sec++;
      if (++tickN % 10 === 0) save();
      checkReminders();
    }
    if (idle > SLEEP_AFTER && !sleeping && bubble.hidden && !touring) { sleeping = true; awayStart = lastAct; setPose('sleep'); }
    
  }, 1000);

  function wake(awayMs) {
    sleeping = false;
    setPose(basePose);
    flash('wave', 1200);
    if (awayMs / 1000 > WELCOME_BACK_AFTER && !prefs.quiet) {
      say(L('Welcome back! You\'ve studied <b>' + fmtMin(session.active) + '</b> so far this visit. Pick up where you left off?', 'You\'re back! <b>' + fmtMin(session.active) + '</b> locked in this visit. Let\'s keep going.'));
    }
  }

  function checkReminders() {
    if (prefs.quiet || touring) return;
    var m = Math.floor(session.active / 60);
    if (session.active % 60 !== 0 || session.shown[m]) return;
    var msg = null;
    if (m === FIRST_NUDGE) msg = practiceNudge(m);
    else if (m > 0 && m % BREAK_EVERY === 0) msg = (m / BREAK_EVERY) % 2 === 1 ? breakNudge(m) : explainNudge(m);
    if (!msg) return;
    session.shown[m] = 1; save();
    yu.classList.add('attn'); setTimeout(function () { yu.classList.remove('attn'); }, 1900);
    if (sleeping) { sleeping = false; setPose(basePose); }
    say(msg.text, { actions: msg.actions, sticky: true, kind: 'reminder' });
  }
  function currentTopic() { var h = location.hash.slice(1); return h.indexOf('topic-') === 0 ? h.slice(6) : null; }
  function quizTarget() {
    var cur = currentTopic(); if (cur) return cur;
    var topics = (IH.topics && IH.topics()) || [];
    var notDone = topics.filter(function (t) { return stats.topics.indexOf(t.id) < 0; });
    return (notDone[0] || topics[0] || {}).id;
  }
  function goQuiz() {
    hideBubble();
    var id = quizTarget(); if (!id) return;
    if (currentTopic() !== id) location.hash = '#topic-' + id;
    setTimeout(function () { var q = $('#quiz'); if (q) q.scrollIntoView({ block: 'center' }); }, 450);
  }
  function practiceNudge(m) {
    return { text: L('Hey, you\'ve been here for <b>' + m + ' minutes</b> of active study. Nice focus! Remember to try the practice yourself too: a quick quiz makes it stick.', 'Heyy, <b>' + m + ' mins</b> locked in! Don\'t just scroll tho, do a quick quiz so it actually sticks.'),
      actions: [{ label: L('Take me to a quiz', 'Quiz me'), primary: true, fn: goQuiz }, { label: L('Later', 'Later'), fn: hideBubble }] };
  }
  function breakNudge(m) {
    return { text: L('<b>' + m + ' minutes</b> of active study. Your brain has earned a 5-minute break: stand up, stretch, drink some water. I\'ll keep your place.', '<b>' + m + ' mins</b> of grinding! Brain break: stretch, water, touch grass for 5. I\'ll hold your spot.'),
      actions: [{ label: L('Taking a break', 'Brb'), primary: true, fn: function () { hideBubble(); sleeping = true; awayStart = Date.now(); setPose('sleep'); } }, { label: L('Keep going', 'Keep going'), fn: hideBubble }] };
  }
  function explainNudge(m) {
    return { text: L('<b>' + m + ' minutes</b> in. Try this: explain one idea from today out loud, as if to a friend. If you can explain it, you know it.', '<b>' + m + ' mins</b> in. Challenge: explain one thing you learned to an imaginary friend. If you can say it, you get it.'),
      actions: [{ label: L('Got it', 'Bet'), primary: true, fn: hideBubble }] };
  }

  /* ---------- wandering ---------- */
  function wander() {
    var w = window.innerWidth, target = x + (Math.random() < 0.5 ? -1 : 1) * (w * (0.1 + Math.random() * 0.12));
    if (target < 16 || target > maxX()) target = x - (target - x);
    place(target, true);
  }

  /* ---------- menu ---------- */
  function statsLine() {
    return '<div class="yu-stats"><span>' + L('This visit', 'This visit') + ': <b>' + fmtMin(session.active) + '</b></span><span>' + L('Today', 'Today') + ': <b>' + fmtMin(stats.sec) + '</b></span><span><b>' + stats.quizzes + '</b> ' + L('quizzes', 'quizzes') + '</span><span><b>' + stats.chains.length + '</b> ' + L('backstories', 'backstories') + '</span></div>';
  }
  function menu() {
    var greets = [L('Hi! I\'m Yu, your study buddy.', 'Heyy, it\'s Yu!'), L('Hello again! Ready to learn something?', 'You again! Love that for us.'), L('Hi there! What shall we do?', 'Hii, what\'s the move?')];
    var greet = greets[Math.floor(Math.random() * greets.length)];
    say(greet + ' ' + L('How can I help?', ''), {
      sticky: true, kind: 'menu', extra: statsLine(),
      actions: [
        { label: L('Show me around', 'Give me the tour'), primary: true, fn: startTour },
        { label: L('What should I learn next?', 'What next?'), fn: suggest },
        { label: L('Send feedback', 'Send feedback'), fn: openFeedback },
        { label: prefs.quiet ? L('Turn reminders on', 'Reminders on') : L('Quiet mode', 'Quiet mode'), fn: function () { prefs.quiet = !prefs.quiet; save(); say(prefs.quiet ? L('Quiet mode on. I\'ll stay still and skip reminders.', 'Quiet mode on. I\'ll chill.') : L('Reminders are back on.', 'Reminders back on.'), { timeout: 4000 }); } },
        { label: L('Hide Yu', 'Hide me'), fn: hideYu }
      ]
    });
  }
  function suggest() {
    var topics = (IH.topics && IH.topics()) || [];
    var next = topics.filter(function (t) { return stats.topics.indexOf(t.id) < 0; })[0] || topics[Math.floor(Math.random() * topics.length)];
    if (!next) return hideBubble();
    say(L('How about <b>' + esc(next.title) + '</b>? Read the three key ideas, click through the backstory, then do the quiz. About 15 minutes.', 'Try <b>' + esc(next.title) + '</b>: key ideas, backstory, quiz. ~15 mins. Easy.'), {
      sticky: true, actions: [{ label: L('Let\'s go', 'Let\'s go'), primary: true, fn: function () { hideBubble(); location.hash = '#topic-' + next.id; } }, { label: L('Not now', 'Nah'), fn: hideBubble }]
    });
  }
  function hideYu() {
    hideBubble(); prefs.hidden = true; save();
    yu.hidden = true; peek.hidden = false;
  }
  peek.addEventListener('click', function () {
    prefs.hidden = false; save(); peek.hidden = true; yu.hidden = false;
    place(home(), false); flash('wave', 1200);
    say(L('I\'m back! Click me anytime.', 'Missed me? Click me anytime.'), { timeout: 4000 });
  });
  if (prefs.hidden) { yu.hidden = true; peek.hidden = false; }

  yu.addEventListener('click', function () {
    if (touring) return;
    if (sleeping) { sleeping = false; setPose(basePose); }
    yu.classList.remove('boing'); void yu.offsetWidth; yu.classList.add('boing');
    setTimeout(function () { yu.classList.remove('boing'); }, 520);
    if (!bubble.hidden && bubbleKind === 'menu') { hideBubble(); return; }
    flash('wave', 1200);
    menu();
  });

  /* ---------- guided tour ---------- */
  var STEPS = [
    { hash: '#today', sel: '#countrySel', en: 'Start here. Pick any country and the seven key numbers below update instantly.', gz: 'Start here. Pick a country and the 7 key stats update instantly.' },
    { hash: '#today', sel: '.tiles', en: 'Each card shows the latest figure, the change since last year and a 15-year trend. "Copy citation" gives you a proper source for essays.', gz: 'Each card: latest number, change vs last year, 15-year trend. "Copy citation" = instant source for your essay.' },
    { hash: '#today', sel: '#compareSel', en: 'Compare two countries side by side. The gold line on every chart is the second country.', gz: 'Country vs country. The gold line is the second one.' },
    { hash: '#today', sel: '.spot-grid', en: 'Every few hours I check 22 news sources. On top: what everyone is talking about. In gold: the quieter story that matters more for the economy.', gz: 'I check 22 news sources every few hours. Top = what everyone\'s yapping about. Gold = the story that actually matters.' },
    { hash: '#learn', sel: '.topic-grid', en: '15 topics, beginner to intermediate. My study tip: one topic per sitting, about 15 minutes.', gz: '15 topics. Pro tip: one topic per sitting, ~15 mins. Don\'t overdo it.' },
    { hash: '#topic-inflation', sel: '.cards3', en: 'Inside a topic, step 1: read the three key ideas. They\'re short on purpose.', gz: 'Step 1: the 3 main ideas. Short on purpose.' },
    { hash: '#topic-inflation', sel: '#toolMount', en: 'Step 2: play with it. Moving things yourself is how ideas stick.', gz: 'Step 2: play with it. Touching the sliders > reading about them.' },
    { hash: '#topic-inflation', sel: '#chain', en: 'Step 3: the backstory. Click through the chain to see why this idea was invented. My favourite part, I\'ll read along with you.', gz: 'Step 3: the backstory. How the idea was born, one plot point at a time. I\'ll read with you.' },
    { hash: '#topic-inflation', sel: '.papers', en: 'The classic papers behind each idea, all from top (Q1) journals. Great for your reference list.', gz: 'The OG papers, all Q1 journals. Instant reference list.' },
    { hash: '#topic-inflation', sel: '#quiz', en: 'Step 4: check yourself. Testing yourself beats rereading every time.', gz: 'Step 4: the vibe check. Testing yourself > rereading. Science says so.' },
    { hash: '#news', sel: '.news-bar', en: 'News from 22 reliable sources. Tap the heart to follow the ones you like and they show first. All free to read. Labels mark official sources and state media.', gz: 'News from 22 legit sources. Heart the ones you like and they go first. All free, no paywalls.' },
    { hash: '#films', sel: '.films-today', en: 'Three new economics films every day. Movie night counts as studying. I\'ll bring popcorn.', gz: 'Three econ movies a day. Movie night = studying now. I bring the popcorn.' },
    { hash: '#library', sel: '.lib', en: 'Your research toolkit: where to find papers, data, AI tools and creators.', gz: 'Your research toolkit: papers, data, AI tools, creators.' },
    { hash: null, sel: '#openSearch', en: 'Press / anywhere to search everything: countries, concepts, papers, films.', gz: 'Press / to search literally everything.' },
    { hash: null, sel: '.seg', en: 'And if you\'d like me to talk like your group chat, switch to Gen Z.', gz: 'You already found Gen Z mode. Iconic.' },
    { hash: '#today', sel: null, en: 'That\'s the tour! I\'ll count your active study time and nudge you to practise or take a break. Click me anytime, and if you have ideas for the site, I\'ll fly them to the team.', gz: 'That\'s the tour! I\'ll track your study time and remind you to practise or take breaks. Click me whenever.' }
  ];
  var touring = false, step = 0, ringEl = null;
  function placeRing() {
    if (!touring || !ringEl) { ring.hidden = true; return; }
    var r = ringEl.getBoundingClientRect(), p = 8;
    if (!r.width && !r.height) { ring.hidden = true; return; }
    ring.hidden = false;
    ring.style.top = (r.top - p) + 'px'; ring.style.left = (r.left - p) + 'px';
    ring.style.width = (r.width + p * 2) + 'px'; ring.style.height = (r.height + p * 2) + 'px';
  }
  window.addEventListener('scroll', placeRing, { passive: true });
  function startTour() {
    touring = true; step = 0; hideBubble(); sleeping = false; setPose('idle');
    showStep();
  }
  function showStep() {
    var s = STEPS[step];
    if (s.hash && location.hash !== s.hash) location.hash = s.hash;
    setTimeout(function () {
      ringEl = s.sel ? document.querySelector(s.sel) : null;
      if (ringEl) ringEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      ring.hidden = true;
      setTimeout(function () {
        placeRing();
        if (ringEl && !small()) { var r = ringEl.getBoundingClientRect(); place(r.left + r.width / 2 - width() / 2, true); }
        flash(step === STEPS.length - 1 ? 'cheer' : 'wave', 1200);
        var last = step === STEPS.length - 1;
        var actions = [];
        if (step > 0 && !last) actions.push({ label: L('Back', 'Back'), fn: function () { step--; showStep(); } });
        actions.push({ label: last ? L('Done', 'Done') : L('Next', 'Next'), primary: true, fn: function () { if (last) endTour(false); else { step++; showStep(); } } });
        if (!last) actions.push({ label: L('Skip tour', 'Skip'), fn: function () { endTour(true); } });
        say(L(s.en, s.gz), { sticky: true, kind: 'tour', actions: actions, progress: last ? '' : (step + 1) + ' / ' + (STEPS.length - 1) });
      }, reduce ? 0 : 420);
    }, s.hash && location.hash !== s.hash ? 260 : 0);
  }
  function endTour(skipped) {
    touring = false; ringEl = null; ring.hidden = true;
    prefs.tourDone = true; save(); hideBubble();
    if (skipped) say(L('No problem. Click me whenever you want the tour.', 'Bet. Click me if you want the tour later.'), { timeout: 4000 });
    setTimeout(function () { place(home(), true); }, 400);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (touring) endTour(true); else if (!bubble.hidden) hideBubble();
  });

  /* ---------- reacting to the page ---------- */
  document.addEventListener('ih:route', function (e) {
    var d = e.detail || {};
    basePose = poseFor(d.view);
    if (!sleeping) setPose(basePose);
    if (d.view === 'topic' && d.topic && stats.topics.indexOf(d.topic) < 0) { stats.topics.push(d.topic); save(); }
    
    if (!touring && bubbleKind === 'note') hideBubble();
  });
  document.addEventListener('ih:quiz', function (e) {
    var d = e.detail || {};
    flash(d.correct ? 'cheer' : 'think', 1300);
    if (d.answered === d.total) {
      stats.quizzes++; save();
      if (prefs.quiet) return;
      var msg = d.right === d.total ? L('<b>' + d.right + '/' + d.total + '</b> on ' + esc(d.title) + '! You really get this.', '<b>' + d.right + '/' + d.total + '</b> on ' + esc(d.title) + '. Big brain energy.')
        : L('<b>' + d.right + '/' + d.total + '</b> on ' + esc(d.title) + '. Read the explanations under the answers, then try again tomorrow. Spacing it out helps.', '<b>' + d.right + '/' + d.total + '</b>. Read the explanations and run it back tomorrow. You got this.');
      setTimeout(function () { say(msg, { timeout: 7000 }); }, 700);
    }
  });
  document.addEventListener('ih:chain', function (e) {
    var d = e.detail || {};
    if (sleeping) return;
    if (yu.dataset.pose !== 'read') setPose('read');
    yu.classList.remove('flip'); void yu.offsetWidth; yu.classList.add('flip');
    setTimeout(function () { yu.classList.remove('flip'); }, 650);
    if (d.idx === d.n - 1 && stats.chains.indexOf(d.id) < 0) {
      stats.chains.push(d.id); save();
      if (!prefs.quiet && !touring) setTimeout(function () { flash('cheer', 1300); say(L('You read the whole backstory of <b>' + esc(d.title) + '</b>, from ' + esc(d.first) + ' to ' + esc(d.last) + '. Now try the quiz!', 'Whole backstory of <b>' + esc(d.title) + '</b> done, ' + esc(d.first) + ' to ' + esc(d.last) + '. Quiz time?'), { timeout: 7000 }); }, 500);
    }
  });

  /* ---------- feedback: write a letter, Yu folds it into a paper plane and flies it to the team ----------
     Delivery: Web3Forms (free) sends each message to the site owner's email.
     The owner's access key lives in data/config.js (window.IH_CONFIG.feedbackKey). */
  var plane = document.createElement('div');
  plane.id = 'yu-plane'; plane.hidden = true; plane.setAttribute('aria-hidden', 'true');
  plane.innerHTML = '<div class="yu-plane-inner"><svg viewBox="0 0 60 60"><path class="yu-plane-body yu-pp" d=""/><path class="yu-plane-line yu-crease" d=""/></svg></div>';
  // Folding steps. Every shape has the same 5 points so the browser can morph one into the next.
  var FOLD = {
    sheet: { body: 'M12 8 L30 8 L48 8 L48 52 L12 52 Z', crease: 'M30 8 L30 8 L30 8', c: 0 },
    corners: { body: 'M12 22 L30 6 L48 22 L48 52 L12 52 Z', crease: 'M12 22 L30 24 L48 22', c: 1 },
    dart: { body: 'M24 26 L30 4 L36 26 L34 56 L26 56 Z', crease: 'M30 4 L30 30 L30 56', c: 1 },
    plane: { body: 'M4 34 L56 16 L40 46 L31 36 L16 36 Z', crease: 'M4 34 L31 36 L56 16', c: 1 }
  };
  function foldTo(stage) {
    var f = FOLD[stage], body = plane.querySelector('.yu-pp'), cr = plane.querySelector('.yu-crease');
    body.setAttribute('d', f.body); cr.setAttribute('d', f.crease);
    try { body.style.d = 'path("' + f.body + '")'; cr.style.d = 'path("' + f.crease + '")'; } catch (e) { /* older browsers just swap shapes */ }
    cr.style.opacity = f.c;
  }
  root.appendChild(plane);
  var CATS = [
    ['idea', L('Idea', 'Idea')], ['confusing', L('Something\'s confusing', 'Confusing')], ['content', L('Add content', 'Add stuff')],
    ['bug', L('Something\'s broken', 'Bug')], ['hi', L('Just saying hi', 'Just vibes')]
  ];
  var draft = ss.get('yu:draft', { text: '', email: '', cat: 'idea' }), lastSent = 0;
  function openFeedback() {
    if (prefs.hidden) { prefs.hidden = false; save(); peek.hidden = true; yu.hidden = false; place(home(), false); }
    if (sleeping) { sleeping = false; }
    setPose('letter');
    var cats = CATS.map(function (c) { return '<button type="button" class="yu-chip" data-cat="' + c[0] + '" aria-pressed="' + (draft.cat === c[0]) + '">' + esc(c[1]) + '</button>'; }).join('');
    say(L('We\'re new and still building Invisible Hand, so your ideas really shape it. How is everything? Anything confusing, missing or worth adding, like a topic, a film, a news source or a feature? Write it here and I\'ll fly it straight to the team.',
        'We\'re new and still cooking, so your take actually matters. Anything confusing, missing or that you\'d add? Drop it here and I\'ll fly it to the team.'), {
      sticky: true, kind: 'feedback', wide: true,
      extra: '<div class="yu-form"><div class="yu-chips" role="group" aria-label="' + esc(L('Type of feedback', 'Type')) + '">' + cats + '</div>' +
        '<label class="sr" for="yu-fb-text">' + esc(L('Your message', 'Your message')) + '</label>' +
        '<textarea id="yu-fb-text" maxlength="1500" rows="4" placeholder="' + esc(L('What would make Invisible Hand better for you?', 'What would make this better?')) + '">' + esc(draft.text) + '</textarea>' +
        '<div class="yu-count"><span id="yu-fb-count"></span></div>' +
        '<label class="sr" for="yu-fb-email">' + esc(L('Email (optional)', 'Email (optional)')) + '</label>' +
        '<input id="yu-fb-email" type="email" autocomplete="email" placeholder="' + esc(L('Your email (optional, only if you\'d like a reply)', 'Email (optional, if you want a reply)')) + '" value="' + esc(draft.email) + '">' +
        '<input id="yu-fb-hp" type="text" tabindex="-1" autocomplete="off" class="yu-hp" aria-hidden="true">' +
        '<p class="yu-note">' + esc(L('Please don\'t include passwords or private information.', 'No passwords or private info pls.')) + '</p></div>',
      actions: [{ label: L('Fold & send', 'Send it'), primary: true, fn: sendFeedback }, { label: L('Cancel', 'Cancel'), fn: function () { hideBubble(); setPose(basePose); } }]
    });
    var ta = $('#yu-fb-text'), em = $('#yu-fb-email');
    function upd() { draft.text = ta.value; draft.email = em.value; ss.set('yu:draft', draft); $('#yu-fb-count').textContent = ta.value.length + ' / 1500'; }
    ta.addEventListener('input', upd); em.addEventListener('input', upd); upd();
    Array.prototype.forEach.call(bubble.querySelectorAll('.yu-chip'), function (b) {
      b.addEventListener('click', function () {
        draft.cat = b.dataset.cat; ss.set('yu:draft', draft);
        Array.prototype.forEach.call(bubble.querySelectorAll('.yu-chip'), function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      });
    });
    setTimeout(function () { ta.focus(); }, 50);
  }
  function sendFeedback() {
    var ta = $('#yu-fb-text'), em = $('#yu-fb-email'), hp = $('#yu-fb-hp');
    var text = (ta.value || '').trim(), email = (em.value || '').trim();
    if (text.length < 3) { ta.focus(); ta.classList.add('yu-bad'); setTimeout(function () { ta.classList.remove('yu-bad'); }, 600); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { em.focus(); em.classList.add('yu-bad'); setTimeout(function () { em.classList.remove('yu-bad'); }, 600); return; }
    if (Date.now() - lastSent < 30000) { say(L('I just flew one! Give me a few seconds to catch my breath.', 'Just sent one! Gimme a sec.'), { timeout: 4000 }); return; }
    if (hp && hp.value) { hideBubble(); return; } // spam bot filled the hidden field
    lastSent = Date.now();
    var cat = (CATS.filter(function (c) { return c[0] === draft.cat; })[0] || CATS[0])[1];
    var key = (window.IH_CONFIG && window.IH_CONFIG.feedbackKey) || '';
    var delivery = !key ? Promise.resolve('off') : fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: key, subject: 'Invisible Hand feedback: ' + cat, from_name: 'Invisible Hand (Yu)', category: cat, message: text, email: email || undefined, page: location.hash || '#today', language: lang() })
    }).then(function (r) { return r.json(); }).then(function (j) { return j && j.success ? 'ok' : 'fail'; }).catch(function () { return 'fail'; });
    hideBubble();
    flyLetter(delivery).then(function (result) {
      if (result === 'ok') {
        draft = { text: '', email: '', cat: 'idea' }; ss.set('yu:draft', draft);
        flash('cheer', 1600);
        say(L('Delivered! Thank you. The team reads every message.', 'Delivered! Thank youuu, the team reads every single one.'), { timeout: 6000 });
      } else if (result === 'off') {
        lastSent = 0; setPose(basePose);
        say(L('My plane is ready, but sending isn\'t switched on for this copy of the site yet. Your message is saved, so try again later.', 'Sending isn\'t switched on here yet. Your message is saved, try again later.'), { timeout: 8000 });
        if (window.console) console.info('Invisible Hand: add your Web3Forms access key to data/config.js to receive feedback by email.');
      } else {
        lastSent = 0; flash('think', 1600);
        say(L('Hmm, my plane couldn\'t get through. Check your internet connection and try again. I kept your message.', 'Plane crashed (no internet?). Your message is saved, try again.'), {
          sticky: true, actions: [{ label: L('Try again', 'Retry'), primary: true, fn: openFeedback }, { label: L('Later', 'Later'), fn: hideBubble }]
        });
      }
    });
  }
  function flyLetter(delivery) {
    var start = Date.now();
    setPose('letter');
    yu.classList.add('folding');
    var done = new Promise(function (resolve) {
      if (reduce || !plane.animate) { setTimeout(function () { yu.classList.remove('folding'); resolve(); }, 500); return; }
      var S = 56, yuH = yu.offsetHeight || (small() ? 64 : 84);
      var sx = x + width() / 2 - S / 2, sy = window.innerHeight - yuH - 8 - S + 6;
      plane.style.transform = 'translate(' + sx + 'px,' + sy + 'px)';
      // 1. Yu holds the letter, then lifts the sheet up and folds it, step by step
      setTimeout(function () {
        yu.classList.add('folding');
        foldTo('sheet'); plane.classList.remove('ready'); plane.hidden = false;
        setPose('idle');
      }, 450);
      setTimeout(function () { foldTo('corners'); }, 850);
      setTimeout(function () { foldTo('dart'); }, 1250);
      setTimeout(function () { foldTo('plane'); plane.classList.add('ready'); setPose('wave'); }, 1650);
      // 2. The plane glides across the page in a gentle wave and leaves on the far side
      setTimeout(function () {
        var W = window.innerWidth, dir = (x + width() / 2) > W / 2 ? -1 : 1;
        var endX = dir < 0 ? -S - 30 : W + 30, midY = Math.max(90, window.innerHeight * 0.4);
        var pts = [], N = 18;
        for (var i = 0; i <= N; i++) {
          var p = i / N, ease = 1 - Math.pow(1 - Math.min(1, p * 2), 2);
          pts.push({ x: sx + (endX - sx) * p, y: sy + (midY - sy) * ease + Math.sin(p * Math.PI * 3) * 22 * Math.min(1, p * 6) });
        }
        var k = pts.map(function (pt, i) {
          var q = pts[Math.min(N, i + 1)], r = pts[Math.max(0, i - 1)];
          var ang = Math.atan2(q.y - r.y, Math.abs(q.x - r.x) || 1) * 180 / Math.PI + 18; // the drawn plane points 18° up
          return { transform: 'translate(' + pt.x.toFixed(1) + 'px,' + pt.y.toFixed(1) + 'px) scale(' + dir + ',1) rotate(' + ang.toFixed(1) + 'deg)', opacity: i === N ? 0 : 1, offset: i / N };
        });
        var finished = false;
        function finish() { if (finished) return; finished = true; plane.hidden = true; plane.classList.remove('ready'); resolve(); }
        var anim = plane.animate(k, { duration: 3400, easing: 'linear' });
        anim.onfinish = finish;
        setTimeout(finish, 3800); // safety net if the tab is in the background and animations pause
      }, 2000);
    });
    return Promise.all([done, delivery]).then(function (r) {
      yu.classList.remove('folding');
      var wait = Math.max(0, 900 - (Date.now() - start));
      return new Promise(function (res) { setTimeout(function () { res(r[1]); }, wait); });
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-yu-feedback]');
    if (t) { e.preventDefault(); openFeedback(); }
  });

  /* ---------- first visit ---------- */
  if (!prefs.greeted && !prefs.hidden) {
    setTimeout(function () {
      prefs.greeted = true; save();
      flash('wave', 1400);
      say(L('Hi, I\'m <b>Yu</b>, your study buddy here. Want a quick tour of how everything works?', 'Hii, I\'m <b>Yu</b>, your study buddy. Want the quick tour?'), {
        sticky: true, kind: 'menu',
        actions: [{ label: L('Yes, show me', 'Yes pls'), primary: true, fn: startTour }, { label: L('Maybe later', 'Later'), fn: function () { hideBubble(); say(L('Okay! Click me whenever you\'re ready.', 'Okay! Click me whenever.'), { timeout: 4000 }); } }]
      });
    }, 2200);
  }
  window.addEventListener('beforeunload', save);
})();
