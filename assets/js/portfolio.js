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


// Interactive cover-inspired planes. No animation loop runs while idle.
(() => {
  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const scene = document.createElement('div');
  scene.className = 'diagonal-scene';
  scene.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 4; i++) scene.append(document.createElement('span'));
  document.body.prepend(scene);
  const surfaces = document.querySelectorAll('.project, .education-card, .publication, .mention-link, .portrait-wrap');
  let frame = 0, active = null, point = null, x = 0, y = 0, progress = 0;
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      root.style.setProperty('--plane-x', x + 'px');
      root.style.setProperty('--plane-y', y + 'px');
      root.style.setProperty('--reading-progress', progress);
      if (active && point) {
        const rect = active.getBoundingClientRect();
        active.style.setProperty('--light-x', point.x - rect.left + 'px');
        active.style.setProperty('--light-y', point.y - rect.top + 'px');
      }
    });
  }
  const enabled = () => !motion.matches && pointer.matches;
  function reset() {
    x = y = 0; active = point = null;
    surfaces.forEach(surface => surface.classList.remove('is-lit'));
    schedule();
  }
  function updateProgress() {
    const total = root.scrollHeight - innerHeight;
    progress = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
    schedule();
  }
  window.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    x = (event.clientX / innerWidth - .5) * 26;
    y = (event.clientY / innerHeight - .5) * 20;
    point = { x: event.clientX, y: event.clientY };
    schedule();
  }, { passive: true });
  surfaces.forEach(surface => {
    surface.addEventListener('pointerenter', event => {
      if (!enabled()) return;
      active = surface; point = { x: event.clientX, y: event.clientY };
      surface.classList.add('is-lit'); schedule();
    });
    surface.addEventListener('pointerleave', () => {
      surface.classList.remove('is-lit');
      if (active === surface) active = point = null;
    });
  });
  root.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  motion.addEventListener('change', reset);
  pointer.addEventListener('change', reset);
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('load', updateProgress, { once: true });
  updateProgress();
})();
