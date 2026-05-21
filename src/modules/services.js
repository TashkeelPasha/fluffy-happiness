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
        <p class="services__intro">${services.intro}</p>
      </header>

      <ol class="mandates" role="list">
        ${services.items
          .map(
            (m) => `
          <li class="mandate" data-cursor>
            <header class="mandate__top">
              <span class="mandate__n">${m.n}</span>
              <span class="mandate__rule" aria-hidden="true"></span>
            </header>
            <h3 class="mandate__title">${m.title}</h3>
            <p class="mandate__scope">${m.scope}</p>
            <div class="mandate__meta">
              <span class="mandate__meta-label">Ideal counterparty</span>
              <span class="mandate__meta-value">${m.counterparty}</span>
            </div>
          </li>`
          )
          .join('')}
      </ol>

      <p class="services__note">${services.note}</p>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.services__head > *'), {
    opacity: 0,
    y: 26,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
  });

  ScrollTrigger.batch('.mandate', {
    start: 'top 90%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 48,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });

  gsap.from(el.querySelector('.services__note'), {
    opacity: 0,
    y: 16,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.services__note', start: 'top 95%' },
  });
}
