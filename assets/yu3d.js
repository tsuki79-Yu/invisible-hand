/* Yu in real 3D (Three.js). Replaces the flat drawing when the browser supports WebGL.
   Yu's behaviour (assets/yu.js) is unchanged: this file just watches her pose
   (#yu data-pose / data-face / classes) and animates the 3D model to match. */
(function () {
  'use strict';
  var THREE = window.THREE, host = document.getElementById('yu');
  if (!THREE || !host) return;
  var wrap = host.querySelector('.yu-flipwrap');
  var canvas = document.createElement('canvas');
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (e) { return; } // no WebGL: keep the drawn Yu
  if (!renderer.getContext()) return;
  if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false; // treat colours as normal web colours
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  canvas.className = 'yu-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 1.25, 7.4);
  camera.lookAt(0, 1.05, 0);

  /* ---------- light ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x51605c, 0.55));
  var key = new THREE.DirectionalLight(0xfff1df, 1.3); key.position.set(2.6, 4.2, 3.4); scene.add(key);
  var rim = new THREE.DirectionalLight(0xa8f0dc, 1.1); rim.position.set(-3, 2.4, -2.5); scene.add(rim);
  var fill = new THREE.DirectionalLight(0xdfe9ff, 0.35); fill.position.set(-2.5, 0.6, 3); scene.add(fill);

  /* ---------- materials ---------- */
  function mat(color, rough, extra) { var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough, metalness: 0 }); if (extra) Object.assign(m, extra); return m; }
  var M = {
    dark: mat(0x22313a, 0.5),
    white: mat(0xf1ece1, 0.7),
    orange: mat(0xea962c, 0.45),
    eye: mat(0x101417, 0.15),
    shine: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    cheek: mat(0xf29d97, 0.8, { transparent: true, opacity: 0.75 }),
    scarf: mat(0x0f7a60, 0.6),
    gold: mat(0xe8b23f, 0.35, { metalness: 0.3 }),
    paper: mat(0xfffcf2, 0.85)
  };
  function canvasTex(w, h, draw) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t;
  }
  function sphere(r, m, sx, sy, sz, x, y, z, seg) {
    var g = new THREE.Mesh(new THREE.SphereGeometry(r, seg || 40, seg ? Math.round(seg * 0.75) : 30), m);
    g.scale.set(sx, sy, sz); g.position.set(x, y, z); return g;
  }

  /* ---------- the penguin ---------- */
  var yu = new THREE.Group(); scene.add(yu);
  var bodyPivot = new THREE.Group(); yu.add(bodyPivot);       // rotates/hops as a whole
  // soft shadow on the ground
  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.9), new THREE.MeshBasicMaterial({
    map: canvasTex(128, 64, function (g, w, h) { var gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(15,30,25,.45)'); gr.addColorStop(1, 'rgba(15,30,25,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }),
    transparent: true, depthWrite: false
  }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; yu.add(shadow);

  var body = sphere(0.66, M.dark, 1, 0.98, 0.9, 0, 0.74, 0); bodyPivot.add(body);
  bodyPivot.add(sphere(0.5, M.white, 0.98, 1.02, 0.66, 0, 0.68, 0.34));            // belly
  // feet
  var footL = sphere(0.2, M.orange, 1.15, 0.38, 1.5, -0.24, 0.06, 0.24); bodyPivot.add(footL);
  var footR = sphere(0.2, M.orange, 1.15, 0.38, 1.5, 0.24, 0.06, 0.24); bodyPivot.add(footR);
  // flippers on shoulder pivots
  function flipper(side) {
    var p = new THREE.Group(); p.position.set(side * 0.58, 1.02, 0.02);
    var f = sphere(0.5, M.dark, 0.2, 0.62, 0.14, 0, -0.32, 0); f.rotation.z = side * 0.08; p.add(f);
    bodyPivot.add(p); return p;
  }
  var flipL = flipper(-1), flipR = flipper(1);
  // scarf
  var scarf = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.085, 18, 56), M.scarf);
  scarf.rotation.x = Math.PI / 2 - 0.08; scarf.position.y = 1.07; scarf.scale.set(1, 1, 0.92); bodyPivot.add(scarf);
  var tail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.44, 0.06), M.scarf);
  tail.position.set(0.25, 0.86, 0.66); tail.rotation.set(0.25, 0.2, 0.32); bodyPivot.add(tail);
  var stripe = new THREE.Mesh(new THREE.BoxGeometry(0.155, 0.05, 0.065), M.gold);
  stripe.position.set(0, -0.08, 0); tail.add(stripe);

  // head
  var head = new THREE.Group(); head.position.set(0, 1.5, 0); bodyPivot.add(head);
  head.add(sphere(0.64, M.dark, 1, 0.97, 0.96, 0, 0, 0));
  // heart-shaped face: two cheeks of white plus a chin
  head.add(sphere(0.32, M.white, 1, 1.04, 0.62, -0.17, 0.03, 0.44));
  head.add(sphere(0.32, M.white, 1, 1.04, 0.62, 0.17, 0.03, 0.44));
  head.add(sphere(0.36, M.white, 1.15, 0.8, 0.6, 0, -0.15, 0.42));
  // eyes (normal + happy arcs)
  var eyes = new THREE.Group(); head.add(eyes);
  function eye(x) {
    var e = new THREE.Group(); e.position.set(x, 0.04, 0.63);
    e.add(sphere(0.105, M.eye, 0.9, 1.12, 0.55, 0, 0, 0, 28));
    e.add(sphere(0.04, M.shine, 1, 1, 0.5, 0.035, 0.05, 0.05, 16));
    e.add(sphere(0.019, M.shine, 1, 1, 0.5, -0.03, -0.04, 0.05, 12));
    eyes.add(e); return e;
  }
  var eyeL = eye(-0.18), eyeR = eye(0.18);
  var happy = new THREE.Group(); head.add(happy); happy.visible = false;
  [-0.18, 0.18].forEach(function (x) {
    var arc = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 10, 24, Math.PI), M.eye);
    arc.position.set(x, 0.0, 0.67); happy.add(arc);
  });
  // cheeks, beak
  [-1, 1].forEach(function (s) {
    var c = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), M.cheek);
    c.position.set(s * 0.31, -0.13, 0.6); c.rotation.y = s * 0.45; head.add(c);
  });
  var beak = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.17, 24), M.orange);
  beak.rotation.x = Math.PI / 2 + 0.25; beak.position.set(0, -0.1, 0.7); head.add(beak);
  // hair curl
  var curl = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.56, 0.05), new THREE.Vector3(-0.02, 0.72, 0.04), new THREE.Vector3(0.08, 0.84, 0.02), new THREE.Vector3(0.17, 0.78, 0.0), new THREE.Vector3(0.12, 0.7, 0.0)
  ]), 24, 0.04, 10, false), M.dark);
  head.add(curl);
  // gold star hair clip
  var star = new THREE.Shape();
  for (var i = 0; i < 10; i++) { var r = i % 2 ? 0.045 : 0.1, a = i / 10 * Math.PI * 2 - Math.PI / 2; if (i) star.lineTo(Math.cos(a) * r, Math.sin(a) * r); else star.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  var clip = new THREE.Mesh(new THREE.ExtrudeGeometry(star, { depth: 0.04, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 }), M.gold);
  clip.position.set(0.4, 0.4, 0.38); clip.rotation.set(-0.3, 0.55, 0.2); head.add(clip);

  /* ---------- props she can hold ---------- */
  var props = {};
  function prop(name, obj) { obj.visible = false; obj.scale.setScalar(0.001); obj.position.set(0, 0.62, 0.86); bodyPivot.add(obj); props[name] = obj; }
  var lines = function (g, w, h, step, from) { g.fillStyle = '#4a5a55'; for (var y = from; y < h - 10; y += step) g.fillRect(14, y, w - 28 - (y % 3 ? 0 : 20), 4); };
  // book (open, with a page that flips)
  var book = new THREE.Group();
  var pageTex = canvasTex(128, 160, function (g, w, h) { g.fillStyle = '#f4efe2'; g.fillRect(0, 0, w, h); lines(g, w, h, 18, 24); });
  [-1, 1].forEach(function (s) {
    var cover = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.025), M.scarf); cover.position.set(s * 0.2, 0, -0.02); cover.rotation.y = -s * 0.32; book.add(cover);
    var page = new THREE.Mesh(new THREE.PlaneGeometry(0.37, 0.46), new THREE.MeshBasicMaterial({ map: pageTex })); page.position.set(s * 0.19, 0, 0.0); page.rotation.y = -s * 0.32; book.add(page);
  });
  var flipPagePivot = new THREE.Group(); book.add(flipPagePivot);
  var flipPage = new THREE.Mesh(new THREE.PlaneGeometry(0.37, 0.46), new THREE.MeshBasicMaterial({ map: pageTex, side: THREE.DoubleSide }));
  flipPage.position.x = 0.19; flipPagePivot.add(flipPage); flipPagePivot.rotation.y = -0.32;
  book.rotation.x = -0.35; prop('read', book);
  // newspaper
  var paper = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.58), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide,
    map: canvasTex(256, 165, function (g, w, h) { g.fillStyle = '#f4efe2'; g.fillRect(0, 0, w, h); g.fillStyle = '#26332f'; g.font = 'bold 26px Georgia, serif'; g.fillText('THE DAILY', 16, 34); g.fillRect(16, 44, w - 32, 4); g.fillStyle = '#4a5a55'; for (var y = 62; y < h - 12; y += 12) g.fillRect(16, y, 108, 4); g.fillStyle = '#0f7a60'; g.fillRect(138, 60, 100, 70); }) }));
  paper.rotation.x = -0.2; prop('paper', paper);
  // popcorn
  var pop = new THREE.Group();
  var tub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.17, 0.42, 28, 1, true), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide,
    map: canvasTex(256, 64, function (g, w, h) { for (var x = 0; x < w; x += 32) { g.fillStyle = (x / 32) % 2 ? '#fffcf2' : '#e8a63a'; g.fillRect(x, 0, 32, h); } }) }));
  pop.add(tub);
  for (var k = 0; k < 9; k++) { var a2 = k / 9 * Math.PI * 2; pop.add(sphere(0.075, M.white, 1, 0.9, 1, Math.cos(a2) * 0.13, 0.24 + (k % 3) * 0.03, Math.sin(a2) * 0.13, 12)); }
  pop.add(sphere(0.08, M.white, 1, 0.9, 1, 0, 0.3, 0, 12));
  prop('popcorn', pop);
  // letter sealed with the Invisible Hand logo
  var letter = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.46, 0.02), [M.paper, M.paper, M.paper, M.paper, new THREE.MeshBasicMaterial({
    map: canvasTex(256, 164, function (g, w, h) {
      g.fillStyle = '#f4efe2'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9c2ad'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
      g.beginPath(); g.moveTo(4, 4); g.lineTo(w / 2, h * 0.55); g.lineTo(w - 4, 4); g.stroke();
      var cx = w / 2, cy = h * 0.58; g.fillStyle = '#f4efe2'; g.beginPath(); g.arc(cx, cy, 26, 0, 7); g.fill(); g.strokeStyle = '#0e5b4b'; g.lineWidth = 2.5; g.stroke();
      for (var e2 = 0; e2 < 6; e2++) { g.save(); g.translate(cx, cy); g.rotate(e2 * Math.PI / 6); g.beginPath(); g.ellipse(0, 0, 19, 7, 0, 0, 7); g.stroke(); g.restore(); }
      g.fillStyle = '#0e5b4b'; g.beginPath(); g.arc(cx, cy, 3.5, 0, 7); g.fill();
    }) }), M.paper]);
  letter.rotation.x = -0.12; prop('letter', letter);

  /* ---------- floating symbols (sprites) ---------- */
  function sprite(text, color, size) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false,
      map: canvasTex(64, 64, function (g) { g.fillStyle = color; g.font = 'bold 48px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 32, 34); }) }));
    s.scale.set(size, size, 1); s.visible = false; scene.add(s); return s;
  }
  var zz = [sprite('z', '#5e6f69', 0.3), sprite('z', '#5e6f69', 0.24)];
  var qmark = sprite('?', '#c48a1c', 0.42);
  var sparks = [sprite('✦', '#e8b23f', 0.3), sprite('✦', '#e8b23f', 0.22), sprite('♥', '#ef8f88', 0.22)];

  /* ---------- pointer: she looks at you ---------- */
  var look = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect(); if (!r.width) return;
    look.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 420));
    look.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.3)) / 420));
  }, { passive: true });

  /* ---------- animation ---------- */
  var cur = { lz: -0.32, lx: 0, rz: 0.32, rx: 0, hy: 0, hx: 0, hz: 0, by: 0, ry: 0, hop: 0, eye: 1, sq: 1 };
  var clock = new THREE.Clock(), lastPose = '', poseStart = 0, blinkAt = 2, flipAt = -1, boingAt = -9, flipSeen = false;
  host.addEventListener('click', function () { boingAt = clock.getElapsedTime(); });
  var damp = function (a, b, k, dt) { return a + (b - a) * (1 - Math.exp(-k * dt)); };

  function size() {
    var w = host.clientWidth || 96, h = host.clientHeight || 112;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  function frame() {
    var dt = Math.min(0.05, clock.getDelta()), t = clock.getElapsedTime();
    var pose = host.dataset.pose || 'idle', faceDir = host.dataset.face || '';
    if (pose !== lastPose) { lastPose = pose; poseStart = t; }
    var since = t - poseStart;
    var holding = pose === 'read' || pose === 'paper' || pose === 'popcorn' || pose === 'letter';
    var tg = { lz: -0.32 + Math.sin(t * 1.3) * 0.04, lx: 0, rz: 0.32 - Math.sin(t * 1.3) * 0.04, rx: 0,
      hy: look.x * 0.55, hx: look.y * 0.28, hz: 0, ry: look.x * 0.12, eye: 1, hop: 0 };
    if (holding) { tg.lz = 0.95; tg.rz = -0.95; tg.lx = -0.75; tg.rx = -0.75; tg.hx = 0.22; tg.hy = Math.sin(t * 0.9) * 0.18; tg.ry = 0; }
    if (pose === 'wave') { tg.rz = 2.35 + Math.sin(t * 13) * 0.35; tg.rx = -0.2; tg.hz = -0.1; }
    if (pose === 'think') { tg.rz = -2.0; tg.rx = -1.1; tg.hz = 0.18; tg.hx = -0.1; }
    if (pose === 'cheer') { tg.lz = -2.4; tg.rz = 2.4; tg.hop = reduce ? 0 : Math.abs(Math.sin(since * 9)) * 0.28 * Math.max(0, 1 - since / 1.4); }
    if (pose === 'sleep') { tg.eye = 0.08; tg.hx = 0.32; tg.hy = 0; tg.ry = 0; tg.lz = -0.2; tg.rz = 0.2; }
    if (faceDir === 'left') { tg.hy = -0.6; tg.ry = -0.45; }
    if (faceDir === 'right') { tg.hy = 0.6; tg.ry = 0.45; }
    if (host.classList.contains('attn') && !reduce) tg.hop = Math.abs(Math.sin(t * 10)) * 0.12;

    var k = 9;
    ['lz', 'lx', 'rz', 'rx', 'hy', 'hx', 'hz', 'ry', 'hop'].forEach(function (p) { cur[p] = damp(cur[p], tg[p], k, dt); });
    // blinking
    var blink = 1;
    if (t > blinkAt) { var bp = (t - blinkAt) / 0.16; blink = bp < 1 ? Math.abs(1 - bp * 2) : 1; if (bp >= 1) blinkAt = t + 2.5 + Math.random() * 3; }
    cur.eye = damp(cur.eye, tg.eye, 12, dt);

    flipL.rotation.set(cur.lx, 0, cur.lz);
    flipR.rotation.set(cur.rx, 0, cur.rz);
    head.rotation.set(cur.hx, cur.hy, cur.hz);
    var breathe = reduce ? 0 : Math.sin(t * 1.6) * 0.012;
    var boing = t - boingAt < 0.5 ? Math.sin((t - boingAt) / 0.5 * Math.PI * 2) * 0.08 * (1 - (t - boingAt) / 0.5) : 0;
    bodyPivot.scale.set(1 + breathe * 0.6 + boing, 1 + breathe - boing, 1 + breathe * 0.6 + boing);
    bodyPivot.position.y = cur.hop;
    bodyPivot.rotation.y = cur.ry;
    shadow.scale.setScalar(1 - cur.hop * 0.9);
    shadow.material.opacity = 1 - cur.hop * 1.5;
    var showHappy = pose === 'cheer' || pose === 'wave';
    happy.visible = showHappy; eyes.visible = !showHappy;
    var ey = Math.max(0.05, cur.eye * blink);
    eyeL.scale.y = ey; eyeR.scale.y = ey;
    var scan = holding && pose !== 'popcorn' ? Math.sin(t * 1.4) * 0.03 : 0;
    eyeL.position.x = -0.18 + scan; eyeR.position.x = 0.18 + scan;
    // props
    Object.keys(props).forEach(function (name) {
      var on = pose === name, p = props[name];
      p.visible = on || p.scale.x > 0.02;
      var s = damp(p.scale.x, on ? 1 : 0.001, 10, dt); p.scale.setScalar(s);
    });
    var flipNow = host.classList.contains('flip'); if (flipNow && !flipSeen) flipAt = t; flipSeen = flipNow;
    if (flipAt >= 0) { var fp = (t - flipAt) / 0.55; flipPagePivot.rotation.y = -0.32 + Math.min(1, fp) * (Math.PI - 0.0); if (fp >= 1) { flipAt = -1; flipPagePivot.rotation.y = -0.32; } }
    // floating symbols
    zz.forEach(function (z, i) { z.visible = pose === 'sleep'; if (z.visible) { var zp = ((t * 0.45 + i * 0.5) % 1); z.position.set(0.55 + zp * 0.35, 2.15 + zp * 0.55, 0.3); z.material.opacity = Math.sin(zp * Math.PI); } });
    qmark.visible = pose === 'think'; if (qmark.visible) qmark.position.set(0.72, 2.35 + Math.sin(t * 3) * 0.04, 0.2);
    sparks.forEach(function (s, i) { s.visible = pose === 'cheer'; if (s.visible) { var sp = (since * 1.2 + i * 0.33) % 1; s.position.set([-0.85, 0.85, 0.75][i], 1.6 + [0.5, 0.2, -0.3][i] + sp * 0.2, 0.3); s.material.opacity = Math.sin(sp * Math.PI); } });

    renderer.render(scene, camera);
  }

  // swap the drawing for the 3D model
  wrap.querySelector('svg').style.display = 'none';
  wrap.appendChild(canvas);
  host.classList.add('is-3d'); document.body.classList.add('yu-3d');
  size();
  if (window.ResizeObserver) new ResizeObserver(size).observe(host); else window.addEventListener('resize', size);
  renderer.setAnimationLoop(function () { if (!document.hidden && !host.hidden) frame(); });
})();
