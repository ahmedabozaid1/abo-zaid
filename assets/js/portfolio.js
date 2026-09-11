'use strict';
// Navigation remains visible and content stays accessible when JavaScript is off.
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.hidden = !window.matchMedia('(max-width: 800px)').matches;
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation menu');
  menu.querySelector('.menu-label').textContent = 'Menu';
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
  menu.querySelector('.menu-label').textContent = expanded ? 'Close' : 'Menu';
  navigation.classList.toggle('is-open', expanded);
  document.body.classList.toggle('menu-open', expanded);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', (event) => {
  if (menu.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(max-width: 800px)').addEventListener('change', (event) => {
  menu.hidden = !event.matches;
  closeMenu();
});
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}

// Decorative canvas: no input interception, no layout work during pointer moves.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  let width = 0, height = 0, frame = 0, previous = 0, particles = [];
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false, strength: 0 };
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.min(65, Math.floor(width * height / 18000)) }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      size: .7 + Math.random() * 1.1, phase: Math.random() * Math.PI * 2
    }));
    if (!mouse.active) {
      mouse.x = mouse.targetX = width * .65;
      mouse.y = mouse.targetY = height * .35;
    }
  }
  function glow(x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(70,150,165,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function draw(time) {
    frame = 0;
    const delta = Math.min((time - previous) / 16.67 || 1, 2);
    previous = time;
    ctx.clearRect(0, 0, width, height);
    mouse.x += (mouse.targetX - mouse.x) * .075 * delta;
    mouse.y += (mouse.targetY - mouse.y) * .075 * delta;
    mouse.strength += ((mouse.active ? 1 : 0) - mouse.strength) * .035 * delta;
    const t = time * .00012;
    glow(width * (.7 + Math.sin(t) * .13), height * (.3 + Math.cos(t * .7) * .15), Math.min(width, 650), 'rgba(52,115,132,.10)');
    glow(width * (.2 + Math.cos(t * .8) * .12), height * .8, 450, 'rgba(64,113,125,.07)');
    if (mouse.strength > .01) {
      glow(mouse.x, mouse.y, 310, `rgba(105,192,199,${.13 * mouse.strength})`);
      glow(mouse.x, mouse.y, 95, `rgba(142,220,221,${.055 * mouse.strength})`);
    }
    particles.forEach((p, i) => {
      p.x += p.vx * delta; p.y += p.vy * delta;
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 230 && distance > 1 && mouse.strength > .01) {
        const force = (1 - distance / 230) * .28 * mouse.strength * delta;
        p.x += dx / distance * force; p.y += dy / distance * force;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
      const near = Math.max(0, 1 - distance / 260) * mouse.strength;
      ctx.fillStyle = `rgba(153,207,211,${.17 + .08 * Math.sin(t * 4 + p.phase) + near * .38})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size + near * .6, 0, Math.PI * 2); ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], gap = Math.hypot(p.x - q.x, p.y - q.y);
        if (gap > 130) continue;
        ctx.strokeStyle = `rgba(135,198,206,${(1 - gap / 130) * (.055 + near * .17)})`;
        ctx.lineWidth = .7;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    });
    frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    const enabled = !motion.matches && pointer.matches;
    canvas.hidden = !enabled;
    if (enabled && !document.hidden) frame = requestAnimationFrame(draw);
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    mouse.targetX = event.clientX; mouse.targetY = event.clientY; mouse.active = true;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { mouse.active = false; });
  window.addEventListener('blur', () => { mouse.active = false; });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  pointer.addEventListener('change', sync);
  resize(); sync();
})();
