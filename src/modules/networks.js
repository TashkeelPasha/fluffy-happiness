import { gsap, motionOK } from '../lib/gsap-setup.js';
import { networks } from '../data/content.js';

export function mountNetworks() {
  const el = document.getElementById('networks');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="networks__head">
        <div class="networks__head-left">
          <span class="eyebrow networks__eyebrow">${networks.eyebrow}</span>
          <h2 id="networks-title" class="networks__title">${networks.title}</h2>
        </div>
        <p class="networks__intro">${networks.intro}</p>
      </header>

      <div class="networks__grid">
        ${networks.columns
          .map(
            (col) => `
          <div class="netcol">
            <span class="netcol__label">${col.label}</span>
            <ul class="netcol__list">
              ${col.items.map((it) => `<li>${it}</li>`).join('')}
            </ul>
          </div>`
          )
          .join('')}
      </div>

      <p class="networks__foot">${networks.foot}</p>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.networks__head > *'), {
    opacity: 0,
    y: 26,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
  });

  gsap.from(el.querySelectorAll('.netcol'), {
    opacity: 0,
    y: 40,
    duration: 0.9,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.networks__grid', start: 'top 85%' },
  });

  gsap.from(el.querySelector('.networks__foot'), {
    opacity: 0,
    y: 16,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.networks__foot', start: 'top 95%' },
  });
}
