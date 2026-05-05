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

  // Use Vite's BASE_URL so the image resolves both in dev (/) and on Pages (/fluffy-happiness/)
  const portraitSrc = `${import.meta.env.BASE_URL}images/headshot.png`.replace(/\/+/g, '/');

  el.innerHTML = `
    <div class="container hero">
      <div class="hero__top">
        <span class="eyebrow hero__eyebrow">${hero.eyebrow}</span>
        <div class="hero__roles" aria-hidden="true">
          ${hero.roles.map((r) => `<span>${r}</span>`).join('')}
        </div>
      </div>

      <div class="hero__main">
        <div class="hero__text">
          <h1 id="hero-name" class="hero__name">${wrapWords(hero.name)}</h1>
          <p class="hero__opening">${hero.opening}</p>
        </div>

        <figure class="hero__portrait" aria-hidden="true">
          <div class="hero__portrait-frame">
            <img
              src="${portraitSrc}"
              alt="Portrait of Aamir Ahsan Khan"
              width="664"
              height="1292"
              loading="eager"
              decoding="async"
            />
            <span class="hero__portrait-rule"></span>
            <span class="hero__portrait-tag">London · 2026</span>
          </div>
        </figure>
      </div>

      <div class="hero__bottom">
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
        <div class="hero__scroll" aria-hidden="true">
          <span>Scroll</span>
          <span class="hero__scroll-line"></span>
        </div>
      </div>
    </div>
  `;

  if (!motionOK) return;

  const words = el.querySelectorAll('.hero__name .word > span');
  const eyebrow = el.querySelector('.hero__eyebrow');
  const roles = el.querySelectorAll('.hero__roles span');
  const opening = el.querySelector('.hero__opening');
  const portrait = el.querySelector('.hero__portrait-frame');
  const portraitTag = el.querySelector('.hero__portrait-tag');
  const portraitRule = el.querySelector('.hero__portrait-rule');
  const metaItems = el.querySelectorAll('.hero__meta-item');

  gsap.set(words, { yPercent: 110, rotate: 4 });
  gsap.set([eyebrow, opening], { opacity: 0, y: 20 });
  gsap.set(roles, { opacity: 0, y: 12 });
  gsap.set(metaItems, { opacity: 0, y: 24 });
  gsap.set(portrait, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 });
  gsap.set(portraitTag, { opacity: 0, x: -20 });
  gsap.set(portraitRule, { scaleX: 0 });

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
    .to(portrait, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.4, ease: 'expo.out' }, '-=0.9')
    .to(portraitRule, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, '-=0.9')
    .to(portraitTag, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' }, '-=0.5')
    .to(opening, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.8')
    .to(metaItems, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, '-=0.6');

  // Subtle parallax on the portrait as you scroll
  gsap.to(portrait, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  });
}
