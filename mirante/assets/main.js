/* Mirante Pizza Bar */
(() => {
  'use strict';

  const ORDER_URL = 'https://mirante-pizza-bar.netlify.app/';

  const root = document.documentElement;
  root.classList.remove('no-js');

  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reduceMQ.matches;

  // todos os botões de pedido apontam para o mesmo endereço
  document.querySelectorAll('.order-link').forEach(a => { a.href = ORDER_URL; });

  /* ---------- navegação fica sólida depois do topo ---------- */
  const nav = document.getElementById('nav');
  let navSolid = null;
  function updateNav() {
    const solid = scrollY > 40;
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
  }
  addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------- vídeos em loop: tocam sozinhos só quando estão na tela ---------- */
  const hero = document.querySelector('.hero');
  const loops = [
    { el: document.getElementById('heroVideo'), src: 'assets/hero-loop.mp4', box: hero, onPlay: () => hero.classList.add('playing') },
    { el: document.getElementById('fatiaVideo'), src: 'assets/fatia-loop.mp4', box: document.querySelector('.fire-media') }
  ].filter(v => v.el);

  function syncLoop(v) {
    if (reduced || !v.visible || document.hidden) {
      v.el.pause();
      if (reduced && v === loops[0]) hero.classList.remove('playing');
      return;
    }
    if (!v.loaded) {                                   // só baixa o vídeo na primeira vez que ele aparece
      v.loaded = true;
      if (v.onPlay) v.el.addEventListener('playing', v.onPlay);
      v.el.addEventListener('error', () => {           // sem vídeo, o pôster segura sozinho
        if (v === loops[0]) hero.classList.remove('playing');
      });
      v.el.src = v.src;
      v.el.load();
    }
    const p = v.el.play();
    if (p && p.catch) p.catch(() => {});               // autoplay bloqueado: o pôster continua lá
  }
  const syncAll = () => loops.forEach(syncLoop);

  const loopIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = loops.find(l => l.box === e.target);
      if (!v) return;
      v.visible = e.isIntersecting;
      syncLoop(v);
    });
  }, { threshold: 0.05, rootMargin: '120px 0px' });
  loops.forEach(v => loopIO.observe(v.box));

  /* ---------- entradas e linhas que se desenham ---------- */
  document.querySelectorAll('.draw').forEach(p => {
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch (e) {}
  });

  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      revealIO.unobserve(el);
      // aposenta o escalonamento depois da entrada, para o hover não atrasar
      setTimeout(() => el.classList.add('settled'), 1400);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  /* ---------- o terraço: de dia e de noite ---------- */
  const stack = document.getElementById('photoStack');
  const swap = document.getElementById('stackSwap');
  const placePhotos = document.querySelector('.place-photos');
  function setDay(day) {
    stack.classList.toggle('day-front', day);
    placePhotos.classList.toggle('is-night', !day);
    swap.textContent = day ? 'Ver à noite' : 'Ver de dia';
  }
  swap.addEventListener('click', () => setDay(!stack.classList.contains('day-front')));
  stack.querySelector('.shot-day').addEventListener('click', () => setDay(true));
  stack.querySelector('.shot-night').addEventListener('click', () => setDay(false));
  setDay(false);

  /* ---------- fagulhas subindo no fundo ---------- */
  const canvas = document.getElementById('embers');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1, sparks = [], emberRaf = null, lastT = 0;

  function sizeCanvas() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const want = Math.round(Math.min(56, Math.max(18, (W * H) / 26000)));
    while (sparks.length < want) sparks.push(newSpark(true));
    sparks.length = want;
  }

  function newSpark(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 14 + Math.random() * 34,
      sway: 6 + Math.random() * 18,
      ph: Math.random() * Math.PI * 2,
      life: 0.35 + Math.random() * 0.55,
      hue: 22 + Math.random() * 18
    };
  }

  function drawEmbers(t) {
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000);
    lastT = t;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const s of sparks) {
      s.y -= s.vy * dt;
      s.ph += dt * 1.4;
      const x = s.x + Math.sin(s.ph) * s.sway;
      const fade = Math.max(0, Math.min(1, s.y / H)) * s.life;   // apagam enquanto sobem
      if (s.y < -10 || fade <= 0.01) { Object.assign(s, newSpark(false)); continue; }
      const g = ctx.createRadialGradient(x, s.y, 0, x, s.y, s.r * 4);
      g.addColorStop(0, `hsla(${s.hue},100%,70%,${fade})`);
      g.addColorStop(1, `hsla(${s.hue},100%,50%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, s.y, s.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    emberRaf = requestAnimationFrame(drawEmbers);
  }

  function startEmbers() {
    if (emberRaf !== null || reduced || document.hidden) return;
    lastT = 0;
    emberRaf = requestAnimationFrame(drawEmbers);
  }
  function stopEmbers() {
    if (emberRaf !== null) cancelAnimationFrame(emberRaf);
    emberRaf = null;
    if (reduced) ctx.clearRect(0, 0, W, H);
  }

  let resizeT;
  addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(sizeCanvas, 150); });
  sizeCanvas();
  startEmbers();

  /* ---------- movimento reduzido, ao vivo nas duas direções ---------- */
  reduceMQ.addEventListener('change', e => {
    reduced = e.matches;
    syncAll();
    if (reduced) {
      stopEmbers();
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    } else {
      startEmbers();
    }
  });

  /* ---------- aba escondida: tudo pausa ---------- */
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
    if (document.hidden) stopEmbers();
    else startEmbers();
    syncAll();
  });
})();
