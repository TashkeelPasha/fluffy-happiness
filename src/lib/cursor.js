import { gsap } from './gsap-setup.js';

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  document.body.append(dot, ring);

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.05, overwrite: true });
  });

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });

  document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.35;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gsap.to(el, {
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    });
  });
}
