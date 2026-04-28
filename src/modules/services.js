import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { services } from '../data/content.js';

export function mountServices() {
  const el = document.getElementById('services');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="services__head">
        <div class="flex-col" style="gap:1.25rem">
          <span class="eyebrow">${services.eyebrow}</span>
          <h2 id="services-title" class="services__title">${services.title}</h2>
        </div>
        <p class="body-l" style="max-width:36ch">Eight disciplines, one ethic — every engagement underwritten by integrity, transparency, and the long view.</p>
      </header>
      <div class="services__list">
        ${services.items
          .map(
            (s, i) => `
          <div class="service" data-cursor>
            <span class="service__n">${(i + 1).toString().padStart(2, '0')}</span>
            <span class="service__name">${s}</span>
          </div>`
          )
          .join('')}
      </div>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.services__head > *'), {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  });

  ScrollTrigger.batch('.service', {
    start: 'top 90%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.06,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });
}
