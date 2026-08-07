import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { heroes } from '../data/content.js';

// Static brand SVGs live under public/icons/ — sourced from Simple Icons (CC0).
const BASE = import.meta.env.BASE_URL;
const LINKEDIN_ICON = `<img src="${BASE}icons/linkedin.svg" width="16" height="16" alt="" aria-hidden="true" class="hero-card__link-icon hero-card__link-icon--linkedin" />`;
const WHATSAPP_ICON = `<img src="${BASE}icons/whatsapp.svg" width="16" height="16" alt="" aria-hidden="true" class="hero-card__link-icon hero-card__link-icon--whatsapp" />`;
const WEBSITE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="hero-card__link-icon hero-card__link-icon--website"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>`;

// Strip protocol/trailing-slash from a URL to show a clean display label like "voxif.tech".
function prettyDomain(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

// Turn "+92 316 2423504" into a wa.me deep link (only digits, no leading plus).
function whatsappHref(number) {
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}`;
}

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

function renderContact(person) {
  const parts = [];
  if (person.website) {
    parts.push(`<a class="hero-card__link hero-card__link--website" href="${person.website}" target="_blank" rel="noopener" aria-label="Visit ${prettyDomain(person.website)}">
        ${WEBSITE_ICON}
        <span>${prettyDomain(person.website)}</span>
      </a>`);
  }
  if (person.linkedin) {
    parts.push(`<a class="hero-card__link hero-card__link--linkedin" href="${person.linkedin}" target="_blank" rel="noopener" aria-label="${person.name} on LinkedIn">
        ${LINKEDIN_ICON}
        <span>LinkedIn</span>
      </a>`);
  } else {
    parts.push(`<span class="hero-card__link hero-card__link--pending mono">LinkedIn — pending</span>`);
  }
  if (person.whatsapp) {
    parts.push(`<a class="hero-card__link hero-card__link--whatsapp" href="${whatsappHref(person.whatsapp)}" target="_blank" rel="noopener" aria-label="Message ${person.name} on WhatsApp">
        ${WHATSAPP_ICON}
        <span>WhatsApp</span>
      </a>`);
  }
  return parts.join('');
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
                ${renderContact(p)}
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
        y: 24,
        duration: 0.7,
        stagger: 0.05,
        ease: 'expo.out',
        overwrite: true,
        clearProps: 'transform,will-change',
      }),
    once: true,
  });
}
