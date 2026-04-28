import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { pillars } from '../data/content.js';

export function mountPillars() {
  const el = document.getElementById('pillars');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="pillars__head">
        <div class="flex-col" style="gap:1.25rem">
          <span class="eyebrow">${pillars.eyebrow}</span>
          <h2 id="pillars-title" class="pillars__title">${pillars.title}</h2>
        </div>
        <p class="pillars__intro">${pillars.body}</p>
      </header>
      <ol class="pillars__list" role="list">
        ${pillars.items
          .map(
            (p) => `
          <li class="pillar">
            <span class="pillar__n">${p.n}</span>
            <h3 class="pillar__title">${p.title}</h3>
            <p class="pillar__body">${p.body}</p>
          </li>`
          )
          .join('')}
      </ol>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.pillars__head > *'), {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  });

  gsap.utils.toArray('.pillar').forEach((row) => {
    gsap.from(row.children, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.06,
      ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 85%' },
    });
  });
}
