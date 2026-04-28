import { gsap, motionOK } from '../lib/gsap-setup.js';
import { hero } from '../data/content.js';

function wrapWords(str) {
  return str
    .split(' ')
    .map((w) => `<span class="word"><span>${w}</span></span>`)
    .join(' ');
}

export function mountHero() {
  const el = document.getElementById('hero');
  if (!el) return;

  el.innerHTML = `
    <div class="container hero">
      <div class="hero__top">
        <span class="eyebrow hero__eyebrow">${hero.eyebrow}</span>
        <div class="hero__roles" aria-hidden="true">
          ${hero.roles.map((r) => `<span>${r}</span>`).join('')}
        </div>
      </div>
      <h1 id="hero-name" class="hero__name">${wrapWords(hero.name)}</h1>
      <div class="hero__bottom">
        <p class="hero__opening">${hero.opening}</p>
        <div class="hero__meta">
          ${hero.meta
            .map(
              (m) => `
            <div class="hero__meta-item">
              <span class="hero__meta-k">${m.k}</span>
              <span class="hero__meta-v">${m.v}</span>
            </div>`
            )
            .join('')}
        </div>
      </div>
      <div class="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span class="hero__scroll-line"></span>
      </div>
    </div>
  `;

  if (!motionOK) return;

  const words = el.querySelectorAll('.hero__name .word > span');
  const eyebrow = el.querySelector('.hero__eyebrow');
  const roles = el.querySelectorAll('.hero__roles span');
  const opening = el.querySelector('.hero__opening');
  const metaItems = el.querySelectorAll('.hero__meta-item');

  gsap.set(words, { yPercent: 110, rotate: 4 });
  gsap.set([eyebrow, opening], { opacity: 0, y: 20 });
  gsap.set(roles, { opacity: 0, y: 12 });
  gsap.set(metaItems, { opacity: 0, y: 24 });

  const tl = gsap.timeline({ delay: 1.4 });

  tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
    .to(words, {
      yPercent: 0,
      rotate: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.06,
    }, '-=0.4')
    .to(roles, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out' }, '-=0.6')
    .to(opening, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.5')
    .to(metaItems, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, '-=0.5');
}
