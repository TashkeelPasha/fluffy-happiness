import { gsap, motionOK } from '../lib/gsap-setup.js';
import { hero } from '../data/content.js';

function wrapWords(str) {
  return str
    .split(' ')
    .map((w) => `<span class="word"><span>${w}</span></span>`)
    .join(' ');
}

const ICONS = {
  linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path fill="#0A66C2" d="M20.45 20.45h-3.55v-5.56c0-1.32-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm-1.78 13.02h3.55V9H3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z"/>
  </svg>`,
};

function renderCta(c) {
  const target = c.external ? ' target="_blank" rel="noopener"' : '';
  if (c.icon && ICONS[c.icon]) {
    return `<a class="btn btn--${c.kind} btn--icon" href="${c.href}"${target} aria-label="${c.label}" title="${c.label}">${ICONS[c.icon]}</a>`;
  }
  return `<a class="btn btn--${c.kind}" href="${c.href}"${target} data-magnetic="0.18">${c.label}</a>`;
}

export function mountHero() {
  const el = document.getElementById('hero');
  if (!el) return;

  const portraitSrc = `${import.meta.env.BASE_URL}images/headshot.jpg`.replace(/\/+/g, '/');

  el.innerHTML = `
    <div class="container hero">
      <div class="hero__top">
        <span class="hero__top-left mono">— ${hero.topLeft}</span>
        <span class="hero__top-right mono">${hero.topRight}</span>
      </div>

      <div class="hero__main">
        <div class="hero__text">
          <ol class="hero__stats" aria-label="Headline outcomes">
            ${hero.stats
              .map(
                (s) => `<li class="hero__stat">${wrapWords(s)}</li>`
              )
              .join('')}
          </ol>

          <div class="hero__attribution">
            <h1 id="hero-name" class="hero__name">${hero.name}</h1>
            <span class="hero__bullets-label">${hero.bulletsLabel}</span>
            <ul class="hero__bullets">
              ${hero.bullets.map((b) => `<li>${b}</li>`).join('')}
            </ul>
            ${
              hero.ctas?.length
                ? `<div class="hero__ctas">
                    ${hero.ctas.map(renderCta).join('')}
                  </div>`
                : ''
            }
          </div>
        </div>

        <figure class="hero__portrait" aria-hidden="true">
          <div class="hero__portrait-frame">
            <img
              src="${portraitSrc}"
              alt="Portrait of Aamir Ahsan Khan"
              width="496"
              height="503"
              loading="eager"
              decoding="async"
            />
            <span class="hero__portrait-rule"></span>
            <span class="hero__portrait-tag">Principal</span>
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

  const statWords = el.querySelectorAll('.hero__stat .word > span');
  const topL = el.querySelector('.hero__top-left');
  const topR = el.querySelector('.hero__top-right');
  const attribution = el.querySelector('.hero__attribution');
  const portrait = el.querySelector('.hero__portrait-frame');
  const portraitTag = el.querySelector('.hero__portrait-tag');
  const portraitRule = el.querySelector('.hero__portrait-rule');
  const metaItems = el.querySelectorAll('.hero__meta-item');

  gsap.set(statWords, { yPercent: 110, rotate: 3 });
  gsap.set([topL, topR], { opacity: 0, y: 14 });
  gsap.set(attribution, { opacity: 0, y: 24 });
  gsap.set(metaItems, { opacity: 0, y: 20 });
  gsap.set(portrait, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 });
  gsap.set(portraitTag, { opacity: 0, x: -16 });
  gsap.set(portraitRule, { scaleX: 0 });

  const tl = gsap.timeline({ delay: 1.4 });

  tl.to([topL, topR], { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' })
    .to(statWords, {
      yPercent: 0,
      rotate: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.04,
    }, '-=0.4')
    .to(portrait, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.3, ease: 'expo.out' }, '-=0.9')
    .to(portraitRule, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, '-=0.9')
    .to(portraitTag, { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out' }, '-=0.5')
    .to(attribution, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.7')
    .to(metaItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'expo.out' }, '-=0.5');

  // Subtle parallax on the portrait
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
