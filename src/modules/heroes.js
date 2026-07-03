import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { heroes } from '../data/content.js';

const LINKEDIN_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
  <path fill="#0A66C2" d="M20.45 20.45h-3.55v-5.56c0-1.32-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm-1.78 13.02h3.55V9H3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z"/>
</svg>`;

function renderPhoto(person) {
  if (person.photo) {
    const src = `${import.meta.env.BASE_URL}${person.photo}`.replace(/\/+/g, '/');
    return `<img class="hero-card__photo" src="${src}" alt="${person.name}" loading="lazy" decoding="async" />`;
  }
  return `<div class="hero-card__photo hero-card__photo--placeholder" aria-hidden="true">
      <span class="hero-card__initials">${person.initials || ''}</span>
      <span class="hero-card__photo-tag mono">Photo pending</span>
    </div>`;
}

function renderLinkedIn(person) {
  if (person.linkedin) {
    return `<a class="hero-card__linkedin" href="${person.linkedin}" target="_blank" rel="noopener" aria-label="${person.name} on LinkedIn">
        ${LINKEDIN_ICON}
        <span>Connect on LinkedIn</span>
      </a>`;
  }
  return `<span class="hero-card__linkedin hero-card__linkedin--pending mono" aria-hidden="true">LinkedIn — pending</span>`;
}

export function mountHeroes() {
  const el = document.getElementById('heroes');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="heroes__head">
        <div class="heroes__head-left">
          <span class="eyebrow heroes__eyebrow">${heroes.eyebrow}</span>
          <h2 id="heroes-title" class="heroes__title">${heroes.title}</h2>
        </div>
        <p class="heroes__intro">${heroes.intro}</p>
      </header>

      <ol class="heroes__list" role="list">
        ${heroes.items
          .map(
            (p) => `
          <li class="hero-card" data-cursor>
            <div class="hero-card__media">
              ${renderPhoto(p)}
            </div>
            <div class="hero-card__body">
              <h3 class="hero-card__name">${p.name}</h3>
              <ul class="hero-card__ventures" role="list">
                ${p.ventures
                  .map(
                    (v) => `
                  <li class="hero-card__venture">
                    <span class="hero-card__venture-name">${v.name}</span>
                    <p class="hero-card__venture-desc">${v.description}</p>
                  </li>`
                  )
                  .join('')}
              </ul>
              <footer class="hero-card__foot">
                ${renderLinkedIn(p)}
              </footer>
            </div>
          </li>`
          )
          .join('')}
      </ol>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.heroes__head > *'), {
    opacity: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
  });

  ScrollTrigger.batch('.hero-card', {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 60,
        duration: 1.1,
        stagger: 0.14,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });
}
