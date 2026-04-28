import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { nav } from '../data/content.js';

export function mountNav() {
  const el = document.getElementById('nav');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <div class="nav__inner">
        <a href="#hero" class="nav__brand" data-cursor>
          <span class="nav__brand-mark"></span>
          <span class="nav__brand-full">${nav.brand}</span>
          <span class="nav__brand-short">AAK</span>
        </a>
        <nav class="nav__links" aria-label="Primary">
          ${nav.links.map((l) => `<a class="nav__link" href="${l.href}">${l.label}</a>`).join('')}
        </nav>
        <a href="#contact" class="nav__cta" data-magnetic="0.18"><span>Get in touch</span></a>
      </div>
    </div>
  `;

  let lastY = 0;
  let revealed = true;

  ScrollTrigger.create({
    start: 'top -1',
    end: 99999,
    onUpdate: (self) => {
      const y = self.scroll();
      const goingDown = y > lastY;
      el.classList.toggle('is-scrolled', y > 24);

      if (Math.abs(y - lastY) > 6) {
        if (goingDown && y > 200 && revealed) {
          el.classList.add('is-hidden');
          revealed = false;
        } else if (!goingDown && !revealed) {
          el.classList.remove('is-hidden');
          revealed = true;
        }
        lastY = y;
      }
    },
  });

  // Color-invert when on dark sections
  document.querySelectorAll('.section--dark, .footer').forEach((darkEl) => {
    ScrollTrigger.create({
      trigger: darkEl,
      start: 'top 64',
      end: 'bottom 64',
      onEnter: () => el.classList.add('is-on-dark'),
      onLeave: () => el.classList.remove('is-on-dark'),
      onEnterBack: () => el.classList.add('is-on-dark'),
      onLeaveBack: () => el.classList.remove('is-on-dark'),
    });
  });

  // Active link tracking
  const links = el.querySelectorAll('.nav__link');
  document.querySelectorAll('main > section').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${sec.id}`));
        }
      },
    });
  });

  // Smooth-scroll on link click (Lenis already covers this; small assist)
  el.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: motionOK ? 'smooth' : 'auto', block: 'start' });
      }
    });
  });

  // Initial reveal
  gsap.from(el, { y: -60, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 1.6 });
}
